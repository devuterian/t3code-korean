import { getFormattingLocale, getInterfaceLanguage, translate } from "../../i18n/translate";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const KO_INTERVAL_UNITS = {
  week: "주",
  day: "일",
  hour: "시간",
  minute: "분",
  second: "초",
  millisecond: "밀리초",
} as const;
const KO_SINGLE_INTERVAL = {
  week: "매주",
  day: "매일",
  hour: "매시간",
  minute: "매분",
  second: "매초",
  millisecond: "매 밀리초",
} as const;

export function formatScheduledTaskInterval(everyMs: number): string {
  const korean = getInterfaceLanguage() === "ko";
  const units = [
    [7 * DAY, "week"],
    [DAY, "day"],
    [HOUR, "hour"],
    [MINUTE, "minute"],
    [1_000, "second"],
    [1, "millisecond"],
  ] as const;
  let remaining = everyMs;
  const parts: string[] = [];
  for (const [size, unit] of units) {
    const count = Math.floor(remaining / size);
    if (count === 0) continue;
    if (count === 1 && remaining === everyMs && remaining === size) {
      return korean ? KO_SINGLE_INTERVAL[unit] : `Every ${unit}`;
    }
    parts.push(
      korean ? `${count}${KO_INTERVAL_UNITS[unit]}` : `${count} ${unit}${count === 1 ? "" : "s"}`,
    );
    remaining %= size;
  }
  return korean ? `${parts.join(" ")}마다` : `Every ${parts.join(" ")}`;
}

function localCalendarDay(date: Date): number {
  // Compare calendar days, not 24-hour spans: DST days can have 23 or 25 hours.
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY;
}

export function formatNextScheduledTaskRun(nextRunAt: string, now: number): string {
  const next = new Date(nextRunAt);
  const current = new Date(now);
  const remaining = next.getTime() - now;
  if (!Number.isFinite(remaining)) return translate("Next run unavailable");
  if (remaining <= 0) return translate("Next run due");

  const days = localCalendarDay(next) - localCalendarDay(current);
  if (days === 0) {
    if (remaining < MINUTE) return translate("Next run in less than a minute");
    const minutes = remaining < HOUR;
    const count = Math.round(remaining / (minutes ? MINUTE : HOUR));
    if (minutes) {
      return count === 1
        ? translate("Next run in 1 minute")
        : translate("Next run in {count} minutes", { count });
    }
    return count === 1
      ? translate("Next run in 1 hour")
      : translate("Next run in {count} hours", { count });
  }

  const locale = getFormattingLocale();
  const time = next.toLocaleTimeString(locale ?? [], { hour: "numeric", minute: "2-digit" });
  if (days === 1) return translate("Next run tomorrow at {time}", { time });
  if (days <= 7) {
    return translate("Next run next {weekday} at {time}", {
      weekday: next.toLocaleDateString(locale ?? [], { weekday: "long" }),
      time,
    });
  }
  const date = next.toLocaleDateString(locale ?? [], {
    month: "short",
    day: "numeric",
    ...(next.getFullYear() !== current.getFullYear() ? { year: "numeric" as const } : {}),
  });
  return translate("Next run {date} at {time}", { date, time });
}
