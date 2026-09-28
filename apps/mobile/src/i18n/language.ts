/**
 * Interface languages the mobile app ships translations for. English source
 * strings are the fallback, so a missing translation never blanks the UI.
 */
export const MOBILE_INTERFACE_LANGUAGES = ["en", "ko"] as const;
export type MobileInterfaceLanguage = (typeof MOBILE_INTERFACE_LANGUAGES)[number];

export const MOBILE_INTERFACE_LANGUAGE_LABELS: Readonly<Record<MobileInterfaceLanguage, string>> = {
  en: "English",
  ko: "한국어",
};

export function isMobileInterfaceLanguage(value: unknown): value is MobileInterfaceLanguage {
  return (
    typeof value === "string" && (MOBILE_INTERFACE_LANGUAGES as readonly string[]).includes(value)
  );
}

/** Maps a BCP 47 locale tag (`ko-KR`, `ko_KR`, `en-US`) to a supported interface language. */
export function interfaceLanguageFromLocale(
  locale: string | null | undefined,
): MobileInterfaceLanguage {
  const primary = locale?.trim().toLowerCase().split(/[-_]/)[0];
  return primary === "ko" ? "ko" : "en";
}

/** Device locale as reported by the JS engine's Intl implementation (Hermes reads the OS locale). */
export function readIntlDeviceLocale(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale;
  } catch {
    return undefined;
  }
}

/** Stored preference: an explicit language, or "system" to follow the device locale. */
export type MobileInterfaceLanguagePreference = MobileInterfaceLanguage | "system";
