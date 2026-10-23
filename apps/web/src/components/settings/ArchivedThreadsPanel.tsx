import { settingsScopeEnvironmentLabels } from "./settingsScopeAxis";
import { Spinner } from "~/components/ui/spinner";
import { ArchiveIcon, ArchiveX, EllipsisIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { type EnvironmentId, type ScopedThreadRef, type ThreadId } from "@t3tools/contracts";
import { scopeThreadRef } from "@t3tools/client-runtime/environment";
import { presentThreadShell } from "@t3tools/client-runtime/state/shell";
import {
  isAtomCommandInterrupted,
  settlePromise,
  squashAtomCommandFailure,
} from "@t3tools/client-runtime/state/runtime";
import { useSettingsScope } from "./SettingsScopeContext";
import { useThreadActions } from "../../hooks/useThreadActions";
import { readLocalApi } from "../../localApi";
import { useArchivedThreadSnapshots } from "../../lib/archivedThreadsState";
import { RelativeTime } from "../RelativeTime";
import { Button } from "../ui/button";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "../ui/menu";
import { stackedThreadToast, toastManager } from "../ui/toast";
import { SettingsPageContainer, SettingsRow, SettingsSection } from "./settingsLayout";
import { searchableSetting } from "./settingsSearch";
import { ProjectFavicon } from "../ProjectFavicon";
import { translate, useTranslate } from "../../i18n/translate";

export function ArchivedThreadsPanel() {
  const t = useTranslate();
  const { scope, groups: projectGroups, environments } = useSettingsScope();
  const { unarchiveThread, unarchiveThreads, confirmAndDeleteThread, deleteArchivedThreads } =
    useThreadActions();
  const [isBulkActionPending, setIsBulkActionPending] = useState(false);
  const {
    snapshots: archivedSnapshots,
    error: archiveError,
    isLoading: isLoadingArchive,
    refresh: refreshArchivedThreads,
  } = useArchivedThreadSnapshots(scope.environmentIds);

  const { groups: archivedGroups, hasMultipleEnvironments } = (() => {
    const selectedProjectKeys =
      scope.kind === "project" || scope.kind === "checkout"
        ? new Set(scope.members.map((member) => `${member.environmentId}:${member.id}`))
        : null;
    const projectsByEnvironmentAndId = new Map(
      archivedSnapshots.flatMap(({ environmentId, snapshot }) =>
        snapshot.projects
          .filter(
            (project) =>
              selectedProjectKeys === null ||
              selectedProjectKeys.has(`${environmentId}:${project.id}`),
          )
          .map(
            (project) => [`${environmentId}:${project.id}`, { ...project, environmentId }] as const,
          ),
      ),
    );
    const environmentLabels = new Map(
      environments.map((environment) => {
        const { primary, secondary } = settingsScopeEnvironmentLabels(environment, environments);
        return [environment.environmentId, secondary ? `${primary} (${secondary})` : primary];
      }),
    );
    const threads = archivedSnapshots.flatMap(({ environmentId, snapshot }) =>
      snapshot.threads.map((thread) => ({
        ...presentThreadShell(environmentId, thread),
        environmentLabel: environmentLabels.get(environmentId) ?? environmentId,
      })),
    );
    const hasMultipleEnvironments =
      new Set(
        threads
          .filter((thread) =>
            projectsByEnvironmentAndId.has(`${thread.environmentId}:${thread.projectId}`),
          )
          .map((thread) => thread.environmentId),
      ).size > 1;
    const logicalGroupsByProjectKey = new Map(
      projectGroups.flatMap((group) =>
        group.memberProjectRefs.map(
          (member) => [`${member.environmentId}:${member.projectId}`, group] as const,
        ),
      ),
    );

    const archivedProjects = Array.from(projectsByEnvironmentAndId.values());
    const groups = new Map<
      string,
      {
        readonly project: (typeof archivedProjects)[number];
        readonly title: string;
        readonly threads: Array<(typeof threads)[number]>;
      }
    >();
    for (const project of archivedProjects) {
      const projectThreads: Array<(typeof threads)[number]> = [];
      for (const thread of threads) {
        if (thread.projectId === project.id && thread.environmentId === project.environmentId) {
          projectThreads.push(thread);
        }
      }
      if (projectThreads.length > 0) {
        const physicalProjectKey = `${project.environmentId}:${project.id}` as const;
        const logicalGroup = hasMultipleEnvironments
          ? logicalGroupsByProjectKey.get(physicalProjectKey)
          : undefined;
        const groupKey = logicalGroup?.projectKey ?? physicalProjectKey;
        const group = groups.get(groupKey);
        if (group) {
          group.threads.push(...projectThreads);
        } else {
          groups.set(groupKey, {
            project,
            title: logicalGroup?.displayName ?? project.title,
            threads: projectThreads,
          });
        }
      }
    }
    const sortedGroups = Array.from(groups, ([key, group]) => ({
      ...group,
      key,
      threads: group.threads.toSorted((left, right) => {
        const leftKey = left.archivedAt ?? left.createdAt;
        const rightKey = right.archivedAt ?? right.createdAt;
        return rightKey.localeCompare(leftKey) || right.id.localeCompare(left.id);
      }),
    }));
    return { groups: sortedGroups, hasMultipleEnvironments };
  })();

  const handleArchivedThreadContextMenu = async (
    threadRef: ScopedThreadRef,
    position: { x: number; y: number },
  ) => {
    const api = readLocalApi();
    if (!api) return;
    const clicked = await api.contextMenu.show(
      [
        { id: "unarchive", label: translate("Unarchive") },
        { id: "delete", label: translate("Delete"), destructive: true },
      ],
      position,
    );

    if (clicked === "unarchive") {
      const result = await unarchiveThread(threadRef);
      if (result._tag === "Success") {
        refreshArchivedThreads();
      } else if (!isAtomCommandInterrupted(result)) {
        const error = squashAtomCommandFailure(result);
        toastManager.add(
          stackedThreadToast({
            type: "error",
            title: translate("Failed to unarchive thread"),
            description: error instanceof Error ? error.message : translate("An error occurred."),
          }),
        );
      }
      return;
    }

    if (clicked === "delete") {
      const result = await confirmAndDeleteThread(threadRef);
      if (result._tag === "Success") {
        refreshArchivedThreads();
      } else if (!isAtomCommandInterrupted(result)) {
        const error = squashAtomCommandFailure(result);
        toastManager.add(
          stackedThreadToast({
            type: "error",
            title: translate("Failed to delete thread"),
            description: error instanceof Error ? error.message : translate("An error occurred."),
          }),
        );
      }
    }
  };

  const archivedThreadCount = archivedGroups.reduce(
    (count, group) => count + group.threads.length,
    0,
  );

  /** Unarchives or deletes every listed thread; `scopeLabel` names the set in the delete prompt. */
  const handleBulkArchivedThreadAction = async (
    action: "unarchive" | "delete",
    threads: ReadonlyArray<{ readonly environmentId: EnvironmentId; readonly id: ThreadId }>,
    scopeLabel: string,
  ) => {
    if (threads.length === 0) return;
    if (action === "delete") {
      const api = readLocalApi();
      if (!api) return;
      // Always confirm: one click here can erase many threads at once.
      const confirmed = await settlePromise(() =>
        api.dialogs.confirm(
          [
            t(
              `Delete ${threads.length} archived thread${threads.length === 1 ? "" : "s"}${scopeLabel}?`,
            ),
            t("This permanently clears conversation history for these threads."),
          ].join("\n"),
          { variant: "destructive" },
        ),
      );
      if (confirmed._tag === "Failure" || !confirmed.value) return;
    }
    setIsBulkActionPending(true);
    const targets = threads.map((thread) => scopeThreadRef(thread.environmentId, thread.id));
    const failure = await (action === "unarchive"
      ? unarchiveThreads(targets)
      : deleteArchivedThreads(targets));
    setIsBulkActionPending(false);
    if (failure !== null) {
      const error = squashAtomCommandFailure(failure);
      toastManager.add(
        stackedThreadToast({
          type: "error",
          title:
            action === "unarchive"
              ? t("Failed to unarchive threads")
              : t("Failed to delete threads"),
          description: error instanceof Error ? error.message : t("An error occurred."),
        }),
      );
    }
  };

  return (
    <SettingsPageContainer>
      {archivedGroups.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 sm:px-4">
          <p className="text-sm text-muted-foreground">
            {t(`${archivedThreadCount} archived thread${archivedThreadCount === 1 ? "" : "s"}`)}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={isBulkActionPending}
              onClick={() => {
                void handleBulkArchivedThreadAction(
                  "unarchive",
                  archivedGroups.flatMap((group) => group.threads),
                  "",
                );
              }}
            >
              <ArchiveX className="size-3.5" />
              <span>{t("Unarchive all")}</span>
            </Button>
            <Button
              type="button"
              variant="destructive-outline"
              size="xs"
              disabled={isBulkActionPending}
              onClick={() => {
                void handleBulkArchivedThreadAction(
                  "delete",
                  archivedGroups.flatMap((group) => group.threads),
                  archivedGroups.length === 1 ? ` in ${archivedGroups[0]!.project.title}` : "",
                );
              }}
            >
              <Trash2Icon className="size-3.5" />
              <span>{t("Delete all")}</span>
            </Button>
          </div>
        </div>
      ) : null}
      {archivedGroups.length === 0 ? (
        <SettingsSection
          id={isLoadingArchive ? undefined : searchableSetting("archive").id}
          title={searchableSetting("archive").title}
        >
          <SettingsRow
            title={
              <span className="inline-flex items-center gap-2">
                {isLoadingArchive ? (
                  <Spinner size="sm" tone="muted" />
                ) : (
                  <ArchiveIcon className="size-3.5 text-muted-foreground" />
                )}
                {t(
                  isLoadingArchive
                    ? "Loading archived threads"
                    : archiveError
                      ? "Could not load archived threads"
                      : "No archived threads",
                )}
              </span>
            }
            description={
              isLoadingArchive
                ? t("Checking connected environments.")
                : (archiveError ?? t("Archived threads will appear here."))
            }
          />
        </SettingsSection>
      ) : (
        archivedGroups.map(({ key, project, title, threads: projectThreads }, index) => (
          <SettingsSection
            key={key}
            id={index === 0 ? searchableSetting("archive").id : undefined}
            title={title}
            icon={<ProjectFavicon project={project} />}
            headerAction={
              <Menu>
                <MenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost-muted"
                      size="icon-xs"
                      disabled={isBulkActionPending}
                      aria-label={t(`Archived thread actions for ${project.title}`)}
                    />
                  }
                >
                  <EllipsisIcon className="size-3.5" />
                </MenuTrigger>
                <MenuPopup align="end">
                  <MenuItem
                    onClick={() => {
                      void handleBulkArchivedThreadAction("unarchive", projectThreads, "");
                    }}
                  >
                    <ArchiveX />
                    {t("Unarchive all in project")}
                  </MenuItem>
                  <MenuItem
                    variant="destructive"
                    onClick={() => {
                      void handleBulkArchivedThreadAction(
                        "delete",
                        projectThreads,
                        ` in ${project.title}`,
                      );
                    }}
                  >
                    <Trash2Icon />
                    {t("Delete all in project")}
                  </MenuItem>
                </MenuPopup>
              </Menu>
            }
          >
            {projectThreads.map((thread) => (
              <SettingsRow
                key={`${thread.environmentId}:${thread.id}`}
                onContextMenu={(event) => {
                  event.preventDefault();
                  void (async () => {
                    const result = await settlePromise(() =>
                      handleArchivedThreadContextMenu(
                        scopeThreadRef(thread.environmentId, thread.id),
                        {
                          x: event.clientX,
                          y: event.clientY,
                        },
                      ),
                    );
                    if (result._tag === "Failure") {
                      const error = squashAtomCommandFailure(result);
                      toastManager.add(
                        stackedThreadToast({
                          type: "error",
                          title: translate("Archived thread action failed"),
                          description:
                            error instanceof Error
                              ? error.message
                              : translate("An error occurred."),
                        }),
                      );
                    }
                  })();
                }}
                title={thread.title}
                description={
                  <span className={hasMultipleEnvironments ? "block truncate" : undefined}>
                    {hasMultipleEnvironments ? `${thread.environmentLabel} · ` : null}
                    {t("Archived")}{" "}
                    <RelativeTime timestamp={thread.archivedAt ?? thread.createdAt} />
                    {` \u00b7 ${t("Created")} `}
                    <RelativeTime timestamp={thread.createdAt} />
                  </span>
                }
                control={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => {
                      void (async () => {
                        const result = await unarchiveThread(
                          scopeThreadRef(thread.environmentId, thread.id),
                        );
                        if (result._tag === "Success") {
                          refreshArchivedThreads();
                          return;
                        }
                        if (!isAtomCommandInterrupted(result)) {
                          const error = squashAtomCommandFailure(result);
                          toastManager.add(
                            stackedThreadToast({
                              type: "error",
                              title: translate("Failed to unarchive thread"),
                              description:
                                error instanceof Error
                                  ? error.message
                                  : translate("An error occurred."),
                            }),
                          );
                        }
                      })();
                    }}
                  >
                    <ArchiveX className="size-3.5" />
                    <span>{t("Unarchive")}</span>
                  </Button>
                }
              />
            ))}
          </SettingsSection>
        ))
      )}
    </SettingsPageContainer>
  );
}
