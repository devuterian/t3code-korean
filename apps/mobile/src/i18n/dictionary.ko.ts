/**
 * Korean dictionary for the mobile app. Keys are the exact English source
 * strings; a missing key falls back to English. Entries are split by feature
 * area under `./ko/` and follow the desktop glossary (apps/web i18n).
 */
import { KO_COMMON } from "./ko/common";
import { KO_CONNECTION } from "./ko/connection";
import { KO_HOME } from "./ko/home";
import { KO_SETTINGS } from "./ko/settings";
import { KO_SETTINGS2 } from "./ko/settings2";
import { KO_THREAD } from "./ko/thread";
import { KO_NEWTASK } from "./ko/newtask";
import { KO_V2_HOME } from "./ko/v2_home";
import { KO_V2_THREAD } from "./ko/v2_thread";
import { KO_V2_MOBILE_SORT } from "./ko/v2_sort";

export const KO_DICTIONARY: Readonly<Record<string, string>> = {
  ...KO_COMMON,
  ...KO_CONNECTION,
  ...KO_HOME,
  ...KO_SETTINGS,
  ...KO_SETTINGS2,
  ...KO_THREAD,
  ...KO_NEWTASK,
  ...KO_V2_HOME,
  ...KO_V2_THREAD,
  ...KO_V2_MOBILE_SORT,
};
