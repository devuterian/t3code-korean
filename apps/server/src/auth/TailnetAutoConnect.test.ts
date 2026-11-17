import * as NodeServices from "@effect/platform-node/NodeServices";
import * as NodePlatformCrypto from "@effect/platform-node/NodeCrypto";
import type { ExecutionEnvironmentDescriptor } from "@t3tools/contracts";
import {
  TailscaleStatusParseError,
  type TailscalePeers,
  type TailscaleWhois,
} from "@t3tools/tailscale";
import { assert, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as TestClock from "effect/testing/TestClock";

import * as ServerConfig from "../config.ts";
import * as ServerEnvironment from "../environment/ServerEnvironment.ts";
import * as SqlitePersistence from "../persistence/Sqlite.ts";
import * as ManagedPolicy from "../policy/ManagedPolicy.ts";
import * as EnvironmentAuth from "./EnvironmentAuth.ts";
import * as ServerSecretStore from "./ServerSecretStore.ts";
import * as TailnetAutoConnect from "./TailnetAutoConnect.ts";

const layerEnvironmentAuth = EnvironmentAuth.layer.pipe(
  Layer.provide(ManagedPolicy.layerTest()),
  Layer.provide(SqlitePersistence.layerMemory),
  Layer.provide(ServerSecretStore.layer),
  Layer.provide(ServerEnvironment.layerIdentity),
  Layer.provide(ServerConfig.layerTest(process.cwd(), { prefix: "t3-tailnet-test-" })),
  Layer.provide(Layer.mergeAll(NodeServices.layer, NodePlatformCrypto.layer)),
);

const SELF_USER = 4;
const whoisOf = (overrides: Partial<TailscaleWhois> = {}): TailscaleWhois => ({
  nodeName: "z-flip5.tail.example",
  tagged: false,
  user: { id: SELF_USER, loginName: "owner" },
  ...overrides,
});

const peerOf = (
  hostName: string,
  ip: string,
  overrides: Partial<TailscalePeers["peers"][number]> = {},
): TailscalePeers["peers"][number] => ({
  hostName,
  dnsName: `${hostName}.tail.example`,
  tailnetIpv4Addresses: [ip],
  userId: SELF_USER,
  online: true,
  tagged: false,
  os: "linux",
  ...overrides,
});

const peersOf = (peers: TailscalePeers["peers"]): TailscalePeers => ({
  running: true,
  selfUserId: SELF_USER,
  selfIpv4Addresses: ["100.64.0.17"],
  selfDnsName: "suwon.tail.example",
  peers,
});

const descriptorOf = (environmentId: string, label: string) =>
  ({ environmentId, label }) as unknown as ExecutionEnvironmentDescriptor;

const makeService = (input: {
  readonly enabled?: boolean;
  readonly whois?: TailscaleWhois | "fail";
  readonly peers?: TailscalePeers;
  readonly probe?: (url: string) => Option.Option<ExecutionEnvironmentDescriptor>;
}) =>
  Effect.gen(function* () {
    const auth = yield* EnvironmentAuth.EnvironmentAuth;
    const probed: Array<string> = [];
    const service = yield* TailnetAutoConnect.makeTailnetAutoConnect({
      isEnabled: Effect.succeed(input.enabled ?? true),
      port: 3773,
      whois: () =>
        input.whois === "fail"
          ? Effect.fail(new TailscaleStatusParseError({ cause: "cli failed" }))
          : Effect.succeed(input.whois ?? whoisOf()),
      readPeers: Effect.succeed(input.peers ?? peersOf([])),
      probe: (url) => {
        probed.push(url);
        return Effect.succeed(input.probe?.(url) ?? Option.none());
      },
      createPairingLink: auth.createPairingLink,
    });
    return { auth, service, probed };
  });

const refusalOf = <A, E>(effect: Effect.Effect<A, E>) =>
  effect.pipe(
    Effect.flip,
    Effect.map((error) => (error as TailnetAutoConnect.TailnetAutoConnectRefusedError).reason),
  );

it.layer(layerEnvironmentAuth)("TailnetAutoConnect", (it) => {
  it.effect("refuses everything while the setting is off", () =>
    Effect.gen(function* () {
      const { service } = yield* makeService({ enabled: false });
      assert.strictEqual(yield* refusalOf(service.issueCredential("100.64.0.21")), "disabled");
      assert.strictEqual(yield* refusalOf(service.listPeers()), "disabled");
    }),
  );

  it.effect("refuses callers that are not on the tailnet", () =>
    Effect.gen(function* () {
      const { service } = yield* makeService({});
      for (const address of [undefined, "192.168.0.5", "127.0.0.1", "100.128.0.1", "fd00::1"]) {
        assert.strictEqual(
          yield* refusalOf(service.issueCredential(address)),
          "not_tailnet_address",
        );
      }
    }),
  );

  it.effect("refuses a different tailnet user and a tagged node", () =>
    Effect.gen(function* () {
      const other = yield* makeService({ whois: whoisOf({ user: { id: 9, loginName: "x" } }) });
      assert.strictEqual(
        yield* refusalOf(other.service.issueCredential("100.64.0.21")),
        "user_mismatch",
      );
      const tagged = yield* makeService({ whois: whoisOf({ tagged: true, user: null }) });
      assert.strictEqual(
        yield* refusalOf(tagged.service.issueCredential("100.64.0.21")),
        "tagged_node",
      );
      const noProfile = yield* makeService({ whois: whoisOf({ user: null }) });
      assert.strictEqual(
        yield* refusalOf(noProfile.service.issueCredential("100.64.0.21")),
        "identity_unavailable",
      );
      const broken = yield* makeService({ whois: "fail" });
      assert.strictEqual(
        yield* refusalOf(broken.service.issueCredential("100.64.0.21")),
        "identity_unavailable",
      );
    }),
  );

  it.effect("mints a one-time credential for the same user that redeems once", () =>
    Effect.gen(function* () {
      const { auth, service } = yield* makeService({});
      const issued = yield* service.issueCredential("100.64.0.21");
      const metadata = { deviceType: "mobile" as const };
      const session = yield* auth.createBrowserSession(issued.credential, metadata);
      assert.isString(session.sessionToken);
      const replay = yield* Effect.flip(auth.createBrowserSession(issued.credential, metadata));
      assert.isDefined(replay);
      // IPv6 tailnet addresses count too.
      yield* service.issueCredential("fd7a:115c:a1e0::15");
    }),
  );

  it.effect("refuses web pages from outside this tailnet user", () =>
    Effect.gen(function* () {
      const { service } = yield* makeService({
        peers: peersOf([
          peerOf("laptop", "100.64.0.21"),
          peerOf("friend", "100.64.0.99", { userId: 9 }),
        ]),
      });
      // Each call uses its own caller address so the rate limit never interferes.
      let caller = 100;
      const refusal = (origin: string) =>
        refusalOf(service.issueCredential(`100.64.1.${caller++}`, origin));
      assert.strictEqual(yield* refusal("https://evil.example"), "untrusted_origin");
      assert.strictEqual(
        yield* refusal("http://suwon.tail.example.evil.example"),
        "untrusted_origin",
      );
      assert.strictEqual(yield* refusal("null"), "untrusted_origin");
      // Another user's tailnet address, and other ports on this host, are not this app.
      assert.strictEqual(yield* refusal("http://100.64.0.99:3773"), "untrusted_origin");
      assert.strictEqual(yield* refusal("http://100.64.0.22:3773"), "untrusted_origin");
      assert.strictEqual(yield* refusal("http://localhost:5173"), "untrusted_origin");
      assert.strictEqual(yield* refusal("http://suwon.tail.example:8080"), "untrusted_origin");
      // The desktop renderer, loopback, same-user addresses and this machine's own name are fine.
      yield* service.issueCredential("100.64.0.21", "t3code://app");
      yield* service.issueCredential("100.64.0.21", "http://localhost:3773");
      yield* service.issueCredential("100.64.0.21", "http://100.64.0.21:3773");
      yield* service.issueCredential("100.64.0.21", "http://100.64.0.17:3773");
      yield* service.issueCredential("100.64.0.21", "http://suwon.tail.example:3773");
    }),
  );

  it.effect("limits requests before it asks the Tailscale CLI", () =>
    Effect.gen(function* () {
      let cliReads = 0;
      const auth = yield* EnvironmentAuth.EnvironmentAuth;
      const service = yield* TailnetAutoConnect.makeTailnetAutoConnect({
        isEnabled: Effect.succeed(true),
        port: 3773,
        whois: () => Effect.succeed(whoisOf()),
        readPeers: Effect.sync(() => {
          cliReads++;
          return peersOf([]);
        }),
        probe: () => Effect.succeedNone,
        createPairingLink: auth.createPairingLink,
      });
      for (let attempt = 0; attempt < 10; attempt++) {
        yield* refusalOf(service.issueCredential("100.64.0.21", "http://100.64.0.22:3773"));
      }
      // Ten refusals read the host list once (cached), and the eleventh never reaches it.
      assert.strictEqual(cliReads, 1);
      assert.strictEqual(
        yield* refusalOf(service.issueCredential("100.64.0.21", "http://100.64.0.22:3773")),
        "rate_limited",
      );
      assert.strictEqual(cliReads, 1);
    }),
  );

  it.effect("rate limits one address", () =>
    Effect.gen(function* () {
      const { service } = yield* makeService({});
      for (let attempt = 0; attempt < 10; attempt++) {
        yield* service.issueCredential("100.64.0.21");
      }
      assert.strictEqual(yield* refusalOf(service.issueCredential("100.64.0.21")), "rate_limited");
      yield* service.issueCredential("100.64.0.22");
      yield* TestClock.adjust("61 seconds");
      yield* service.issueCredential("100.64.0.21");
    }),
  );

  it.effect("lists only online, untagged peers of the same user that answer as T3", () =>
    Effect.gen(function* () {
      const { service, probed } = yield* makeService({
        peers: peersOf([
          peerOf("laptop", "100.64.0.30"),
          peerOf("asleep", "100.64.0.31", { online: false }),
          peerOf("friend", "100.64.0.32", { userId: 9 }),
          peerOf("tagged", "100.64.0.33", { tagged: true }),
          peerOf("nodns", "100.64.0.34", { dnsName: null }),
          peerOf("nothing-listening", "100.64.0.35"),
        ]),
        probe: (url) =>
          url.includes("100.64.0.30")
            ? Option.some(descriptorOf("env-laptop", "Laptop"))
            : url.includes("100.64.0.34")
              ? Option.some(descriptorOf("env-nodns", "No DNS"))
              : Option.none(),
      });
      const peers = yield* service.listPeers();
      assert.deepEqual(peers, [
        {
          httpBaseUrl: "http://laptop.tail.example:3773",
          environmentId: "env-laptop",
          label: "Laptop",
        },
        { httpBaseUrl: "http://100.64.0.34:3773", environmentId: "env-nodns", label: "No DNS" },
      ]);
      assert.deepEqual([...probed].sort(), [
        "http://100.64.0.30:3773/.well-known/t3/environment",
        "http://100.64.0.34:3773/.well-known/t3/environment",
        "http://100.64.0.35:3773/.well-known/t3/environment",
      ]);
      // Cached for 30 seconds, then probed again.
      yield* service.listPeers();
      assert.lengthOf(probed, 3);
      yield* TestClock.adjust("31 seconds");
      yield* service.listPeers();
      assert.lengthOf(probed, 6);
    }),
  );
});
