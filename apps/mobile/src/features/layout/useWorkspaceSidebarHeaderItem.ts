import { useMemo } from "react";
import { useTranslate } from "../../i18n/translate";
import { useNativeWorkspaceColumnsSupported } from "../../native/NativeWorkspaceColumns";
import { useAdaptiveWorkspaceLayout } from "./AdaptiveWorkspaceLayout";
import { withNativeGlassHeaderItem } from "./native-glass-header-items";

export function useWorkspaceSidebarHeaderItem() {
  const usesNativeWorkspaceColumns = useNativeWorkspaceColumnsSupported();
  const { panes, togglePrimarySidebar } = useAdaptiveWorkspaceLayout();
  const t = useTranslate();
  return useMemo(
    () =>
      withNativeGlassHeaderItem({
        axisBehavior: usesNativeWorkspaceColumns ? "horizontalOnly" : undefined,
        accessibilityLabel: panes.primarySidebarVisible
          ? t("Maximize content")
          : t("Show thread sidebar"),
        icon: {
          name: panes.primarySidebarVisible ? "arrow.up.left.and.arrow.down.right" : "sidebar.left",
          type: "sfSymbol" as const,
        },
        identifier: "thread-left-sidebar",
        label: panes.primarySidebarVisible ? t("Maximize content") : t("Show thread sidebar"),
        onPress: togglePrimarySidebar,
        type: "button" as const,
      }),
    [panes.primarySidebarVisible, t, togglePrimarySidebar, usesNativeWorkspaceColumns],
  );
}
