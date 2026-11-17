import {
  AuthStandardClientScopes,
  ExecutionEnvironmentDescriptor,
  type AuthTailnetCredentialResult,
  type AuthTailnetPeer,
} from "@t3tools/contracts";
import {
  readTailscalePeers,
  readTailscaleWhois,
  type TailscaleCommandError,
  type TailscalePeers,
  type TailscaleStatusParseError,
  type TailscaleWhois,
} from "@t3tools/tailscale";
import { isTailnetHost } from "@t3tools/shared/hostClassification";
import * as HostProcess from "@t3tools/shared/HostProcess";
import * as Clock from "effect/Clock";
import * as Context from "effect/Context";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Ref from "effect/Ref";
import * as Schema from "effect/Schema";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/http";
import * as ChildProcessSpawner from "effect/process/ChildProcessSpawner";
import * as NodeNet from "node:net";

import * as ServerConfig from "../config.ts";
import { DESKTOP_RENDERER_ORIGINS } from "../httpCors.ts";
import type * as ManagedLimits from "../policy/managedLimits.ts";
import * as ServerSettings from "../serverSettings.ts";
import * as EnvironmentAuth from "./EnvironmentAuth.ts";

/**
 * Korean fork, tailnet auto-connect: a caller on a tailnet address owned by the same Tailscale
 * user as this server's own node pairs without a code, proven by `tailscale whois`. Fails closed.
 */

const CREDENTIAL_TTL = Duration.seconds(60);
const CREDENTIAL_SUBJECT = "tailnet-whois";
const SELF_USER_CACHE_TTL = Duration.seconds(60);
const PEERS_CACHE_TTL = Duration.seconds(30);
const PEER_PROBE_TIMEOUT = Duration.millis(1_500);
const PEER_PROBE_CONCURRENCY = 8;
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW = Duration.minutes(1);

export class TailnetAutoConnectRefusedError extends Schema.TaggedError<TailnetAutoConnectRefusedError>()(
  "TailnetAutoConnectRefusedError",
  {
    reason: Schema.Literals([
      "disabled",
      "not_tailnet_address",
      "rate_limited",
      "identity_unavailable",
      "tagged_node",
      "user_mismatch",
      "untrusted_origin",
    ]),
  },
) {
  override get message(): string {
    return "Tailnet auto-connect is not available for this request.";
  }
}

export class TailnetAutoConnect extends Context.Service<
  TailnetAutoConnect,
  {
    /**
     * `clientIp` is the caller's address as `resolveClientIpAddress` read it; `origin` is the
     * request's Origin header, absent for native clients.
     */
    readonly issueCredential: (
      clientIp: string | undefined,
      origin?: string | undefined,
    ) => Effect.Effect<
      AuthTailnetCredentialResult,
      | TailnetAutoConnectRefusedError
      | EnvironmentAuth.ServerAuthInternalError
      | ManagedLimits.ManagedPolicyRefusedError
    >;
    /** Other T3 servers on this server's tailnet user that answer right now. */
    readonly listPeers: () => Effect.Effect<
      ReadonlyArray<AuthTailnetPeer>,
      TailnetAutoConnectRefusedError
    >;
  }
>()("t3/auth/TailnetAutoConnect") {}

/** What the service needs from the outside, so tests can swap the CLI, network and clock. */
type TailscaleReadError = TailscaleCommandError | TailscaleStatusParseError;

export interface TailnetAutoConnectDependencies {
  readonly isEnabled: Effect.Effect<boolean>;
  readonly port: number;
  readonly whois: (ip: string) => Effect.Effect<TailscaleWhois, TailscaleReadError>;
  readonly readPeers: Effect.Effect<TailscalePeers, TailscaleReadError>;
  /** The descriptor a server answers at `url`, or none when nothing T3 answers in time. */
  readonly probe: (url: string) => Effect.Effect<Option.Option<ExecutionEnvironmentDescriptor>>;
  readonly createPairingLink: EnvironmentAuth.EnvironmentAuth["Service"]["createPairingLink"];
}

const isTailnetAddress = (address: string): boolean => {
  const family = NodeNet.isIP(address);
  if (family === 4) {
    const [first, second] = address.split(".").map(Number);
    return first === 100 && second! >= 64 && second! <= 127;
  }
  return family === 6 && isTailnetHost(address);
};

const LOOPBACK_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * Wildcard CORS would let any web page on the user's devices mint a credential (whois proves only
 * the device), so browser Origins must be the desktop app, loopback, or this tailnet user's hosts.
 */
