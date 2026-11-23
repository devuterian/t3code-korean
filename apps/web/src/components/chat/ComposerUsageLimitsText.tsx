import type {
  ComposerUsageLimitsDisplay,
  ProviderInstanceId,
  ServerProvider,
} from "@t3tools/contracts";
import { type ComposerUsagePart, composerUsageSummary } from "@t3tools/shared/usageLimits";
import { useGT } from "gt-react";
import { Fragment, useEffect, useState } from "react";

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
  const gt = useGT();
  const [now, setNow] = useState(() => Date.now());
  const summary = composerUsageSummary(props.providers, props.instanceId, props.mode, now);
  const nextChangeAt = summary?.nextChangeAt ?? null;
  // One timer to the next reset, so a window that has rolled over turns into
  // a dash without polling. Fresh provider data re-renders on its own.
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
            aria-label={gt("Usage limits: {description}", { description })}
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
          <span className="text-muted-foreground/80">{gt("used")}</span>
        ) : null}
      </TooltipTrigger>
      <TooltipPopup side="top">{description}</TooltipPopup>
    </Tooltip>
  );
}
