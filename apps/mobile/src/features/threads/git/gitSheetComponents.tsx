import { sourceControlClients } from "@t3tools/client-runtime/source-control-clients";
import { SymbolView } from "../../../components/ui/AppSymbol";
import type { ComponentProps } from "react";
import { View } from "react-native";
import { Button } from "../../../components/ui/Button";
import { translate } from "../../../i18n/translate";

export function SheetActionButton(props: {
  readonly icon: ComponentProps<typeof SymbolView>["name"];
  readonly label: string;
  readonly disabled?: boolean;
  readonly tone?: "primary" | "secondary" | "danger";
  readonly onPress: () => void;
}) {
  return (
    <View className="flex-1">
      <Button {...props} fullWidth />
    </View>
  );
}

export function menuItemIconName(
  icon: "commit" | "push" | "pr",
): ComponentProps<typeof SymbolView>["name"] {
  if (icon === "commit") return "checkmark.circle";
  if (icon === "push") return "arrow.up.circle";
  return "arrow.up.right.circle";
}

export function statusSummary(
  gitStatus: {
    readonly isRepo?: boolean;
    readonly hasWorkingTreeChanges?: boolean;
    readonly workingTree?: { readonly files: readonly { readonly path: string }[] };
    readonly aheadCount?: number;
    readonly behindCount?: number;
    readonly pr?: { readonly state?: string; readonly number?: number } | null;
    readonly sourceControlProvider?: { readonly kind: string } | null;
  } | null,
): string {
  if (!gitStatus) {
    return translate("Loading branch status\u2026");
  }

  if (!gitStatus.isRepo) {
    return translate("Not a git repository");
  }

  const parts: string[] = [];
  if (gitStatus.hasWorkingTreeChanges) {
    const fileCount = gitStatus.workingTree?.files.length ?? 0;
    parts.push(
      fileCount === 1
        ? translate("{count} file changed", { count: fileCount })
        : translate("{count} files changed", { count: fileCount }),
    );
  } else {
    parts.push(translate("Clean"));
  }
  if ((gitStatus.aheadCount ?? 0) > 0) {
    parts.push(translate("{count} ahead", { count: gitStatus.aheadCount ?? 0 }));
  }
  if ((gitStatus.behindCount ?? 0) > 0) {
    parts.push(translate("{count} behind", { count: gitStatus.behindCount ?? 0 }));
  }
  if (gitStatus.pr?.state === "open") {
    const { shortLabel } = sourceControlClients.get(
      gitStatus.sourceControlProvider?.kind,
    ).changeRequest;
    parts.push(
      translate("{label} #{number} {state}", {
        label: translate(shortLabel),
        number: String(gitStatus.pr.number),
        state: translate("open"),
      }),
    );
  }

  return parts.join(" \u00b7 ");
}
