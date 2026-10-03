import type { ComponentProps } from "react";
import { useTranslate } from "../../i18n/translate";
import { OpenAI } from "../Icons";
import { Button } from "../ui/button";

export function ChatGptConnectionButton({ children, ...props }: ComponentProps<typeof Button>) {
  const t = useTranslate();
  return (
    <Button {...props}>
      <OpenAI className="size-4 shrink-0" aria-hidden="true" />
      {children ?? t("Continue with ChatGPT")}
    </Button>
  );
}
