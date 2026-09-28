import { View } from "react-native";

import { SegmentedControl } from "../../../components/SegmentedControl";
import { useInterfaceLanguagePreference } from "../../../i18n/InterfaceLanguageSync";
import {
  MOBILE_INTERFACE_LANGUAGE_LABELS,
  type MobileInterfaceLanguagePreference,
} from "../../../i18n/language";
import { useTranslate } from "../../../i18n/translate";
import { SettingsSection } from "./SettingsSection";

/** Language picker: follow the device locale, or pin English / Korean. */
export function InterfaceLanguageSection() {
  const t = useTranslate();
  const { preference, setPreference } = useInterfaceLanguagePreference();
  const options: ReadonlyArray<{ value: MobileInterfaceLanguagePreference; label: string }> = [
    { value: "system", label: t("Device") },
    { value: "en", label: MOBILE_INTERFACE_LANGUAGE_LABELS.en },
    { value: "ko", label: MOBILE_INTERFACE_LANGUAGE_LABELS.ko },
  ];
  return (
    <SettingsSection title={t("Language")}>
      <View className="p-4 android:px-4 android:py-3">
        <SegmentedControl options={options} selected={preference} onSelect={setPreference} />
      </View>
    </SettingsSection>
  );
}
