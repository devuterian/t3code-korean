import type { LinkedPrompt } from "@t3tools/shared/promptLinks";

import { type ComposerThreadTarget, useComposerDraftStore } from "~/composerDraftStore";
import { translate } from "~/i18n/translate";

import { toastManager } from "../ui/toast";

export function warnAboutHiddenCharacters(prompt: LinkedPrompt): void {
  if (prompt.hiddenCharacters === 0) return;
  toastManager.add({
    type: "warning",
    title: translate("This prompt had hidden characters, it may be malicious"),
    description: translate(
      prompt.hiddenCharacters === 1
        ? "T3 Code removed {count} hidden character. Read the prompt before you send it."
        : "T3 Code removed {count} hidden characters. Read the prompt before you send it.",
    ).replace("{count}", () => String(prompt.hiddenCharacters)),
    timeout: 0,
  });
}

export function placeLinkedPrompt(
  target: ComposerThreadTarget,
  prompt: LinkedPrompt,
  notes: ReadonlyArray<string> = [],
): void {
  warnAboutHiddenCharacters(prompt);
  const place = () => {
    useComposerDraftStore.getState().setPrompt(target, prompt.text);
    toastManager.add({
      type: "info",
      title: translate("Prompt added from a link"),
      description: [translate("Read it before you send."), ...notes].join(" "),
    });
  };
  const existing = useComposerDraftStore.getState().getComposerDraft(target)?.prompt ?? "";
  if (existing.trim().length === 0 || existing === prompt.text) {
    place();
    return;
  }
  const id = toastManager.add({
    type: "info",
    title: translate("Linked prompt ready"),
    description: translate("This thread already has a draft. Replace it with the linked prompt?"),
    timeout: 0,
    actionProps: {
      children: translate("Replace draft"),
      onClick: () => {
        toastManager.close(id);
        place();
      },
    },
  });
}
