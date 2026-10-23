import * as Dialog from "../../components/ui/Dialog";
import { useHomeThreadRouteSelection } from "./home-thread-navigation";
import { useCallback } from "react";

import { translate } from "../../i18n/translate";
import { removeThreadOutboxMessage } from "../../state/thread-outbox-removal";
import { clearComposerDraftContent } from "../../state/use-composer-drafts";
import type { PendingNewTask } from "../../state/use-pending-new-tasks";
import { appAtomRegistry } from "../../state/atom-registry";
import {
  editingQueuedMessageIdsAtom,
  holdEditingQueuedMessage,
  releaseEditingQueuedMessage,
} from "../../state/use-thread-outbox";
import { withThreadDismissal } from "./thread-dismissal";

export function usePendingTaskListActions(
  selectRoute?: (params: ReactNavigation.RootParamList["Thread"]) => void,
): {
  readonly openPendingTask: (pendingTask: PendingNewTask) => void;
  readonly confirmDeletePendingTask: (pendingTask: PendingNewTask) => void;
} {
  const selectHomeRoute = useHomeThreadRouteSelection();
  const selectThreadRoute = selectRoute ?? selectHomeRoute;

  const openPendingTask = useCallback(
    (pendingTask: PendingNewTask) => {
      selectThreadRoute(
        pendingTask.kind === "pending"
          ? {
              environmentId: String(pendingTask.environmentId),
              threadId: String(pendingTask.message.threadId),
            }
          : {
              draft: {
                environmentId: String(pendingTask.environmentId),
                projectId: String(pendingTask.projectId),
                draftId: pendingTask.draftKey,
              },
            },
      );
    },
    [selectThreadRoute],
  );

  const confirmDeletePendingTask = useCallback((pendingTask: PendingNewTask) => {
    if (pendingTask.kind === "draft") {
      Dialog.alert(
        translate("Discard draft?"),
        translate("“{title}” will be removed.", { title: pendingTask.title }),
        [
          { text: translate("Cancel"), style: "cancel" },
          {
            text: translate("Discard"),
            style: "destructive",
            onPress: () => {
              void withThreadDismissal(
                pendingTask.key,
                async () =>
                  clearComposerDraftContent(pendingTask.draftKey, {
                    clearModelSelection: true,
                    clearWorkspaceSelection: true,
                  }),
                () => true,
              );
            },
          },
        ],
      );
      return;
    }
    Dialog.alert(
      translate("Delete pending task?"),
      translate("“{title}” has not been sent yet and will be removed from the outbox.", {
        title: pendingTask.title,
      }),
      [
        { text: translate("Cancel"), style: "cancel" },
        {
          text: translate("Delete"),
          style: "destructive",
          onPress: () => {
            // The row animates out before removal runs, so hold delivery from
            // confirmation on: a reconnect must not send a task being deleted.
            // The hold is shared with the editor, which could release it
            // mid-animation, so a task open in the editor is removed at once
            // and keeps its hold unless removal succeeds.
            const messageId = pendingTask.message.messageId;
            const heldByEditor = appAtomRegistry.get(editingQueuedMessageIdsAtom)[messageId];
            holdEditingQueuedMessage(messageId);
            const releaseUnlessEditing = () => {
              if (!heldByEditor) releaseEditingQueuedMessage(messageId);
            };
            const remove = () => removeThreadOutboxMessage(pendingTask.message);
            void (
              heldByEditor
                ? remove()
                : withThreadDismissal(pendingTask.key, remove, (removed) => removed)
            )
              .then((removed) =>
                removed ? releaseEditingQueuedMessage(messageId) : releaseUnlessEditing(),
              )
              .catch((error) => {
                releaseUnlessEditing();
                Dialog.alert(
                  translate("Could not delete pending task"),
                  error instanceof Error
                    ? error.message
                    : translate("The pending task could not be removed."),
                );
              });
          },
        },
      ],
    );
  }, []);

  return { openPendingTask, confirmDeletePendingTask };
}
