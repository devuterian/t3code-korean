import { EnvironmentId } from "@t3tools/contracts";
import { describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as SubscriptionRef from "effect/SubscriptionRef";

import * as RpcHttp from "../rpc/http.ts";
import { BearerConnectionProfile, type ConnectionCatalogEntry } from "./catalog.ts";
import { BearerConnectionTarget, PrimaryConnectionTarget } from "./model.ts";
import * as ConnectionOnboarding from "./onboarding.ts";
import type { PairingConnectionInput } from "./onboarding.ts";
import * as EnvironmentRegistry from "./registry.ts";
import { makeTailnetDismissals, TailnetDismissals } from "./tailnetDismissals.ts";
import { connectTailnetPeers, makeTailnetDiscoveryGate } from "./tailnet.ts";
import { withTailnetCredential } from "./tailnetCredential.ts";

const envId = (value: string) => EnvironmentId.make(value);

function savedEntry(
  id: string,
  httpBaseUrl: string,
  options?: { readonly enabled?: boolean },
): ConnectionCatalogEntry {
  const connectionId = `bearer:${id}:${httpBaseUrl}`;
  return {
    target: new BearerConnectionTarget({
      environmentId: envId(id),
      label: id,
      connectionId,
    }),
    profile: Option.some(
      new BearerConnectionProfile({
        connectionId,
        environmentId: envId(id),
        label: id,
        httpBaseUrl,
        wsBaseUrl: httpBaseUrl.replace("http", "ws"),
      }),
    ),
    enabled: options?.enabled ?? true,
  };
}

/** Every request lands here; `refuse` hosts describe themselves as having the feature off. */
function layerTailnetHttp(requests: string[], refuse: ReadonlyArray<string> = []) {
  const fetchFn = ((input) => {
    const url = String(input);
    requests.push(url);
    if (url.endsWith("/.well-known/t3/environment")) {
      return Promise.resolve(
        Response.json({
          environmentId: "peer",
          label: "Peer",
          platform: { os: "linux", arch: "x64" },
          serverVersion: "1.0.0",
          capabilities: {},
          tailnetAutoConnect: !refuse.some((host) => url.startsWith(host)),
        }),
      );
    }
    return Promise.resolve(
      Response.json({
        credential: `credential-for-${new URL(url).host}`,
        expiresAt: "2030-01-01T00:00:00.000Z",
      }),
    );
  }) as typeof globalThis.fetch;
  return RpcHttp.layerRemoteHttpClient(fetchFn);
}

function layerPeers(
  saved: ReadonlyArray<ConnectionCatalogEntry>,
  registered: PairingConnectionInput[],
  requests: string[],
  refuse?: ReadonlyArray<string>,
  dismissed: ReadonlyArray<string> = [],
) {
  return Layer.mergeAll(
    layerTailnetHttp(requests, refuse),
    Layer.succeed(
      TailnetDismissals,
      makeTailnetDismissals({
        read: Effect.succeed(dismissed.map(envId)),
        write: () => Effect.void,
      }),
    ),
    Layer.effect(
      EnvironmentRegistry.EnvironmentRegistry,
      Effect.gen(function* () {
        const entries = yield* SubscriptionRef.make(
          new Map(saved.map((entry) => [entry.target.environmentId, entry])),
        );
        return EnvironmentRegistry.EnvironmentRegistry.of({ entries } as never);
      }),
    ),
    Layer.mock(ConnectionOnboarding.ConnectionOnboarding)({
      registerPairing: (input) =>
        Effect.sync(() => {
          registered.push(input);
          return envId(input.expectedEnvironmentId ?? "new");
        }),
    }),
  );
}

describe("tailnet peer discovery", () => {
  it.effect("pairs only with peers that are not already reachable at that address", () => {
    const registered: PairingConnectionInput[] = [];
    const requests: string[] = [];
    return Effect.gen(function* () {
      yield* connectTailnetPeers([
        // Saved at this exact address: nothing to do.
        { httpBaseUrl: "http://same.tail:3773", environmentId: "same", label: "Same" },
        // Saved under another address (T3 Connect): added as a route to that environment.
        { httpBaseUrl: "http://moved.tail:3773", environmentId: "moved", label: "Moved" },
        // Never saved: added as a new environment.
        { httpBaseUrl: "http://fresh.tail:3773", environmentId: "fresh", label: "Fresh" },
        // Saved but switched off: the user's choice stands.
        { httpBaseUrl: "http://off.tail:3773", environmentId: "off", label: "Off" },
        // Its descriptor says the feature is off: skipped without failing the rest.
        { httpBaseUrl: "http://nope.tail:3773", environmentId: "nope", label: "Nope" },
      ]);
      expect(registered).toEqual([
        {
          host: "http://moved.tail:3773",
          pairingCode: "credential-for-moved.tail:3773",
          expectedEnvironmentId: "moved",
        },
        { host: "http://fresh.tail:3773", pairingCode: "credential-for-fresh.tail:3773" },
      ]);
      expect(requests.some((url) => url.includes("same.tail") || url.includes("off.tail"))).toBe(
        false,
      );
    }).pipe(
      Effect.provide(
        layerPeers(
          [
            savedEntry("same", "http://same.tail:3773/"),
            savedEntry("moved", "https://moved.example.test/"),
            savedEntry("off", "https://off.example.test/", { enabled: false }),
          ],
          registered,
          requests,
          ["http://nope.tail"],
        ),
      ),
    );
  });

  it.effect("leaves out removed environments and this client's own primary environment", () => {
    const registered: PairingConnectionInput[] = [];
    const requests: string[] = [];
    const primary: ConnectionCatalogEntry = {
      target: new PrimaryConnectionTarget({
        environmentId: envId("self"),
        label: "Self",
        httpBaseUrl: "http://localhost:3773",
        wsBaseUrl: "ws://localhost:3773",
      }),
      profile: Option.none(),
      enabled: true,
    };
    return Effect.gen(function* () {
      yield* connectTailnetPeers([
        { httpBaseUrl: "http://gone.tail:3773", environmentId: "gone", label: "Gone" },
        { httpBaseUrl: "http://self.tail:3773", environmentId: "self", label: "Self" },
        { httpBaseUrl: "http://fresh.tail:3773", environmentId: "fresh", label: "Fresh" },
      ]);
      expect(registered.map((input) => input.host)).toEqual(["http://fresh.tail:3773"]);
      expect(requests.some((url) => url.includes("gone.tail") || url.includes("self.tail"))).toBe(
        false,
      );
    }).pipe(Effect.provide(layerPeers([primary], registered, requests, [], ["gone"])));
  });

  it("asks an environment again only after the interval", () => {
    const gate = makeTailnetDiscoveryGate(1_000);
    const id = envId("a");
    expect(gate.tryBegin(id, 0)).toBe(true);
    expect(gate.tryBegin(id, 999)).toBe(false);
    expect(gate.tryBegin(envId("b"), 999)).toBe(true);
    expect(gate.tryBegin(id, 1_000)).toBe(true);
  });
});

describe("address-only pairing", () => {
  it.effect("fills in a tailnet credential when the code is empty", () => {
    const requests: string[] = [];
    return Effect.gen(function* () {
      const input = yield* withTailnetCredential({ host: "100.64.0.9:3773", pairingCode: "" });
      expect(input).toEqual({
        host: "http://100.64.0.9:3773",
        pairingCode: "credential-for-100.64.0.9:3773",
      });
      expect(requests).toEqual([
        "http://100.64.0.9:3773/.well-known/t3/environment",
        "http://100.64.0.9:3773/api/auth/tailnet-credential",
      ]);
    }).pipe(Effect.provide(layerTailnetHttp(requests)));
  });

  it.effect(
    "keeps the code-required behaviour and asks nothing more when the feature is off",
    () => {
      const requests: string[] = [];
      return Effect.gen(function* () {
        const original = { host: "100.64.0.9:3773", pairingCode: "" };
        expect(yield* withTailnetCredential(original)).toBe(original);
        expect(requests).toEqual(["http://100.64.0.9:3773/.well-known/t3/environment"]);
      }).pipe(Effect.provide(layerTailnetHttp(requests, ["http://100.64.0.9"])));
    },
  );

  it.effect("does not ask when a code or a pairing link is given", () => {
    const requests: string[] = [];
    return Effect.gen(function* () {
      yield* withTailnetCredential({ host: "100.64.0.9:3773", pairingCode: "ABC" });
      yield* withTailnetCredential({ pairingUrl: "https://example.test/pair#token=abc" });
      expect(requests).toEqual([]);
    }).pipe(Effect.provide(layerTailnetHttp(requests)));
  });
});

describe("removed environments", () => {
  it.effect("are remembered until forgotten, and the default store holds them in memory", () =>
    Effect.gen(function* () {
      const dismissals = yield* TailnetDismissals;
      yield* dismissals.add(envId("gone"));
      yield* dismissals.add(envId("gone"));
      expect([...(yield* dismissals.list)]).toEqual(["gone"]);
      yield* dismissals.forget(envId("gone"));
      expect((yield* dismissals.list).size).toBe(0);
    }),
  );
});
