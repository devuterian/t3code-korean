import {
  pullRequestLinkProject,
  resolveLinkPullRequestInput,
} from "@t3tools/client-runtime/pull-request-link-input";
import type {
  EnvironmentProject,
  EnvironmentThreadShell,
} from "@t3tools/client-runtime/state/shell";
import {
  isAtomCommandInterrupted,
  squashAtomCommandFailure,
  type AtomCommandResult,
} from "@t3tools/client-runtime/state/runtime";
import { planThreadPullRequestMutation } from "@t3tools/client-runtime/thread-pull-request-compatibility";
import { AuthOrchestrationOperateScope, type ThreadPullRequestLink } from "@t3tools/contracts";
import * as Clipboard from "expo-clipboard";
import { useCallback, useMemo } from "react";

import * as Dialog from "../../components/ui/Dialog";
import { useTranslate } from "../../i18n/translate";
import { tryOpenExternalUrl } from "../../lib/openExternalUrl";
import type { MenuProps } from "../../components/ui/Menu.types";
import type { EnvironmentRuntimeState } from "../../state/remote-runtime-types";
import { useEnvironmentScope } from "../../state/session";
import { threadEnvironment } from "../../state/threads";
import { useAtomCommand } from "../../state/use-atom-command";

type MenuAction = MenuProps["actions"][number];

export function useLinkedPullRequestActions(input: {
  readonly thread: EnvironmentThreadShell | null;
  readonly project: EnvironmentProject | null;
  readonly runtime: EnvironmentRuntimeState | null;
}) {
  const { thread, project, runtime } = input;
  const t = useTranslate();
  const capabilities = runtime?.serverConfig?.environment.capabilities;
  const canOperate = useEnvironmentScope(
    thread?.environmentId ?? null,
    AuthOrchestrationOperateScope,
  );
  const canEdit = canOperate && capabilities?.threadPullRequests === true;
  const canWatch = canOperate && capabilities?.threadPullRequestWatch === true;
  const canStartWatch =
    canWatch &&
    thread !== null &&
    thread.archivedAt === null &&
    thread.settledAt === null &&
    thread.settledOverride !== "settled" &&
    thread.lineage.relationshipToParent !== "subagent";
  const link = useAtomCommand(threadEnvironment.linkPullRequest, { reportFailure: false });
  const unlink = useAtomCommand(threadEnvironment.unlinkPullRequest, { reportFailure: false });
  const watch = useAtomCommand(threadEnvironment.watchPullRequest, { reportFailure: false });

  const run = useCallback(
    async (failureTitle: string, pending: Promise<AtomCommandResult<unknown, unknown>>) => {
      const result = await pending;
      if (result._tag === "Success" || isAtomCommandInterrupted(result)) return;
      const cause = squashAtomCommandFailure(result);
      Dialog.alert(failureTitle, cause instanceof Error ? cause.message : t("Try again."));
    },
    [t],
  );

  const setLinked = useCallback(
    (
      reference: { host: string; repository: string; number: number; url: string },
      linked: boolean,
    ) => {
      if (thread === null) return;
      const mutation = planThreadPullRequestMutation({
        capabilities,
        threadId: thread.id,
        reference,
        legacyProjectId: null,
        linked,
      });
      if (mutation === null || mutation.type === "thread.meta.update") return;
      const environmentId = thread.environmentId;
      void run(
        linked ? t("Couldn't link this pull request") : t("Couldn't unlink this pull request"),
        mutation.type === "thread.pull-request.link"
          ? link({ environmentId, input: mutation.input })
          : unlink({ environmentId, input: mutation.input }),
      );
    },
    [capabilities, link, run, t, thread, unlink],
  );

  const promptLink = useCallback(() => {
    Dialog.prompt({
      title: t("Link pull request"),
      message: t("Paste a pull request URL, or enter 123 / #123 for this thread's repository."),
      placeholder: t("Pull request URL or #42"),
      initialValue: "",
      confirmText: t("Link"),
      onConfirm: (reference) => {
        const resolved = resolveLinkPullRequestInput({
          reference,
          project: pullRequestLinkProject(project?.repositoryIdentity),
          hasProject: () => true,
        });
        if (resolved === null) {
          Dialog.alert(
            t("Couldn't link this pull request"),
            t("Use a pull request URL, 123, or #123."),
          );
          return;
        }
        if ("error" in resolved) {
          Dialog.alert(t("Couldn't link this pull request"), resolved.error);
          return;
        }
        setLinked(resolved.link, true);
      },
    });
  }, [project, setLinked, t]);

  const menuActions = useCallback(
    (link: ThreadPullRequestLink): MenuAction[] => {
      const open = link.snapshot === null || link.snapshot.state === "open";
      const watching = link.watch !== undefined;
      return [
        { id: "copy", title: t("Copy link"), image: "link" },
        { id: "browser", title: t("Open in browser"), image: "safari" },
        ...((watching ? canWatch : canStartWatch) && open
          ? [
              {
                id: "watch",
                title: watching ? t("Stop watching") : t("Watch for changes"),
                image: watching ? "eye.slash" : "eye",
              },
            ]
          : []),
        ...(canEdit
          ? [
              {
                id: "unlink",
                title: link.source === "stack" ? t("Dismiss from thread") : t("Unlink from thread"),
                image: "xmark",
                attributes: { destructive: true },
              },
            ]
          : []),
      ];
    },
    [canEdit, canStartWatch, canWatch, t],
  );

  const onMenuAction = useCallback(
    (link: ThreadPullRequestLink, action: string) => {
      if (action === "copy") void Clipboard.setStringAsync(link.url);
      else if (action === "browser")
        void tryOpenExternalUrl(link.url, "pull-request").then((opened) => {
          if (!opened)
            Dialog.alert(t("Unable to open PR"), t("The pull request could not be opened."));
        });
      else if (action === "watch" && thread !== null)
        void run(
          t("Couldn't change watching"),
          watch({
            environmentId: thread.environmentId,
            input: {
              threadId: thread.id,
              host: link.host,
              repository: link.repository,
              number: link.number,
              watching: link.watch === undefined,
            },
          }),
        );
      else if (action === "unlink") setLinked(link, false);
    },
    [run, setLinked, t, thread, watch],
  );

  return useMemo(
    () => ({ canLink: canEdit, promptLink, menuActions, onMenuAction }),
    [canEdit, promptLink, menuActions, onMenuAction],
  );
}

export type LinkedPullRequestActions = ReturnType<typeof useLinkedPullRequestActions>;
