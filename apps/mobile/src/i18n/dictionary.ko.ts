/**
 * Korean dictionary for the mobile app. Keys are the exact English source
 * strings; a missing key falls back to English. Entries are split by feature
 * area under `./ko/` and follow the desktop glossary (apps/web i18n).
 */
import { KO_COMMON } from "./ko/common";
import { KO_SETTINGS } from "./ko/settings";

export const KO_DICTIONARY: Readonly<Record<string, string>> = {
  ...KO_COMMON,
  ...KO_SETTINGS,
};
