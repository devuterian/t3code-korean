import { resolveRemotePairingTarget } from "@t3tools/shared/remote";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";

import { fetchRemoteEnvironmentDescriptor } from "../environment/descriptor.ts";
import { environmentEndpointUrl } from "../environment/endpoint.ts";
import { executeEnvironmentHttpRequest, makeEnvironmentHttpApiGroupClient } from "../rpc/http.ts";
import type { PairingConnectionInput } from "./onboarding.ts";

/** Korean fork: tailnet auto-connect. */

export const TAILNET_REQUEST_TIMEOUT_MS = 8_000;
const TAILNET_CREDENTIAL_TIMEOUT_MS = 2_000;

/**
 * Asks a server to mint a credential for this device from its Tailscale identity. The server's
 * descriptor is read first, and only a server that says the feature is on is asked. A server with
 * it off or without it, and any network failure, answers `None`, so callers fall back quietly.
 */
export const requestTailnetCredential = Effect.fn(
  "clientRuntime.connection.requestTailnetCredential",
)(function* (httpBaseUrl: string) {
  return yield* Effect.gen(function* () {
    const descriptor = yield* fetchRemoteEnvironmentDescriptor({
      httpBaseUrl,
      timeoutMs: TAILNET_CREDENTIAL_TIMEOUT_MS,
    });
    if (descriptor.tailnetAutoConnect !== true) return Option.none<string>();
    const client = yield* makeEnvironmentHttpApiGroupClient(httpBaseUrl, "auth");
    const result = yield* executeEnvironmentHttpRequest(
      environmentEndpointUrl(httpBaseUrl, "/api/auth/tailnet-credential"),
      TAILNET_CREDENTIAL_TIMEOUT_MS,
      client.tailnetCredential(),
    );
    return Option.some(result.credential);
  }).pipe(Effect.orElseSucceed(() => Option.none<string>()));
});

/** A bare IP address is a tailnet device, which serves plain HTTP; other bare hosts default to HTTPS. */
function addressOnlyHost(input: PairingConnectionInput): string {
  const host = (input.host ?? input.pairingUrl ?? "").trim();
  return /^\d{1,3}(\.\d{1,3}){3}(:\d+)?\/?$/.test(host) ? `http://${host}` : host;
}

/** The address to ask, when the input is a host with no usable code; otherwise null. */
function addressOnlyBaseUrl(input: PairingConnectionInput): string | null {
  try {
    resolveRemotePairingTarget(input);
    return null;
  } catch {
    // A code is missing or the details are invalid; both fall through below.
  }
  if (input.pairingCode?.trim()) return null;
  const host = addressOnlyHost(input);
  if (host === "") return null;
  try {
    return resolveRemotePairingTarget({ host, pairingCode: "tailnet" }).httpBaseUrl;
  } catch {
    return null;
  }
}

/**
 * "Address only" pairing: a host with no pairing code tries the tailnet credential first. Input
 * that already carries a code, or whose host does not trust this device, comes back unchanged so
 * the normal "code required" error still shows.
 */
export const withTailnetCredential = Effect.fn("clientRuntime.connection.withTailnetCredential")(
  function* (input: PairingConnectionInput) {
    const httpBaseUrl = addressOnlyBaseUrl(input);
    if (httpBaseUrl === null) return input;
    const credential = yield* requestTailnetCredential(httpBaseUrl);
    if (Option.isNone(credential)) return input;
    return {
      host: addressOnlyHost(input),
      pairingCode: credential.value,
      ...(input.expectedEnvironmentId === undefined
        ? {}
        : { expectedEnvironmentId: input.expectedEnvironmentId }),
    } satisfies PairingConnectionInput;
  },
);
