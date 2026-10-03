import { ConnectionTraceId } from "./ConnectionTraceId";
import {
  type EnvironmentConnectionPhase,
  type EnvironmentConnectionPresentation,
} from "@t3tools/client-runtime/connection";
import { SymbolView } from "../../components/AppSymbol";
import { ActivityIndicator, Pressable, View } from "react-native";

import { AppText as Text } from "../../components/AppText";
import { translate, useTranslate } from "../../i18n/translate";

function noticeTitle(phase: EnvironmentConnectionPhase, environmentLabel: string): string {
  switch (phase) {
    case "offline":
      return translate("You are offline");
    case "connecting":
      return translate("Connecting to {name}...", { name: environmentLabel });
    case "reconnecting":
      return translate("Reconnecting to {name}...", { name: environmentLabel });
    case "unsupported":
      return translate("Client not supported");
    case "error":
      return translate("{name} is unavailable", { name: environmentLabel });
    case "available":
      return translate("{name} is disconnected", { name: environmentLabel });
    case "connected":
      return "";
  }
}

function noticeDetail(
  phase: EnvironmentConnectionPhase,
  resourceName: string,
  error: string | null,
): string {
  if (error) {
    return phase === "reconnecting"
      ? `${translate("The app will keep retrying automatically.")} ${error}`
      : error;
  }
  const resource = translate(resourceName);

  switch (phase) {
    case "offline":
      return translate(
        "Cached data remains available. The {resource} will load when your connection returns.",
        { resource },
      );
    case "connecting":
    case "reconnecting":
      return translate("The {resource} will load as soon as the environment is ready.", {
        resource,
      });
    case "unsupported":
      return translate("Use compatible versions of the app and server to connect.");
    case "available":
    case "error":
      return translate("Reconnect the environment to load the {resource}.", { resource });
    case "connected":
      return "";
  }
}

export function EnvironmentConnectionNotice(props: {
  readonly environmentLabel: string;
  readonly connection: EnvironmentConnectionPresentation;
  readonly resourceName: string;
  readonly onRetry: () => void;
}) {
  // Subscribe to language changes; the helpers above read it via `translate`.
  const t = useTranslate();
  const isRetrying =
    props.connection.phase === "connecting" || props.connection.phase === "reconnecting";

  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="max-w-[320px] items-center gap-3">
        {isRetrying ? (
          <ActivityIndicator size="small" colorClassName={"accent-icon-muted"} />
        ) : (
          <SymbolView
            name={props.connection.phase === "offline" ? "wifi.slash" : "bolt.horizontal.circle"}
            size={24}
            tintColorClassName={"accent-icon-muted"}
            type="monochrome"
          />
        )}

        <Text className="text-center text-lg font-t3-bold text-foreground">
          {noticeTitle(props.connection.phase, props.environmentLabel)}
        </Text>
        <Text className="text-center text-sm leading-normal text-foreground-muted">
          {noticeDetail(props.connection.phase, props.resourceName, props.connection.error)}
          {props.connection.traceId ? (
            <ConnectionTraceId traceId={props.connection.traceId} />
          ) : null}
        </Text>

        {props.connection.phase !== "offline" && props.connection.phase !== "unsupported" ? (
          <Pressable
            accessibilityRole="button"
            className="mt-1 rounded-full bg-subtle px-4 py-2.5 active:opacity-70"
            onPress={props.onRetry}
          >
            <Text className="text-sm font-t3-bold text-foreground">{t("Retry now")}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
