import { useCallback, useSyncExternalStore } from "react";

import { KO_DICTIONARY } from "./dictionary.ko";
import {
  interfaceLanguageFromLocale,
  readIntlDeviceLocale,
  type MobileInterfaceLanguage,
} from "./language";

export type { MobileInterfaceLanguage } from "./language";

type Listener = () => void;

// Start from the device locale so Korean devices render Korean before stored
// preferences hydrate; InterfaceLanguageSync applies an explicit choice later.
// Unit tests pin English so assertions don't depend on the host locale.
let currentLanguage: MobileInterfaceLanguage =
  typeof process !== "undefined" && process.env?.VITEST
    ? "en"
    : interfaceLanguageFromLocale(readIntlDeviceLocale());
const listeners = new Set<Listener>();

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): MobileInterfaceLanguage {
  return currentLanguage;
}

/** Set the active language. Non-React modules read it through `translate`. */
export function setInterfaceLanguage(language: MobileInterfaceLanguage): void {
  if (currentLanguage === language) return;
  currentLanguage = language;
  for (const listener of listeners) listener();
}

export function getInterfaceLanguage(): MobileInterfaceLanguage {
  return currentLanguage;
}

export function useInterfaceLanguage(): MobileInterfaceLanguage {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Locale passed to `Intl`/`toLocale*` formatting. Korean pins `ko-KR`; English
 * keeps the device default (`undefined`) so regional date order is preserved.
 */
export function getFormattingLocale(
  language: MobileInterfaceLanguage = currentLanguage,
): string | undefined {
  return language === "ko" ? "ko-KR" : undefined;
}

export type TranslateParams = Readonly<Record<string, string | number>>;

type CountPattern = readonly [pattern: RegExp, render: (...groups: string[]) => string];

interface LanguagePack {
  readonly dictionary: Readonly<Record<string, string>>;
  /** Source strings with an embedded value, tried in order after a dictionary miss. */
  readonly patterns: ReadonlyArray<CountPattern>;
}

const LANGUAGE_PACKS: Partial<Record<MobileInterfaceLanguage, LanguagePack>> = {
  ko: {
    dictionary: KO_DICTIONARY,
    patterns: [
      [/^Settled \((\d+)\)$/, (n) => `정리됨 (${n})`],
      [/^Snoozed \((\d+)\)$/, (n) => `미뤄 둠 (${n})`],
      [/^Worked for (.+)$/, (d) => `${d} 동안 작업함`],
    ],
  },
};

function interpolate(template: string, params: TranslateParams | undefined): string {
  if (params === undefined) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.hasOwn(params, key) ? String(params[key]) : match,
  );
}

/**
 * Translate an English source string into the active language, falling back
 * to the source. `{name}` placeholders are filled from `params` after lookup,
 * so dictionary keys stay stable while values vary.
 */
export function translate(
  source: string,
  params?: TranslateParams,
  language: MobileInterfaceLanguage = currentLanguage,
): string {
  const pack = LANGUAGE_PACKS[language];
  if (pack === undefined) return interpolate(source, params);
  const direct = pack.dictionary[source];
  if (direct !== undefined) return interpolate(direct, params);
  for (const [pattern, render] of pack.patterns) {
    const match = pattern.exec(source);
    if (match !== null) return render(...match.slice(1));
  }
  return interpolate(source, params);
}

/** React hook returning a translate function bound to the active language. */
export function useTranslate() {
  const language = useInterfaceLanguage();
  return useCallback(
    (source: string, params?: TranslateParams) => translate(source, params, language),
    [language],
  );
}

const KO_DURATION_UNITS = { s: "초", m: "분", h: "시간", d: "일", w: "주" } as const;

/** Compact duration (`5m`), spelled with Korean units (`5분`) when Korean is active. */
export function formatCompactDuration(
  amount: number,
  unit: keyof typeof KO_DURATION_UNITS,
  language: MobileInterfaceLanguage = currentLanguage,
): string {
  return language === "ko" ? `${amount}${KO_DURATION_UNITS[unit]}` : `${amount}${unit}`;
}
