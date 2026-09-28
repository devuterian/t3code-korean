import type { EnvironmentConnectionPhase } from "@t3tools/client-runtime/connection";

import { translate } from "../../i18n/translate";

/**
 * What the floating pill says. Connection, syncing, and working share one
 * element so the label swaps in place instead of one pill fading out for
 * another. The connection variant is tappable and triggers a reconnect.
 */
export type FloatingWorkingStatus =
  | { readonly kind: "working"; readonly startedAt: string }
  | { readonly kind: "syncing"; readonly label: string }
  | { readonly kind: "compacting" }
  // A task whose thread the server has not created yet: the worktree may
  // still be checking out, so there is no turn to time.
  | { readonly kind: "preparing"; readonly label: string }
  | {
      readonly kind: "connection";
      readonly tone: "reconnecting" | "unavailable";
      readonly label: string;
      readonly onPress: () => void;
    };

/**
 * The pill's connection variant, or null once the environment is connected and
 * the pill is free to report sync and working state instead.
 */
export function connectionFloatingStatus(input: {
  readonly connectionError: string | null;
  readonly connectionState: EnvironmentConnectionPhase;
  readonly environmentLabel: string | null;
  readonly onReconnect: () => void;
}): FloatingWorkingStatus | null {
  const environmentLabel = input.environmentLabel ?? translate("Environment");
  const unavailable = (label: string): FloatingWorkingStatus => ({
    kind: "connection",
    tone: "unavailable",
    label,
    onPress: input.onReconnect,
  });

  switch (input.connectionState) {
    case "connecting":
    case "reconnecting":
      return {
        kind: "connection",
        tone: "reconnecting",
        label:
          input.connectionError === null
            ? translate("Reconnecting to {environment}...", { environment: environmentLabel })
            : translate("Failed to connect. Retrying {environment}...", {
                environment: environmentLabel,
              }),
        onPress: input.onReconnect,
      };
    case "offline":
      return unavailable(translate("You are offline"));
    case "unsupported":
      return unavailable(translate("Client not supported"));
    case "error":
      return unavailable(
        input.connectionError
          ? translate("Failed to connect to {environment}: {error}", {
              environment: environmentLabel,
              error: input.connectionError,
            })
          : translate("Failed to connect to {environment}", { environment: environmentLabel }),
      );
    case "available":
      return unavailable(
        translate("{environment} is not connected", { environment: environmentLabel }),
      );
    case "connected":
      return null;
  }
}
