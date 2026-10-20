import * as Dialog from "../../components/ui/Dialog";
import { buildNewThreadLink, type LinkedPrompt } from "@t3tools/shared/promptLinks";

import { translate } from "../../i18n/translate";
import { tryCopyTextWithHaptic } from "../../lib/copyTextWithHaptic";
import {
  getComposerDraftSnapshot,
  setComposerDraftText,
  waitForComposerDraftsLoaded,
} from "../../state/use-composer-drafts";
import { linkedThreadDraftAction } from "./prompt-link-model";

export function showPromptLinkNotice(notice: string): void {
  Dialog.alert(translate("Prompt from a link"), notice);
}

export async function applyLinkedPromptToThreadDraft(
  draftKey: string,
  prompt: LinkedPrompt,
  notice: string,
): Promise<void> {
  try {
    await waitForComposerDraftsLoaded();
  } catch {
    Dialog.alert(
      translate("Could not open link"),
      translate("Drafts could not be loaded, so the prompt was not added."),
    );
    return;
  }
  const action = linkedThreadDraftAction(getComposerDraftSnapshot(draftKey).text, prompt.text);
  if (action !== "ask") {
    if (action === "fill") setComposerDraftText(draftKey, prompt.text);
    showPromptLinkNotice(notice);
    return;
  }
  Dialog.alert(translate("Linked prompt ready. Replace draft?"), notice, [
    { text: translate("Keep mine"), style: "cancel" },
    { text: translate("Replace"), onPress: () => setComposerDraftText(draftKey, prompt.text) },
  ]);
}

export async function copyPromptLink(prompt: string): Promise<void> {
  if (!(await tryCopyTextWithHaptic(buildNewThreadLink({ prompt }), { target: "prompt link" }))) {
    Dialog.alert(translate("Could not copy"), translate("Try again."));
  }
}
