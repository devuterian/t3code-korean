import type { StatusTone } from "../../components/StatusPill";
import type { connectionStatusText } from "@t3tools/client-runtime/connection";

import { translate } from "../../i18n/translate";
import type { RemoteClientConnectionState } from "../../lib/connection";

export function connectionTone(state: RemoteClientConnectionState): StatusTone {
  switch (state) {
    case "connected":
      return {
        label: translate("Connected"),
        pillClassName: "bg-adaptive-emerald-500-a12-a16",
        textClassName: "text-adaptive-emerald-700-300",
      };
    case "reconnecting":
      return {
        label: translate("Reconnecting"),
        pillClassName: "bg-warning",
        textClassName: "text-warning-foreground",
      };
    case "connecting":
      return {
        label: translate("Connecting"),
        pillClassName: "bg-update",
        textClassName: "text-update-foreground",
      };
    case "unsupported":
      return {
        label: translate("Client not supported"),
        pillClassName: "bg-subtle",
        textClassName: "text-foreground-secondary",
      };
    case "error":
      return {
        label: translate("Connection failed"),
        pillClassName: "bg-danger",
        textClassName: "text-danger-foreground",
      };
    case "offline":
      return {
        label: translate("Offline"),
        pillClassName: "bg-danger",
        textClassName: "text-danger-foreground",
      };
    case "available":
      return {
        label: translate("Available"),
        pillClassName: "bg-subtle",
        textClassName: "text-foreground-secondary",
      };
  }
}

/**
 * Localized counterpart of `connectionStatusText` from client-runtime. English
 * output is byte-identical; other languages go through the mobile dictionary.
 */
export function localizedConnectionStatusText(
  connection: Parameters<typeof connectionStatusText>[0],
): string {
  switch (connection.phase) {
    case "available":
      return translate("Available");
    case "offline":
      return translate("Offline");
    case "connecting":
      return translate("Connecting...");
    case "reconnecting":
      return connection.error
        ? translate("Failed to connect. Reconnecting... Reason: {reason}", {
            reason: connection.error,
          })
        : translate("Reconnecting...");
    case "connected":
      return translate("Connected");
    case "unsupported":
      return translate("Client not supported");
    case "error":
      return connection.error
        ? translate("Connection failed. Reason: {reason}", { reason: connection.error })
        : translate("Connection failed");
  }
}
