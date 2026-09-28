import { useAtomSet, useAtomValue } from "@effect/atom-react";
import { AsyncResult } from "effect/unstable/reactivity";
import { useCallback, useEffect } from "react";

import { mobilePreferencesAtom, updateMobilePreferencesAtom } from "../state/preferences";
import { detectDeviceInterfaceLanguage } from "./deviceLanguage";
import type { MobileInterfaceLanguagePreference } from "./language";
import { setInterfaceLanguage } from "./translate";

/** Reads the stored language preference ("system" when nothing was chosen). */
export function useInterfaceLanguagePreference() {
  const preferences = useAtomValue(mobilePreferencesAtom);
  const savePreferences = useAtomSet(updateMobilePreferencesAtom);
  const preference: MobileInterfaceLanguagePreference = AsyncResult.isSuccess(preferences)
    ? (preferences.value.interfaceLanguage ?? "system")
    : "system";
  const setPreference = useCallback(
    (interfaceLanguage: MobileInterfaceLanguagePreference) => {
      setInterfaceLanguage(
        interfaceLanguage === "system" ? detectDeviceInterfaceLanguage() : interfaceLanguage,
      );
      savePreferences({ interfaceLanguage });
    },
    [savePreferences],
  );
  return { preference, setPreference, isReady: AsyncResult.isSuccess(preferences) };
}

/** Applies the stored (or device) language to the translate store. Renders nothing. */
export function InterfaceLanguageSync() {
  const { preference } = useInterfaceLanguagePreference();
  useEffect(() => {
    setInterfaceLanguage(preference === "system" ? detectDeviceInterfaceLanguage() : preference);
  }, [preference]);
  return null;
}
