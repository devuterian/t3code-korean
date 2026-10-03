import { formatCompactDuration, getInterfaceLanguage } from "../i18n/translate";

function underAMinute(): string {
  return getInterfaceLanguage() === "ko" ? "방금" : "<1m";
}

export function relativeTime(input: string): string {
  const timestamp = Date.parse(input);
  if (Number.isNaN(timestamp)) {
    return underAMinute();
  }

  // Anything under a minute renders as "<1m" rather than a live seconds count.
  // The seconds ticker changed width every second and reflowed the surrounding row.
  const deltaSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (deltaSeconds < 60) return underAMinute();

  const deltaMinutes = Math.floor(deltaSeconds / 60);
  if (deltaMinutes < 60) return formatCompactDuration(deltaMinutes, "m");

  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) return formatCompactDuration(deltaHours, "h");

  const deltaDays = Math.floor(deltaHours / 24);
  return formatCompactDuration(deltaDays, "d");
}
