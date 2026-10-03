import type { ServerProviderUsageWindow } from "@t3tools/contracts";

import { formatCompactDuration, translate } from "../../i18n/translate";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Language-aware `formatDuration` from shared usageLimits: `2h 13m`, `3d 4h`, `12m`. */
export function formatUsageDuration(ms: number): string {
  const remaining = Math.max(0, ms);
  const days = Math.floor(remaining / DAY);
  const hours = Math.floor((remaining % DAY) / HOUR);
  const minutes = Math.floor((remaining % HOUR) / MINUTE);
  if (days > 0) return `${formatCompactDuration(days, "d")} ${formatCompactDuration(hours, "h")}`;
  if (hours > 0) {
    return `${formatCompactDuration(hours, "h")} ${formatCompactDuration(minutes, "m")}`;
  }
  return formatCompactDuration(minutes, "m");
}

function resetMillis(window: ServerProviderUsageWindow): number | null {
  if (window.resetsAt === undefined) return null;
  const at = Date.parse(window.resetsAt);
  return Number.isFinite(at) ? at : null;
}

/** Language-aware `formatResetsIn`: `resets in 2h 13m`, or null when the window has no reset. */
export function formatUsageResetsIn(window: ServerProviderUsageWindow, now: number): string | null {
  const resetsAt = resetMillis(window);
  if (resetsAt === null) return null;
  return resetsAt <= now
    ? translate("resets now")
    : translate("resets in {duration}", { duration: formatUsageDuration(resetsAt - now) });
}

/** Compact countdown for dense rows: `↻ 2h 13m`, or `resets now`. */
export function formatUsageResetsInShort(
  window: ServerProviderUsageWindow,
  now: number,
): string | null {
  const resetsAt = resetMillis(window);
  if (resetsAt === null) return null;
  return resetsAt <= now ? translate("resets now") : `↻ ${formatUsageDuration(resetsAt - now)}`;
}

/** `now` / `in 2h 13m` relative to `now`. */
export function formatUsageRelative(at: number, now: number): string {
  return at <= now
    ? translate("now")
    : translate("in {duration}", { duration: formatUsageDuration(at - now) });
}

/** Window labels come from providers (`Weekly`, `Weekly · Fable`); translate each part. */
export function translateUsageLabel(label: string): string {
  return label
    .split(" · ")
    .map((part) => translate(part))
    .join(" · ");
}

/** Notices read `Subject: message`; translate the message when it is a known string. */
export function translateUsageNotice(notice: string): string {
  const separator = notice.lastIndexOf(": ");
  if (separator < 0) return translate(notice);
  return `${notice.slice(0, separator)}: ${translate(notice.slice(separator + 2))}`;
}
