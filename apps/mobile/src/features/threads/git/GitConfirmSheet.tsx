import { resolveDefaultBranchActionDialogCopy } from "@t3tools/client-runtime/state/vcs";
import { sourceControlClients } from "@t3tools/client-runtime/source-control-clients";
import { resolveAutoFeatureBranchName } from "@t3tools/shared/git";
import * as Arr from "effect/Array";
import * as Result from "effect/Result";
import { StackActions, useNavigation, type StaticScreenProps } from "@react-navigation/native";
import { useCallback, useMemo } from "react";
import { View } from "react-native";

import { SheetHeader } from "../../../components/ui/SheetHeader";
import { FitSheet } from "../../../components/ui/FitSheet";
import { SheetIntro } from "../../../components/ui/SheetIntro";
import { translate, useTranslate } from "../../../i18n/translate";
import { useSelectedThreadGitActions } from "../../../state/use-selected-thread-git-actions";
import { useSelectedThreadGitState } from "../../../state/use-selected-thread-git-state";
import { useThreadSelection } from "../../../state/use-thread-selection";
import { SheetActionButton } from "./gitSheetComponents";

const DEFAULT_BRANCH_DIALOG_SUFFIX =
  ' on "{branch}". You can continue on this branch or create a feature branch and run the same action there.';

/**
 * Localized default-branch dialog copy. Each template reproduces the shared
 * English helper; if that helper's wording drifts, its English text wins.
 */
function localizeDefaultBranchDialogCopy(
  t: (source: string, params?: Readonly<Record<string, string>>) => string,
  input: {
    readonly action: "push" | "create_pr" | "commit_push" | "commit_push_pr";
    readonly branchName: string;
    readonly includesCommit: boolean;
    readonly terminology: Parameters<typeof resolveDefaultBranchActionDialogCopy>[0]["terminology"];
  },
) {
  const english = resolveDefaultBranchActionDialogCopy(input);
  const params = { branch: input.branchName };
  const localize = (template: string, source: string) =>
    translate(template, params, "en") === source ? t(template, params) : source;
  const pushes = input.action === "push" || input.action === "commit_push";
  const descriptionTemplate = pushes
    ? input.includesCommit
      ? `This action will commit and push changes${DEFAULT_BRANCH_DIALOG_SUFFIX}`
      : `This action will push local commits${DEFAULT_BRANCH_DIALOG_SUFFIX}`
    : input.includesCommit
      ? `This action will commit, push, and create ${input.terminology.shortLabelWithArticle}${DEFAULT_BRANCH_DIALOG_SUFFIX}`
      : `This action will push local commits and create ${input.terminology.shortLabelWithArticle}${DEFAULT_BRANCH_DIALOG_SUFFIX}`;
  const continueTemplate = pushes
    ? input.includesCommit
      ? "Commit & push to {branch}"
      : "Push to {branch}"
    : english.continueLabel;
  return {
    title: t(english.title),
    description: localize(descriptionTemplate, english.description),
    continueLabel: localize(continueTemplate, english.continueLabel),
  };
}

type GitConfirmSheetProps = StaticScreenProps<{
  readonly environmentId: string;
  readonly threadId: string;
  readonly confirmAction?: string;
  readonly branchName?: string;
  readonly includesCommit?: string;
  readonly commitMessage?: string;
  readonly filePaths?: string;
}>;

export function GitConfirmSheet(props: GitConfirmSheetProps) {
  const navigation = useNavigation();
  const t = useTranslate();
  const gitState = useSelectedThreadGitState();
  const gitActions = useSelectedThreadGitActions();
  const { canWriteSourceControl, canChangeThreadBranch } = gitActions;
  const { selectedThreadProject } = useThreadSelection();
  const terminology = sourceControlClients.get(
    selectedThreadProject?.repositoryIdentity?.provider,
  ).changeRequest;

  const params = props.route.params;

  const confirmAction = params.confirmAction as
    | "push"
    | "create_pr"
    | "commit_push"
    | "commit_push_pr"
    | undefined;
  const branchName = params.branchName ?? "";
  const includesCommit = params.includesCommit === "true";
  const environmentId = params.environmentId ?? "";
  const threadId = params.threadId ?? "";

  const copy = useMemo(
    () =>
      confirmAction
        ? localizeDefaultBranchDialogCopy(t, {
            action: confirmAction,
            branchName,
            includesCommit,
            terminology,
          })
        : null,
    [branchName, confirmAction, includesCommit, t, terminology],
  );

  const continuePendingAction = async () => {
    if (!canWriteSourceControl || !confirmAction) return;
    navigation.dispatch(StackActions.replace("Thread", { environmentId, threadId }));
    await gitActions.onRunSelectedThreadGitAction({
      action: confirmAction,
      ...(params.commitMessage ? { commitMessage: params.commitMessage } : {}),
      ...(params.filePaths ? { filePaths: params.filePaths.split(",") } : {}),
    });
  };

  const movePendingActionToFeatureBranch = useCallback(async () => {
    if (!canChangeThreadBranch || !confirmAction) return;
    navigation.dispatch(StackActions.replace("Thread", { environmentId, threadId }));

    if (includesCommit) {
      await gitActions.onRunSelectedThreadGitAction({
        action: confirmAction,
        featureBranch: true,
        ...(params.commitMessage ? { commitMessage: params.commitMessage } : {}),
        ...(params.filePaths ? { filePaths: params.filePaths.split(",") } : {}),
      });
      return;
    }

    const branches =
      gitState.selectedThreadBranches.length > 0
        ? gitState.selectedThreadBranches
        : await gitActions.refreshSelectedThreadBranches();
    if (branches === null) return;
    const newBranchName = resolveAutoFeatureBranchName(
      Arr.filterMap(branches, (branch) =>
        branch.isRemote ? Result.failVoid : Result.succeed(branch.name),
      ),
    );
    const created = await gitActions.onCreateSelectedThreadBranch(newBranchName);
    if (created === null) return;
    await gitActions.onRunSelectedThreadGitAction({ action: confirmAction });
  }, [
    canChangeThreadBranch,
    confirmAction,
    gitActions,
    gitState.selectedThreadBranches,
    includesCommit,
    params,
    navigation,
    environmentId,
    threadId,
  ]);

  return (
    <FitSheet
      header={<SheetHeader title={t("Confirm action")} onClose={() => navigation.goBack()} />}
      showsVerticalScrollIndicator={false}
    >
      <SheetIntro
        eyebrow={t("Confirm")}
        title={copy?.title ?? t("Run action on default branch?")}
        description={copy?.description ?? t("Choose how to continue.")}
      />

      <View className="gap-3">
        <SheetActionButton
          icon="arrow.right.circle"
          label={copy?.continueLabel ?? t("Continue")}
          disabled={!canWriteSourceControl}
          onPress={() => void continuePendingAction()}
        />
        <SheetActionButton
          icon="arrow.branch"
          label={t("Feature branch & continue")}
          disabled={!canChangeThreadBranch}
          tone="primary"
          onPress={() => void movePendingActionToFeatureBranch()}
        />
      </View>
    </FitSheet>
  );
}
