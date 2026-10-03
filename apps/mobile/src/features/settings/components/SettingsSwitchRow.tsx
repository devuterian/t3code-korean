import type { ComponentProps } from "react";
import { Pressable } from "react-native";

import { AppText as Text } from "../../../components/AppText";
import { ThemedSwitch } from "../../../components/ThemedSwitch";
import { SettingsControlRow } from "./SettingsControlRow";
import { useTranslate } from "../../../i18n/translate";

export function SettingsSwitchRow(
  props: Omit<ComponentProps<typeof SettingsControlRow>, "children"> & {
    readonly value: boolean | null;
    readonly onValueChange: (value: boolean) => void;
  },
) {
  const t = useTranslate();
  return (
    <SettingsControlRow
      disabled={props.disabled}
      icon={props.icon}
      label={props.label}
      subtitle={props.subtitle}
    >
      {props.value === null ? (
        <Pressable
          accessibilityLabel={t("Set {name} on for selected environments", { name: props.label })}
          accessibilityRole="button"
          disabled={props.disabled}
          className="rounded-full bg-subtle px-3 py-2 active:opacity-70"
          onPress={() => props.onValueChange(true)}
        >
          <Text className="text-sm font-t3-medium text-foreground">{t("Mixed · Set on")}</Text>
        </Pressable>
      ) : (
        <ThemedSwitch
          style={{ alignSelf: "center" }}
          accessibilityLabel={props.label}
          disabled={props.disabled}
          onValueChange={props.onValueChange}
          value={props.value}
        />
      )}
    </SettingsControlRow>
  );
}
