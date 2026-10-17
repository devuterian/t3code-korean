import type { LinkedPrompt } from "@t3tools/shared/promptLinks";

import { type ComposerThreadTarget, useComposerDraftStore } from "~/composerDraftStore";
import { translate } from "~/i18n/translate";

import { toastManager } from "../ui/toast";

/** A warning that stays until dismissed when the link's prompt hid characters from the reader. */
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

/**
 * Puts a linked prompt in a composer for the user to read and send. Text the user already typed
 * there is never replaced without asking: a toast offers to swap it for the linked prompt.
 * `notes` carry anything the link asked for and did not get, such as a model.
 */
export function placeLinkedPrompt(
  target: ComposerThreadTarget,
  prompt: LinkedPrompt,
  notes: ReadonlyArray<string> = [],
): void {
  warnAboutHiddenCharacters(prompt);
  const place = () => {
    useComposerDraftStore.getState().setPrompt(target, prompt.text);
    // It was not written here, so it must be read before it is sent.
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
