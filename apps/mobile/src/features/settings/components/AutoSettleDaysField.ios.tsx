import { Button, Host, HStack, Picker, Popover, Text, VStack } from "@expo/ui/swift-ui";
import {
  accessibilityLabel,
  buttonStyle,
  disabled,
  font,
  foregroundStyle,
  frame,
  padding,
  pickerStyle,
  presentationBackground,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import {
  MAX_SIDEBAR_AUTO_SETTLE_AFTER_DAYS,
  MIN_SIDEBAR_AUTO_SETTLE_AFTER_DAYS,
} from "@t3tools/contracts";
import { useState } from "react";

import { useAppearancePreferences } from "../appearance/AppearancePreferencesProvider";
import type { AutoSettleDaysFieldProps } from "./AutoSettleDaysField";
import { useTranslate } from "../../../i18n/translate";

const days = Array.from(
  { length: MAX_SIDEBAR_AUTO_SETTLE_AFTER_DAYS - MIN_SIDEBAR_AUTO_SETTLE_AFTER_DAYS + 1 },
  (_, index) => MIN_SIDEBAR_AUTO_SETTLE_AFTER_DAYS + index,
);

export function AutoSettleDaysField(props: AutoSettleDaysFieldProps) {
  const { themeAppearance, themeVariables: colors, appearance } = useAppearancePreferences();
  const t = useTranslate();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(props.value);
  return (
    <Host matchContents colorScheme={themeAppearance} seedColor={colors["--color-primary"]}>
      <Popover isPresented={open} onIsPresentedChange={setOpen}>
        <Popover.Trigger>
          <Button
            onPress={() => {
              if (props.disabled) return;
              setDraft(props.value);
              setOpen(true);
            }}
            modifiers={[
              buttonStyle("bordered"),
              disabled(props.disabled),
              accessibilityLabel(t("Days before auto-settle: {count}", { count: props.value })),
              frame({ minWidth: 64, minHeight: 44 }),
              foregroundStyle(colors["--color-primary-text"]),
              font({ size: appearance.baseFontSize }),
            ]}
          >
            <Text>{String(props.value)}</Text>
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          <VStack
            modifiers={[
              padding({ all: 12 }),
              frame({ width: 240 }),
              presentationBackground(colors["--color-sheet-solid"]),
            ]}
          >
            <Picker
              label={t("Days before auto-settle")}
              selection={draft}
              onSelectionChange={setDraft}
              modifiers={[pickerStyle("wheel"), frame({ height: 180 })]}
            >
              {days.map((value) => (
                <Text
                  key={value}
                  modifiers={[tag(value), foregroundStyle(colors["--color-foreground"])]}
                >
                  {t(value === 1 ? "{count} day" : "{count} days", { count: value })}
                </Text>
              ))}
            </Picker>
            <HStack spacing={24}>
              <Button
                label={t("Cancel")}
                onPress={() => setOpen(false)}
                modifiers={[foregroundStyle(colors["--color-primary-text"])]}
              />
              <Button
                label={t("Done")}
                onPress={() => {
                  setOpen(false);
                  if (!props.disabled && draft !== props.value) props.onValueChange(draft);
                }}
                modifiers={[foregroundStyle(colors["--color-primary-text"])]}
              />
            </HStack>
          </VStack>
        </Popover.Content>
      </Popover>
    </Host>
  );
}
