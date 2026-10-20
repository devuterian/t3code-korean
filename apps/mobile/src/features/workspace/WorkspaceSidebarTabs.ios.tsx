import { View } from "react-native";
import { SegmentedControl } from "../../components/ui/SegmentedControl";
import { useTranslate } from "../../i18n/translate";
import { useWorkspaceTabs } from "./WorkspaceTabsContext";
import type { WorkspaceTab } from "./workspace-tabs-state";
import { useSelectWorkspaceTab } from "./useSelectWorkspaceTab";

export function WorkspaceSidebarTabs() {
  const t = useTranslate();
  const workspace = useWorkspaceTabs()!;
  const selectTab = useSelectWorkspaceTab();
  return (
    <View className="px-4 pb-3 pt-2">
      <SegmentedControl
        role="tab"
        options={[
          { value: "threads", label: t("Threads") },
          { value: "pullRequests", label: t("Pull requests") },
        ]}
        selected={workspace.state.selectedTab}
        onSelect={(tab: WorkspaceTab) => selectTab(tab)}
      />
    </View>
  );
}