const isTrustedCredentialOrigin = (
  origin: string | undefined,
  tailnetHostnames: ReadonlySet<string>,
): boolean => {
  if (origin === undefined) return true;
  if ((DESKTOP_RENDERER_ORIGINS as ReadonlyArray<string>).includes(origin)) return true;
  let hostname: string;
  try {
    hostname = new URL(origin).hostname.toLowerCase();
  } catch {
    return false;
  }
  if (LOOPBACK_HOSTNAMES.has(hostname)) return true;
  const bare = hostname.startsWith("[") ? hostname.slice(1, -1) : hostname;
  return isTailnetAddress(bare) || tailnetHostnames.has(hostname);
};

const hostLabel = (nodeName: string | null): string => {
  const label = (nodeName?.split(".")[0] ?? "").replace(/[^\p{L}\p{N}._-]/gu, "").slice(0, 63);
  return label.length > 0 ? label : "device";
};

export const makeTailnetAutoConnect = Effect.fn("TailnetAutoConnect.make")(function* (
  deps: TailnetAutoConnectDependencies,
) {
  const rateLimit = yield* Ref.make(new Map<string, { count: number; windowEnds: number }>());
  const selfUser = yield* Ref.make<{ id: number; expiresAt: number } | null>(null);
  const peersCache = yield* Ref.make<{
    peers: ReadonlyArray<AuthTailnetPeer>;
    expiresAt: number;
  } | null>(null);

  const refuse = (reason: TailnetAutoConnectRefusedError["reason"]) =>
    Effect.logDebug("tailnet auto-connect refused", { reason }).pipe(
      Effect.andThen(Effect.fail(new TailnetAutoConnectRefusedError({ reason }))),
    );

  const requireEnabled = deps.isEnabled.pipe(
    Effect.flatMap((enabled) => (enabled ? Effect.void : refuse("disabled"))),
  );

  const allowRequest = Effect.fn("TailnetAutoConnect.allowRequest")(function* (ip: string) {
    const now = yield* Clock.currentTimeMillis;
    return yield* Ref.modify(rateLimit, (current) => {
      const next = new Map(current);
      for (const [key, entry] of next) {
        if (entry.windowEnds <= now) next.delete(key);
      }
      const entry = next.get(ip);
      if (entry !== undefined && entry.count >= RATE_LIMIT_MAX_REQUESTS) {
        return [false, next] as const;
      }
      next.set(ip, {
        count: (entry?.count ?? 0) + 1,
        windowEnds: entry?.windowEnds ?? now + Duration.toMillis(RATE_LIMIT_WINDOW),
      });
      return [true, next] as const;
    });
  });

  /** This machine's own Tailscale user; cached because the credential path runs per connect. */
  const readSelfUserId = Effect.gen(function* () {
    const now = yield* Clock.currentTimeMillis;
    const cached = yield* Ref.get(selfUser);
    if (cached !== null && cached.expiresAt > now) return cached.id;
    const status = yield* deps.readPeers.pipe(Effect.option);
    if (Option.isNone(status) || !status.value.running || status.value.selfUserId === null) {
      return null;
    }
    yield* Ref.set(selfUser, {
      id: status.value.selfUserId,
      expiresAt: now + Duration.toMillis(SELF_USER_CACHE_TTL),
    });
    return status.value.selfUserId;
  });

  /** MagicDNS names of this machine and the same user's peers, for the Origin check. */
  const readOwnHostnames = deps.readPeers.pipe(
    Effect.map((status) => {
      const names = new Set<string>();
      if (status.selfDnsName !== null) names.add(status.selfDnsName.toLowerCase());
      for (const peer of status.peers) {
        if (peer.dnsName !== null && !peer.tagged && peer.userId === status.selfUserId) {
          names.add(peer.dnsName.toLowerCase());
        }
      }
      return names as ReadonlySet<string>;
    }),
    Effect.orElseSucceed((): ReadonlySet<string> => new Set()),
  );

  const issueCredential: TailnetAutoConnect["Service"]["issueCredential"] = Effect.fn(
    "TailnetAutoConnect.issueCredential",
  )(function* (clientIp, origin) {
    yield* requireEnabled;
    if (clientIp === undefined || !isTailnetAddress(clientIp)) {
      return yield* refuse("not_tailnet_address");
    }
    if (origin !== undefined && !isTrustedCredentialOrigin(origin, yield* readOwnHostnames)) {
      return yield* refuse("untrusted_origin");
    }
    if (!(yield* allowRequest(clientIp))) {
      return yield* refuse("rate_limited");
    }
    const whois = yield* deps.whois(clientIp).pipe(Effect.option);
    if (Option.isNone(whois)) return yield* refuse("identity_unavailable");
    if (whois.value.tagged) return yield* refuse("tagged_node");
    if (whois.value.user === null) return yield* refuse("identity_unavailable");
    const selfUserId = yield* readSelfUserId;
    if (selfUserId === null) return yield* refuse("identity_unavailable");
    if (whois.value.user.id !== selfUserId) return yield* refuse("user_mismatch");

    const issued = yield* deps.createPairingLink({
      scopes: AuthStandardClientScopes,
      subject: CREDENTIAL_SUBJECT,
      ttl: CREDENTIAL_TTL,
      label: `Tailnet: ${hostLabel(whois.value.nodeName)}`,
    });
    return { credential: issued.credential, expiresAt: issued.expiresAt };
  });

  const probePeers = Effect.gen(function* () {
    const status = yield* deps.readPeers.pipe(Effect.option);
    if (Option.isNone(status) || !status.value.running || status.value.selfUserId === null) {
      return [];
    }
    const { selfUserId } = status.value;
    const candidates = status.value.peers.filter(
      (peer) =>
        peer.online &&
        !peer.tagged &&
        peer.userId === selfUserId &&
        peer.tailnetIpv4Addresses.length > 0,
    );
    const probed = yield* Effect.forEach(
      candidates,
      (peer) => {
        const ip = peer.tailnetIpv4Addresses[0]!;
        return deps.probe(`http://${ip}:${deps.port}/.well-known/t3/environment`).pipe(
          Effect.map(
            Option.map((descriptor): AuthTailnetPeer => ({
              httpBaseUrl: `http://${peer.dnsName ?? ip}:${deps.port}`,
              environmentId: descriptor.environmentId,
              label: descriptor.label,
            })),
          ),
        );
      },
      { concurrency: PEER_PROBE_CONCURRENCY },
    );
    return probed.flatMap((peer) => (Option.isSome(peer) ? [peer.value] : []));
  });

  const listPeers: TailnetAutoConnect["Service"]["listPeers"] = Effect.fn(
    "TailnetAutoConnect.listPeers",
  )(function* () {
    yield* requireEnabled;
    const now = yield* Clock.currentTimeMillis;
    const cached = yield* Ref.get(peersCache);
    if (cached !== null && cached.expiresAt > now) return cached.peers;
    const peers = yield* probePeers;
    yield* Ref.set(peersCache, { peers, expiresAt: now + Duration.toMillis(PEERS_CACHE_TTL) });
    return peers;
  });

  return TailnetAutoConnect.of({ issueCredential, listPeers });
});

