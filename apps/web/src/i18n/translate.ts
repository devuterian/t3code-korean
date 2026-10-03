import { useCallback, useSyncExternalStore } from "react";

import { DEFAULT_INTERFACE_LANGUAGE, type InterfaceLanguage } from "@t3tools/contracts/settings";

import { ZH_CN_DICTIONARY } from "./dictionary";
import { KO_DICTIONARY } from "./dictionary.ko";

type Listener = () => void;

let currentLanguage: InterfaceLanguage = DEFAULT_INTERFACE_LANGUAGE;
let languageConfigured = false;
const listeners = new Set<Listener>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): InterfaceLanguage {
  return currentLanguage;
}

/**
 * Imperatively set the active language. Called by the settings row's
 * subscription once client settings hydrate and whenever the persisted value
 * changes, so non-React modules (search, formatting) can read the same value.
 */
export function setInterfaceLanguage(language: InterfaceLanguage): void {
  if (currentLanguage === language) return;
  currentLanguage = language;
  emitChange();
}

/** Mark the language store as configured so React can skip the default flash. */
export function markInterfaceLanguageConfigured(): void {
  languageConfigured = true;
  emitChange();
}

export function isInterfaceLanguageConfigured(): boolean {
  return languageConfigured;
}

/** Read the active language from non-React formatting and state modules. */
export function getInterfaceLanguage(): InterfaceLanguage {
  return currentLanguage;
}

/** React hook returning the active interface language. */
export function useInterfaceLanguage(): InterfaceLanguage {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

type CountPattern = readonly [pattern: RegExp, render: (match: string) => string];

interface LanguagePack {
  readonly dictionary: Readonly<Record<string, string>>;
  /** Source strings with an embedded value, tried in order after a dictionary miss. */
  readonly patterns: ReadonlyArray<CountPattern>;
}

const LANGUAGE_PACKS: Partial<Record<InterfaceLanguage, LanguagePack>> = {
  "zh-CN": {
    dictionary: ZH_CN_DICTIONARY,
    patterns: [
      [/^Settled \((\d+)\)$/, (n) => `已收档 (${n})`],
      [/^Snoozed \((\d+)\)$/, (n) => `已搁置 (${n})`],
      [/^Unpin \((\d+)\)$/, (n) => `取消置顶 (${n})`],
      [/^Settle \((\d+)\)$/, (n) => `收档 (${n})`],
      [/^Snooze \((\d+)\)$/, (n) => `搁置 (${n})`],
      [/^Mark unread \((\d+)\)$/, (n) => `标记为未读 (${n})`],
      [/^Delete \((\d+)\)$/, (n) => `删除 (${n})`],
      [/^Regenerate titles \((\d+)\)$/, (n) => `重新生成标题 (${n})`],
      [/^Regenerating… \((\d+)\)$/, (n) => `正在重新生成… (${n})`],
      [/^Worked for (.+)$/, (d) => `运行了 ${d}`],
      [/^Model Picker: Jump: (\d+)$/, (n) => `模型选择器：跳转：${n}`],
      [/^Thread: Jump: (\d+)$/, (n) => `线程：跳转：${n}`],
    ],
  },
  ko: {
    dictionary: KO_DICTIONARY,
    patterns: [
      [/^Settled \((\d+)\)$/, (n) => `정리됨 (${n})`],
      [/^Snoozed \((\d+)\)$/, (n) => `미뤄 둠 (${n})`],
      [/^Unpin \((\d+)\)$/, (n) => `고정 해제 (${n})`],
      [/^Settle \((\d+)\)$/, (n) => `정리 (${n})`],
      [/^Snooze \((\d+)\)$/, (n) => `미루기 (${n})`],
      [/^Mark unread \((\d+)\)$/, (n) => `읽지 않음으로 표시 (${n})`],
      [/^Delete \((\d+)\)$/, (n) => `삭제 (${n})`],
      [/^Regenerate titles \((\d+)\)$/, (n) => `제목 다시 생성 (${n})`],
      [/^Regenerating… \((\d+)\)$/, (n) => `다시 생성 중… (${n})`],
      [/^Worked for (.+)$/, (d) => `${d} 동안 작업함`],
      [/^Model Picker: Jump: (\d+)$/, (n) => `모델 선택기: 이동: ${n}`],
      [/^Thread: Jump: (\d+)$/, (n) => `스레드: 이동: ${n}`],
      [/^Working \((\d+)\)$/, (n) => `작업 중 (${n})`],
      [/^(\d+) archived threads?$/, (n) => `보관된 스레드 ${n}개`],
      [/^Archived thread actions for (.+)$/, (project) => `${project}의 보관된 스레드 작업`],
      [
        /^(Delete \d+ archived threads?(?: in .+)?)\?$/,
        (text) => {
          const [, n, project] = /^Delete (\d+) archived threads?(?: in (.+))?$/.exec(text) ?? [];
          return project
            ? `${project}의 보관된 스레드 ${n}개를 삭제할까요?`
            : `보관된 스레드 ${n}개를 삭제할까요?`;
        },
      ],
    ],
  },
};

/**
 * Translate an English source string into the active language. Falls back to
 * the source string when no translation exists, so partial dictionaries ship
 * safely.
 */
export function translate(source: string, language: InterfaceLanguage = currentLanguage): string {
  const pack = LANGUAGE_PACKS[language];
  if (pack === undefined) return source;
  const direct = pack.dictionary[source];
  if (direct !== undefined) return direct;
  for (const [pattern, render] of pack.patterns) {
    const value = pattern.exec(source)?.[1];
    if (value !== undefined) return render(value);
  }
  return source;
}

/** React hook translating an English source string. */
export function useTranslate() {
  const language = useInterfaceLanguage();
  return useCallback((source: string) => translate(source, language), [language]);
}
