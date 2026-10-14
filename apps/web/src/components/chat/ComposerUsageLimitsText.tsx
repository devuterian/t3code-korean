import type {
  ComposerUsageLimitsDisplay,
  ProviderInstanceId,
  ServerProvider,
} from "@t3tools/contracts";
import { type ComposerUsagePart, composerUsageSummary } from "@t3tools/shared/usageLimits";
import { Fragment, useEffect, useMemo, useState } from "react";

import { useTranslate } from "~/i18n/translate";
import { cn } from "~/lib/utils";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";

const TONE_CLASS: Record<ComposerUsagePart["tone"], string> = {
  normal: "text-muted-foreground",
  warn: "text-warning",
  danger: "text-destructive",
};

/**
 * The selected provider's session and weekly limits as plain text beside the
 * send button. Clicking opens the same panel `/usage-limits` shows.
 */
export function ComposerUsageLimitsText(props: {
  providers: readonly ServerProvider[];
  instanceId: ProviderInstanceId | null;
  mode: ComposerUsageLimitsDisplay;
  /** Drop the Session/Weekly words where the footer is tight. */
  compact: boolean;
  onOpen: (() => void) | undefined;
}) {
  const t = useTranslate();
  const [now, setNow] = useState(() => Date.now());
  const summary = useMemo(
    () => composerUsageSummary(props.providers, props.instanceId, props.mode, now),
    [props.providers, props.instanceId, props.mode, now],
  );
  const nextChangeAt = summary?.nextChangeAt ?? null;
  // One timer to the next reset, so a window that has rolled over turns into
  // a dash without polling. Fresh provider data re-renders on its own.
  useEffect(() => {
    if (nextChangeAt === null) return;
    const timer = setTimeout(
      () => setNow(Math.max(Date.now(), nextChangeAt)),
      Math.max(0, nextChangeAt - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [nextChangeAt]);

  if (!summary || props.mode === "off") return null;
  const suffix = props.mode === "used" ? t("used") : t("left");
  const kindLabel = (part: ComposerUsagePart) => t(part.kind === "session" ? "Session" : "Weekly");
  const description = summary.parts
    .map((part) =>
      part.percent === null
        ? `${kindLabel(part)}: ${t("Reset, waiting for a new reading")}`
        : `${kindLabel(part)}: ${part.percent}% ${suffix}`,
    )
    .join(" · ");

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            className="flex h-7 shrink-0 items-center gap-1 rounded-md px-1 text-xs tabular-nums whitespace-nowrap hover:bg-accent"
            disabled={!props.onOpen}
            onPointerDown={(event) => event.preventDefault()}
            onClick={props.onOpen}
            aria-label={`${t("Usage limits")}: ${description}`}
          />
        }
      >
        {summary.parts.map((part, index) => (
          <Fragment key={part.kind}>
            {index > 0 ? <span className="text-muted-foreground/60">·</span> : null}
            <span
              className={cn(
                part.percent === null ? "text-muted-foreground/60" : TONE_CLASS[part.tone],
              )}
            >
              {props.compact ? null : <span className="opacity-80">{kindLabel(part)} </span>}
              {part.percent === null ? "–" : `${part.percent}%`}
            </span>
          </Fragment>
        ))}
        {props.mode === "used" ? (
          <span className="text-muted-foreground/80">{t("used")}</span>
        ) : null}
      </TooltipTrigger>
      <TooltipPopup side="top">{description}</TooltipPopup>
    </Tooltip>
  );
}
