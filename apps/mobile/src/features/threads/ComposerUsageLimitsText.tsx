import type {
  ComposerUsageLimitsDisplay,
  ProviderInstanceId,
  ServerProvider,
} from "@t3tools/contracts";
import { type ComposerUsagePart, composerUsageSummary } from "@t3tools/shared/usageLimits";
import { useGT } from "gt-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, useWindowDimensions } from "react-native";

import { AppText as Text } from "../../components/ui/AppText";

const TONE_CLASS: Record<ComposerUsagePart["tone"], string> = {
  normal: "text-foreground-muted",
  warn: "text-warning-foreground",
  danger: "text-danger-foreground",
};

/**
 * The selected provider's session and weekly limits as plain text beside the
 * send button. Tapping toggles the same panel `/usage-limits` shows.
 */
export function ComposerUsageLimitsText(props: {
  readonly providers: readonly ServerProvider[];
  readonly instanceId: ProviderInstanceId | null;
  readonly mode: ComposerUsageLimitsDisplay;
  readonly onPress: () => void;
}) {
  const gt = useGT();
  // Small phones keep only the numbers; the accessible label still names each window.
  const compact = useWindowDimensions().width < 360;
  const [now, setNow] = useState(() => Date.now());
  const summary = useMemo(
    () => composerUsageSummary(props.providers, props.instanceId, props.mode, now),
    [props.providers, props.instanceId, props.mode, now],
  );
  const nextChangeAt = summary?.nextChangeAt ?? null;
  // One timer to the next reset, so a rolled-over window turns into a dash
  // without polling. Fresh provider data re-renders on its own.
  // oxlint-disable-next-line t3code/no-unreasoned-state-sync -- One timer to the next limit reset, cleared on change or unmount.
  useEffect(() => {
    if (nextChangeAt === null) return;
    const timer = setTimeout(
      () => setNow(Math.max(Date.now(), nextChangeAt)),
      Math.max(0, nextChangeAt - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [nextChangeAt]);

  if (!summary || props.mode === "off") return null;
  const kindLabel = (part: ComposerUsagePart) =>
    part.kind === "session" ? gt("Session") : gt("Weekly");
  const description = summary.parts
    .map((part) => {
      const kind = kindLabel(part);
      if (part.percent === null) return gt("{kind}: Reset, waiting for a new reading", { kind });
      const percent = part.percent;
      return props.mode === "used"
        ? gt("{kind}: {percent}% used", { kind, percent })
        : gt("{kind}: {percent}% left", { kind, percent });
    })
    .join(", ");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={gt("Usage limits: {description}", { description })}
      hitSlop={6}
      onPress={props.onPress}
      className="shrink-0 px-1.5 py-1 active:opacity-60"
    >
      <Text className="text-xs tabular-nums text-foreground-muted" numberOfLines={1}>
        {summary.parts.map((part, index) => (
          <Text key={part.kind}>
            {index > 0 ? " · " : null}
            <Text
              className={part.percent === null ? "text-foreground-tertiary" : TONE_CLASS[part.tone]}
            >
              {compact ? "" : `${kindLabel(part)} `}
              {part.percent === null ? "–" : `${part.percent}%`}
            </Text>
          </Text>
        ))}
        {props.mode === "used" ? ` ${gt("used")}` : null}
      </Text>
    </Pressable>
  );
}
