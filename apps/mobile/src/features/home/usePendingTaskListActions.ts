import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Alert } from "react-native";

import { translate } from "../../i18n/translate";
import { removeThreadOutboxMessage } from "../../state/thread-outbox-removal";
import { clearComposerDraftContent } from "../../state/use-composer-drafts";
import type { PendingNewTask } from "../../state/use-pending-new-tasks";
import { releaseEditingQueuedMessage } from "../../state/use-thread-outbox";

export function usePendingTaskListActions(): {
  readonly openPendingTask: (pendingTask: PendingNewTask) => void;
  readonly confirmDeletePendingTask: (pendingTask: PendingNewTask) => void;
} {
  const navigation = useNavigation();

  const openPendingTask = useCallback(
    (pendingTask: PendingNewTask) => {
      navigation.navigate("NewTaskSheet", {
        screen: "NewTaskDraft",
        params: {
          environmentId: String(pendingTask.environmentId),
          projectId: String(pendingTask.projectId),
          ...(pendingTask.kind === "pending"
            ? { pendingTaskId: String(pendingTask.message.messageId) }
            : { draftId: pendingTask.draftKey }),
        },
      });
    },
    [navigation],
  );

  const confirmDeletePendingTask = useCallback((pendingTask: PendingNewTask) => {
    if (pendingTask.kind === "draft") {
      Alert.alert(
        translate("Discard draft?"),
        translate("“{title}” will be removed.", { title: pendingTask.title }),
        [
          { text: translate("Cancel"), style: "cancel" },
          {
            text: translate("Discard"),
            style: "destructive",
            onPress: () => {
              // Same reset a submit performs: the next task in this project
              // re-resolves project defaults instead of inheriting the pick.
              clearComposerDraftContent(pendingTask.draftKey, {
                clearModelSelection: true,
                clearWorkspaceSelection: true,
              });
            },
          },
        ],
      );
      return;
    }
    Alert.alert(
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
            // Release the edit lock only after removal succeeds, and only if
            // it is held for THIS task — clearing it up front (or for another
            // task) would let the drain deliver a mid-edit payload.
            void removeThreadOutboxMessage(pendingTask.message)
              .then(() => releaseEditingQueuedMessage(pendingTask.message.messageId))
              .catch((error) => {
                Alert.alert(
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