export const layer = Layer.effect(
  TailnetAutoConnect,
  Effect.gen(function* () {
    const config = yield* ServerConfig.ServerConfig;
    const settings = yield* ServerSettings.ServerSettingsService;
    const auth = yield* EnvironmentAuth.EnvironmentAuth;
    const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;
    const httpClient = yield* HttpClient.HttpClient;
    const platform = yield* HostProcess.Platform;

    const withCli = <A, E>(effect: Effect.Effect<A, E, ChildProcessSpawner.ChildProcessSpawner>) =>
      effect.pipe(
        Effect.provideService(ChildProcessSpawner.ChildProcessSpawner, spawner),
        Effect.provideService(HostProcess.Platform, platform),
      );

    return yield* makeTailnetAutoConnect({
      // Read per request so turning the setting off takes effect without a restart.
      isEnabled: settings.getSettings.pipe(
        Effect.map((value) => value.tailnetAutoConnect),
        Effect.orElseSucceed(() => false),
      ),
      port: config.port,
      whois: (ip) => withCli(readTailscaleWhois(ip)),
      readPeers: withCli(readTailscalePeers),
      probe: (url) =>
        httpClient.execute(HttpClientRequest.get(url)).pipe(
          Effect.flatMap(HttpClientResponse.filterStatusOk),
          Effect.flatMap(HttpClientResponse.schemaBodyJson(ExecutionEnvironmentDescriptor)),
          Effect.timeoutOption(PEER_PROBE_TIMEOUT),
          Effect.orElseSucceed(() => Option.none<ExecutionEnvironmentDescriptor>()),
        ),
      createPairingLink: auth.createPairingLink,
    });
  }),
);

/** The service with the setting off, for tests of routes that do not exercise it. */
export const layerDisabled = Layer.succeed(
  TailnetAutoConnect,
  TailnetAutoConnect.of({
    issueCredential: Effect.fn("TailnetAutoConnect.issueCredential")(function* () {
      return yield* new TailnetAutoConnectRefusedError({ reason: "disabled" });
    }),
    listPeers: Effect.fn("TailnetAutoConnect.listPeers")(function* () {
      return yield* new TailnetAutoConnectRefusedError({ reason: "disabled" });
    }),
  }),
);
