import {
  MAX_SIDEBAR_AUTO_SETTLE_AFTER_DAYS,
  MIN_SIDEBAR_AUTO_SETTLE_AFTER_DAYS,
} from "@t3tools/contracts";
import type { ComponentProps } from "react";
import { NumberField } from "../../../components/ui/NumberField";
import { useTranslate } from "../../../i18n/translate";

export type AutoSettleDaysFieldProps = Pick<
  ComponentProps<typeof NumberField>,
  "value" | "onValueChange" | "disabled"
>;

export function AutoSettleDaysField(props: AutoSettleDaysFieldProps) {
  const t = useTranslate();
  return (
    <NumberField
      {...props}
      min={MIN_SIDEBAR_AUTO_SETTLE_AFTER_DAYS}
      max={MAX_SIDEBAR_AUTO_SETTLE_AFTER_DAYS}
      label={t("Days before auto-settle")}
      formatValue={(value) => t(value === 1 ? "{count} day" : "{count} days", { count: value })}
    />
  );
}
