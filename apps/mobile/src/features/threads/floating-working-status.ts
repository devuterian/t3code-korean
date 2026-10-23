import type { EnvironmentConnectionPhase } from "@t3tools/client-runtime/connection";

import { translate } from "../../i18n/translate";

export interface FloatingStatusAction {
  readonly label: string;
  readonly accessibilityLabel: string;
  readonly disabled: boolean;
  readonly onPress: () => void;
}

export type FloatingWorkingStatus =
  | { readonly kind: "working"; readonly startedAt: string }
  | { readonly kind: "syncing"; readonly label: string }
  | { readonly kind: "compacting" }
  | {
      readonly kind: "child-input";
      readonly label: string;
      readonly accessibilityLabel: string;
      readonly onPress: () => void;
    }
  | {
      readonly kind: "background";
      readonly label: string;
      readonly accessibilityLabel: string;
      readonly waiting: boolean;
      readonly onPress: () => void;
      readonly action: FloatingStatusAction;
    }
  | {
      readonly kind: "lifecycle";
      readonly state: "snoozed" | "settled" | "woke";
      readonly label: string;
      readonly action: FloatingStatusAction;
    }
  | { readonly kind: "goal"; readonly label: string; readonly accessibilityLabel: string }
  | { readonly kind: "preparing"; readonly label: string }
  | {
      readonly kind: "connection";
      readonly tone: "reconnecting" | "unavailable";
      readonly label: string;
      readonly onPress: () => void;
    };

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
