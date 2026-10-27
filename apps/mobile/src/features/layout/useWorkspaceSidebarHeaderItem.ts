import { useMemo } from "react";
import { useTranslate } from "../../i18n/translate";
import { useNativeWorkspaceColumnsSupported } from "../../native/NativeWorkspaceColumns";
import { useAdaptiveWorkspaceLayout } from "./AdaptiveWorkspaceLayout";
import { withNativeGlassHeaderItem } from "./native-glass-header-items";

export function useWorkspaceSidebarHeaderItem() {
  const usesNativeWorkspaceColumns = useNativeWorkspaceColumnsSupported();
  const t = useTranslate();
  const { layout, panes, togglePrimarySidebar } = useAdaptiveWorkspaceLayout();
  const label = panes.primarySidebarVisible
    ? layout.primarySidebarOverlaysContent
      ? t("Hide thread sidebar")
      : t("Maximize content")
    : t("Show thread sidebar");
  return useMemo(
    () =>
      withNativeGlassHeaderItem({
        axisBehavior: usesNativeWorkspaceColumns ? "horizontalOnly" : undefined,
        accessibilityLabel: label,
        icon: {
          name:
            panes.primarySidebarVisible && !layout.primarySidebarOverlaysContent
              ? "arrow.up.left.and.arrow.down.right"
              : "sidebar.left",
          type: "sfSymbol" as const,
        },
        identifier: "thread-left-sidebar",
        label,
        onPress: togglePrimarySidebar,
        type: "button" as const,
      }),
    [
      label,
      layout.primarySidebarOverlaysContent,
      panes.primarySidebarVisible,
      togglePrimarySidebar,
      usesNativeWorkspaceColumns,
    ],
  );
}
