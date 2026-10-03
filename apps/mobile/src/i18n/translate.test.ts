import { afterEach, describe, expect, it } from "vite-plus/test";

import { interfaceLanguageFromLocale, isMobileInterfaceLanguage } from "./language";
import {
  formatCompactDuration,
  getFormattingLocale,
  getInterfaceLanguage,
  setInterfaceLanguage,
  translate,
} from "./translate";

describe("mobile i18n", () => {
  afterEach(() => setInterfaceLanguage("en"));

  it("starts in English under tests", () => {
    expect(getInterfaceLanguage()).toBe("en");
  });

  it("maps device locales to interface languages", () => {
    expect(interfaceLanguageFromLocale("ko-KR")).toBe("ko");
    expect(interfaceLanguageFromLocale("ko_KR")).toBe("ko");
    expect(interfaceLanguageFromLocale("KO")).toBe("ko");
    expect(interfaceLanguageFromLocale("en-US")).toBe("en");
    expect(interfaceLanguageFromLocale("ja-JP")).toBe("en");
    expect(interfaceLanguageFromLocale(undefined)).toBe("en");
    expect(isMobileInterfaceLanguage("ko")).toBe(true);
    expect(isMobileInterfaceLanguage("zh-CN")).toBe(false);
  });

  it("translates with English fallback and placeholders", () => {
    expect(translate("Settings")).toBe("Settings");
    expect(translate("Hello {name}", { name: "Marie" })).toBe("Hello Marie");
    setInterfaceLanguage("ko");
    expect(translate("Settings")).toBe("설정");
    expect(translate("Configured order")).toBe("지정한 순서");
    expect(translate("Not in the dictionary {x}", { x: 1 })).toBe("Not in the dictionary 1");
    expect(translate("Settled (3)")).toBe("정리됨 (3)");
  });

  it("formats compact durations and locale per language", () => {
    expect(formatCompactDuration(5, "m")).toBe("5m");
    expect(getFormattingLocale()).toBeUndefined();
    setInterfaceLanguage("ko");
    expect(formatCompactDuration(5, "m")).toBe("5분");
    expect(formatCompactDuration(2, "h")).toBe("2시간");
    expect(getFormattingLocale()).toBe("ko-KR");
  });
});
