import type { ComponentProps } from "react";
import { MaterialFloatingActionButton } from "./MaterialFloatingActionButton.android";
import { MaterialScrollComposeButton } from "./MaterialScrollComposeButton.android";
import { useTranslate } from "../i18n/translate";
import type { MaterialNewThreadButton as SharedMaterialNewThreadButton } from "./MaterialNewThreadButton.shared";

export function MaterialNewThreadButton(
  props: ComponentProps<typeof SharedMaterialNewThreadButton>,
) {
  const t = useTranslate();
  if (props.extended && props.expanded !== undefined) {
    return <MaterialScrollComposeButton {...props} expanded={props.expanded} />;
  }
  return (
    <MaterialFloatingActionButton
      {...props}
      icon="square.and.pencil"
      label={t("New thread")}
      tone="primary"
      variant={props.extended ? "extended" : "large"}
    />
  );
}
