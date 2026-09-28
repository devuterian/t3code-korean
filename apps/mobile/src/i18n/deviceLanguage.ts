import { I18nManager } from "react-native";

import { interfaceLanguageFromLocale, readIntlDeviceLocale } from "./language";
import type { MobileInterfaceLanguage } from "./language";

/**
 * Resolves the device's interface language. Hermes' Intl reports the OS locale;
 * Android's I18nManager constants are a fallback when Intl is unavailable.
 */
export function detectDeviceInterfaceLanguage(): MobileInterfaceLanguage {
  const intlLocale = readIntlDeviceLocale();
  if (intlLocale) return interfaceLanguageFromLocale(intlLocale);
  try {
    const constants = I18nManager.getConstants() as { localeIdentifier?: string | null };
    return interfaceLanguageFromLocale(constants.localeIdentifier);
  } catch {
    return "en";
  }
}
