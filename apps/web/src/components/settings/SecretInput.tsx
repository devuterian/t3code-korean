import { DraftInput, type DraftInputProps } from "../ui/draft-input";
import { Input, type InputProps } from "../ui/input";
import { useTranslate } from "../../i18n/translate";

type SecretInputProps = Omit<InputProps, "type" | "autoComplete" | "defaultValue" | "value"> & {
  /** Pass only the replacement draft as `value`. */
  readonly configured?: boolean;
  readonly value: string;
  readonly onCommit?: DraftInputProps["onCommit"];
};

export function SecretInput({
  configured = false,
  placeholder,
  onCommit,
  ...props
}: SecretInputProps) {
  const t = useTranslate();
  const shared = {
    ...props,
    type: "password" as const,
    autoComplete: "off",
    spellCheck: false,
    placeholder: configured
      ? t("Stored secret, enter a new value to replace")
      : (placeholder ?? t("Not set")),
  };
  if (onCommit) {
    return (
      <DraftInput
        {...shared}
        onCommit={(next) => {
          if (configured && next === "") return;
          onCommit(next);
        }}
      />
    );
  }
  return <Input {...shared} />;
}
