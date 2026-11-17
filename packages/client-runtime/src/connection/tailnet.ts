import { type AuthTailnetPeer, EnvironmentId } from "@t3tools/contracts";
import * as Clock from "effect/Clock";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as Stream from "effect/Stream";
import * as SubscriptionRef from "effect/SubscriptionRef";

import { deriveWsBaseUrl, normalizeHttpBaseUrl } from "../environment/endpoint.ts";
import { executeConnectedEnvironmentHttpRequest } from "../state/environmentHttpAuth.ts";
import { BearerConnectionProfile } from "./catalog.ts";
import { BearerConnectionTarget } from "./model.ts";
import * as ConnectionOnboarding from "./onboarding.ts";
import * as EnvironmentRegistry from "./registry.ts";
import { connectionRoutes, findRouteToSameAddress } from "./routes.ts";
import { requestTailnetCredential, TAILNET_REQUEST_TIMEOUT_MS } from "./tailnetCredential.ts";

/** Korean fork: tailnet auto-connect. */

/** One environment is asked for its peers at most this often. */
const TAILNET_DISCOVERY_INTERVAL_MS = 10 * 60_000;

function peerRoute(peer: AuthTailnetPeer, httpBaseUrl: string) {
  const environmentId = EnvironmentId.make(peer.environmentId);
  return {
    target: new BearerConnectionTarget({
      environmentId,
      label: peer.label,
      connectionId: `tailnet-probe:${environmentId}`,
    }),
    profile: Option.some(
      new BearerConnectionProfile({
        connectionId: `tailnet-probe:${environmentId}`,
        environmentId,
        label: peer.label,
        httpBaseUrl,
        wsBaseUrl: deriveWsBaseUrl(httpBaseUrl),
      }),
    ),
  };
}

/**
 * Pairs with each listed peer this client does not already reach at that address. A peer saved
 * under another address is added as an extra route; a switched-off one is left alone. Every
 * failure is swallowed: a peer that refuses, times out, or is a different machine is skipped.
 */
export const connectTailnetPeers = Effect.fn("clientRuntime.connection.connectTailnetPeers")(
  function* (peers: ReadonlyArray<AuthTailnetPeer>) {
    const registry = yield* EnvironmentRegistry.EnvironmentRegistry;
    const onboarding = yield* ConnectionOnboarding.ConnectionOnboarding;
    for (const peer of peers) {
      yield* Effect.gen(function* () {
        const httpBaseUrl = normalizeHttpBaseUrl(peer.httpBaseUrl);
        const environmentId = EnvironmentId.make(peer.environmentId);
        const saved = (yield* SubscriptionRef.get(registry.entries)).get(environmentId);
        if (saved !== undefined) {
          if (!saved.enabled) return;
          if (
            findRouteToSameAddress(connectionRoutes(saved), peerRoute(peer, httpBaseUrl)) !==
            undefined
          ) {
            return;
          }
        }
        const credential = yield* requestTailnetCredential(httpBaseUrl);
        if (Option.isNone(credential)) return;
        yield* onboarding.registerPairing({
          host: peer.httpBaseUrl,
          pairingCode: credential.value,
          ...(saved === undefined ? {} : { expectedEnvironmentId: environmentId }),
        });
      }).pipe(Effect.ignore);
    }
  },
);

/** Runs inside a connected environment: that server's tailnet peers, or `None` when it has the feature off. */
const fetchTailnetPeers = executeConnectedEnvironmentHttpRequest({
  group: "auth",
  method: "GET",
  url: (urls) => urls.tailnetPeers(),
  timeoutMs: TAILNET_REQUEST_TIMEOUT_MS,
  request: ({ client, headers }) => client.tailnetPeers({ headers }),
}).pipe(
  Effect.map((result) => Option.some(result.peers)),
  Effect.orElseSucceed(() => Option.none<ReadonlyArray<AuthTailnetPeer>>()),
);

/** Remembers when each environment was last asked, so a reconnect loop cannot flood the tailnet. */
export function makeTailnetDiscoveryGate(intervalMs: number = TAILNET_DISCOVERY_INTERVAL_MS) {
  const lastRunAt = new Map<EnvironmentId, number>();
  return {
    tryBegin(environmentId: EnvironmentId, now: number): boolean {
      const last = lastRunAt.get(environmentId);
      if (last !== undefined && now - last < intervalMs) return false;
      lastRunAt.set(environmentId, now);
      return true;
    },
  };
}

/**
 * When an environment finishes connecting, asks it for the other T3 servers on its tailnet and
 * pairs with them. One environment at a time, each at most every ten minutes.
 */
export const watchTailnetPeers = Effect.fn("clientRuntime.connection.watchTailnetPeers")(
  function* () {
    const registry = yield* EnvironmentRegistry.EnvironmentRegistry;
    const gate = makeTailnetDiscoveryGate();
    yield* SubscriptionRef.changes(registry.entries).pipe(
      Stream.map((entries) => [...entries.keys()]),
      Stream.changesWith(
        (previous, next) =>
          previous.length === next.length && previous.every((id, index) => id === next[index]),
      ),
      Stream.switchMap((ids) =>
        Stream.mergeAll(
          ids.map((environmentId) =>
            registry.stateChanges(environmentId).pipe(
              Stream.map((state) => state.phase === "connected"),
              Stream.changesWith((previous, next) => previous === next),
              Stream.filter((connected) => connected),
              Stream.map(() => environmentId),
              Stream.catch(() => Stream.empty),
            ),
          ),
          { concurrency: "unbounded" },
        ),
      ),
      Stream.runForEach((environmentId) =>
        Effect.gen(function* () {
          if (!gate.tryBegin(environmentId, yield* Clock.currentTimeMillis)) return;
          const peers = yield* registry.run(environmentId, fetchTailnetPeers);
          if (Option.isSome(peers) && peers.value.length > 0) {
            yield* connectTailnetPeers(peers.value);
          }
        }).pipe(Effect.ignore),
      ),
    );
  },
);
