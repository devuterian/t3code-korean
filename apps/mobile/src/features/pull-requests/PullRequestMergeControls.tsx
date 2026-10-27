import { AppActivityIndicator } from "../../components/ui/AppActivityIndicator";
import * as Dialog from "../../components/ui/Dialog";
import { useAtomRefresh, useAtomSet, useAtomValue } from "@effect/atom-react";
import { squashAtomCommandFailure } from "@t3tools/client-runtime/state/runtime";
import { sourceControlClients } from "@t3tools/client-runtime/source-control-clients";
import type { PullRequestDetail, PullRequestMergeMethod } from "@t3tools/contracts";
import { AsyncResult } from "effect/reactivity";
import { useRef, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { AppText as Text } from "../../components/ui/AppText";
import { SymbolView } from "../../components/ui/AppSymbol";
import { Menu } from "../../components/ui/Menu";
import { Button } from "../../components/ui/Button";
import { IconButton } from "../../components/ui/IconButton";
import { useTranslate } from "../../i18n/translate";
import { mobilePreferencesAtom, updateMobilePreferencesAtom } from "../../state/preferences";
import { composerPullRequests } from "../../state/pull-requests";
import { useAtomCommand } from "../../state/use-atom-command";
import {
  allowedMergeMethods,
  canPerformPullRequestAction,
  mergeUnavailableReason,
  MERGE_CONFLICT_REASON,
  MERGE_METHODS,
  pullRequestActionLabel,
} from "./pullRequestActions";
import { pullRequestStackMerge, singlePullRequestMergeAllowed } from "./pullRequestStack";
import { pullRequestTarget, type PullRequestParams } from "./usePullRequestDiff";
import { usePullRequestPermissions } from "./usePullRequestPermissions";
import type { PullRequestStackState } from "./usePullRequestStack";
import { PullRequestGlyph } from "./pullRequestGlyphs";

export function PullRequestMergeControls(props: {
  readonly pr: PullRequestDetail;
  readonly params: PullRequestParams;
  readonly stack: PullRequestStackState;
}) {
  const { pr, stack } = props;
  const t = useTranslate();
  const terminology = sourceControlClients.get(pr.provider).changeRequest;
  const target = pullRequestTarget(props.params);
  const permissions = usePullRequestPermissions(props.params, pr);
  const preferences = useAtomValue(mobilePreferencesAtom);
  const savePreferences = useAtomSet(updateMobilePreferencesAtom);
  const runAction = useAtomCommand(composerPullRequests.runAction, { reportFailure: false });
  const refreshDetail = useAtomRefresh(composerPullRequests.detail(target));
  const refreshActivity = useAtomRefresh(composerPullRequests.activity(target));
  const [selectedMethod, setSelectedMethod] = useState<PullRequestMergeMethod | null>(null);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const methods = allowedMergeMethods(pr);
  const preferred =
    selectedMethod ??
    (AsyncResult.isSuccess(preferences) ? preferences.value.pullRequestMergeMethod : undefined) ??
    "squash";
  const method = methods.includes(preferred)
    ? preferred
    : methods.includes("squash")
      ? "squash"
      : methods[0];
  const scope = stack.stack ? pullRequestStackMerge(stack.stack, pr.number, terminology) : null;
  const canMergeSingle = singlePullRequestMergeAllowed({
    supportsStackActions: stack.supportsStackActions,
    hasStack: stack.stack !== null,
    isFresh: stack.isFresh,
  });
  const checkingStack =
    permissions.connected && stack.supportsStackActions && !stack.isFresh && !stack.error;
  const reason =
    (!permissions.connected
      ? t("Reconnect to merge.")
      : mergeUnavailableReason(pr, permissions.canWrite, terminology)) ??
    (stack.stack
      ? !stack.supportsStackActions
        ? t("This environment can display stacks but cannot merge them.")
        : !stack.isFresh
          ? t("Refresh the stack before merging.")
          : scope?.reason
      : !canMergeSingle
        ? stack.error
          ? t("Couldn't check stack membership. Refresh before merging.")
          : t("Checking stack membership…")
        : null);
  const canMerge = !busy && method !== undefined && !reason;
  const label = method
    ? scope && scope.layers.length > 1
      ? t("{method} stack ({count})", {
          method: t(MERGE_METHODS[method].title),
          count: scope.layers.length,
        })
      : t(MERGE_METHODS[method].title)
    : t("Merge unavailable");
  const autoAction = pr.autoMergeEnabled ? "disable-auto-merge" : "enable-auto-merge";
  const canAutoMerge =
    !busy &&
    (autoAction === "disable-auto-merge" || (!stack.stack && canMergeSingle)) &&
    permissions.canWrite &&
    canPerformPullRequestAction(pr, autoAction);

  const perform = async (action: "merge" | "enable-auto-merge" | "disable-auto-merge") => {
    if (
      pending.current ||
      (action !== "disable-auto-merge" && !method) ||
      (action === "merge" ? !canMerge : !canAutoMerge)
    )
      return;
    pending.current = true;
    setBusy(true);
    const response = await runAction({
      ...target,
      input: {
        ...target.input,
        action,
        ...(action === "merge" && method && stack.stack && scope
          ? {
              stackNumber: stack.stack.number,
              expectedStackHeads: scope.heads,
              mergeMethod: method,
            }
          : action === "merge" && method
            ? {
                resolveMergeMethod: (fresh) => {
                  if (
                    !canPerformPullRequestAction(fresh, "merge") ||
                    !allowedMergeMethods(fresh).includes(method)
                  )
                    throw new Error(
                      t(`The ${terminology.singular} changed. Refresh before merging.`),
                    );
                  return method;
                },
              }
            : action === "enable-auto-merge" && method
              ? { mergeMethod: method }
              : {}),
      },
    });
    // A stack can partly merge before the provider reports a failure.
    refreshDetail();
    refreshActivity();
    stack.refresh();
    pending.current = false;
    setBusy(false);
    if (AsyncResult.isFailure(response)) {
      const cause = squashAtomCommandFailure(response);
      Dialog.alert(
        t("Couldn't complete the merge action"),
        cause instanceof Error ? cause.message : t("Try again."),
      );
    }
  };
  const confirm = (action: "merge" | "enable-auto-merge" | "disable-auto-merge") => {
    const title =
      action === "merge"
        ? scope && scope.layers.length > 1
          ? t("Merge {count} stack layers?", { count: scope.layers.length })
          : t(`${pullRequestActionLabel("merge", terminology)}?`)
        : action === "enable-auto-merge"
          ? t("Enable auto-merge?")
          : t("Disable auto-merge?");
    const message =
      action === "merge" && scope
        ? t("Merge {layers} into {base} using {method}. Layers above #{number} stay open.", {
            layers: scope.layers.map((layer) => `#${layer.number}`).join(" → "),
            base: stack.stack?.base ?? "",
            method: method ?? "",
            number: pr.number,
          })
        : action === "enable-auto-merge"
          ? t(
              "Merge #{number} using {method} when its requirements are met. This may happen immediately.",
              { number: pr.number, method: method ?? "" },
            )
          : action === "disable-auto-merge"
            ? t(`Stop the provider from automatically merging this ${terminology.singular}.`)
            : t("Merge #{number} into {base} using {method}.", {
                number: pr.number,
                base: pr.baseBranch,
                method: method ?? "",
              });
    Dialog.alert(title, message, [
      { text: t("Cancel"), style: "cancel" },
      {
        text:
          action === "merge"
            ? label
            : action === "enable-auto-merge"
              ? t("Enable auto-merge")
              : t("Disable auto-merge"),
        onPress: () => void perform(action),
      },
    ]);
  };
  return (
    <View className="gap-2 border-t border-border-subtle p-3">
      <View
        className={
          Platform.OS === "android"
            ? "flex-row items-center gap-2"
            : `flex-row overflow-hidden rounded-xl border-continuous ${canMerge ? "bg-prominent-action" : "bg-subtle-strong"}`
        }
      >
        {Platform.OS === "android" ? (
          <View className="min-w-0 flex-1">
            <Button
              label={
                busy ? t("Working…") : !permissions.connected ? t("Reconnect to merge") : label
              }
              tone="primary"
              fullWidth
              disabled={!canMerge}
              loading={busy || checkingStack}
              onPress={() => confirm("merge")}
            />
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              scope
                ? t("{label}, {count} stack layers through #{number}", {
                    label,
                    count: scope.layers.length,
                    number: pr.number,
                  })
                : label
            }
            accessibilityState={{ disabled: !canMerge, busy: busy || checkingStack }}
            disabled={!canMerge}
            onPress={() => confirm("merge")}
            className="min-h-11 min-w-0 flex-1 flex-row items-center justify-center gap-2 px-3 py-2 active:opacity-70"
          >
            {busy || checkingStack ? (
              <AppActivityIndicator size="small" colorClassName="accent-icon-muted" />
            ) : (
              <SymbolView
                name={PullRequestGlyph.merged}
                size={16}
                tintColorClassName={
                  canMerge ? "accent-prominent-action-foreground" : "accent-icon-muted"
                }
              />
            )}
            <Text
              className={`shrink text-center text-sm font-t3-semibold ${canMerge ? "text-prominent-action-foreground" : "text-foreground-muted"}`}
            >
              {busy ? t("Working…") : !permissions.connected ? t("Reconnect to merge") : label}
            </Text>
          </Pressable>
        )}
        {methods.length > 0 || canAutoMerge ? (
          <Menu
            title={t("Merge options")}
            actions={[
              ...methods.map((id) => ({
                id,
                title: t(MERGE_METHODS[id].title),
                state: id === method ? ("on" as const) : ("off" as const),
                attributes: { disabled: busy },
              })),
              ...(canAutoMerge
                ? [
                    {
                      id: autoAction,
                      title: t(pr.autoMergeEnabled ? "Disable auto-merge" : "Enable auto-merge"),
                      image: "clock",
                    },
                  ]
                : []),
            ]}
            onPressAction={({ nativeEvent }) => {
              const selected = methods.find((id) => id === nativeEvent.event);
              if (selected) {
                setSelectedMethod(selected);
                savePreferences({ pullRequestMergeMethod: selected });
              } else if (nativeEvent.event === autoAction && canAutoMerge) confirm(autoAction);
            }}
          >
            {Platform.OS === "android" ? (
              <View pointerEvents="none">
                <IconButton
                  accessibilityLabel={t("Merge options")}
                  icon="chevron.down"
                  variant="tonal"
                />
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("Merge options")}
                className="min-h-11 w-11 items-center justify-center border-l border-border-subtle"
              >
                <SymbolView
                  name="chevron.down"
                  size={13}
                  tintColorClassName={
                    canMerge ? "accent-prominent-action-foreground" : "accent-icon-muted"
                  }
                />
              </Pressable>
            )}
          </Menu>
        ) : null}
      </View>
      {permissions.connected &&
      reason &&
      reason !== t(MERGE_CONFLICT_REASON) &&
      reason !== t("Checking stack membership…") &&
      !(checkingStack && reason === t("Refresh the stack before merging.")) ? (
        <Text className="px-1 text-xs text-foreground-muted">{reason}</Text>
      ) : null}
      {pr.autoMergeEnabled ? (
        <Text className="px-1 text-xs text-foreground-muted">
          {t("Auto-merge is enabled")}
          {pr.autoMergeMethod ? ` · ${pr.autoMergeMethod}` : ""}
        </Text>
      ) : null}
      {stack.error && stack.supportsStackActions ? (
        <Button label={t("Retry stack lookup")} tone="text" onPress={stack.refresh} />
      ) : null}
    </View>
  );
}
