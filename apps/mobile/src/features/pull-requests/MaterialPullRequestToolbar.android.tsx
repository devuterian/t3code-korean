import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";
import { BackHandler, Keyboard, View, type TextInputInstance } from "react-native";
import { AndroidHeaderIconButton, AndroidScreenHeader } from "../../components/AndroidScreenHeader";
import { CompactBrandTitle } from "../../components/CompactBrandTitle";
import { MaterialSearchField } from "../../components/MaterialSearchField";
import { useTranslate } from "../../i18n/translate";
import { WorkspaceConnectionTitle } from "../home/WorkspaceConnectionTitle";
import { useHardwareKeyboardCommand } from "../keyboard/hardwareKeyboardCommands";
import { useWorkspaceTabs } from "../workspace/WorkspaceTabsContext";

/** PR search shares the thread list's native Android header placement. */
export function MaterialPullRequestToolbar(props: { readonly onRequestVisibility?: () => void }) {
  const navigation = useNavigation();
  const t = useTranslate();
  const workspace = useWorkspaceTabs()!;
  const { dispatch, getScrollOffset, recordScrollOffset, isTabActive } = workspace;
  const homeFocused = useNavigationState((state) => state.routes[state.index]?.name === "Home");
  const listFocused = homeFocused && workspace.state.selectedTab === "pullRequests";
  const { onRequestVisibility } = props;
  const tab = workspace.state.tabs.pullRequests;
  const input = useRef<TextInputInstance>(null);
  const searching = tab.searchMode !== "resting";
  const openSearch = useCallback(() => {
    onRequestVisibility?.();
    dispatch({
      type: "scroll",
      tab: "pullRequests",
      offset: getScrollOffset("pullRequests"),
    });
    dispatch({ type: "search", tab: "pullRequests" });
    input.current?.focus();
    return true;
  }, [dispatch, getScrollOffset, onRequestVisibility]);
  useHardwareKeyboardCommand("focusSearch", openSearch);
  const closeSearch = useCallback(() => {
    Keyboard.dismiss();
    recordScrollOffset("pullRequests", tab.searchEntryOffset);
    dispatch({ type: "cancel", tab: "pullRequests" });
  }, [dispatch, recordScrollOffset, tab.searchEntryOffset]);
  useEffect(() => {
    if (!searching || !listFocused) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      // Frozen Home screens can keep effects alive after a detail route opens.
      const state = navigation.getState();
      if (!state || state.routes[state.index]?.name !== "Home" || !isTabActive("pullRequests"))
        return false;
      if (Keyboard.isVisible()) Keyboard.dismiss();
      else closeSearch();
      return true;
    });
    return () => subscription.remove();
  }, [searching, closeSearch, listFocused, navigation, isTabActive]);
  return (
    <AndroidScreenHeader
      title={t("Pull requests")}
      titleContent={
        searching ? (
          <MaterialSearchField
            inputRef={input}
            accessibilityLabel={t("Search pull requests")}
            clearAccessibilityLabel={t("Clear search")}
            placeholder={t("Search pull requests")}
            value={tab.query}
            onChangeText={(query) => dispatch({ type: "query", tab: "pullRequests", query })}
          />
        ) : (
          <View className="min-w-0 flex-1 pl-3">
            <WorkspaceConnectionTitle
              grow
              brand={
                <CompactBrandTitle
                  allowFontScaling={false}
                  accessibilityLabel={`T3 Code, ${t("Pull requests")}`}
                />
              }
              onPress={() =>
                navigation.navigate("SettingsSheet", {
                  screen: "SettingsContent",
                  params: { screen: "SettingsEnvironments" },
                })
              }
            />
          </View>
        )
      }
      leading={
        searching ? (
          <AndroidHeaderIconButton
            accessibilityLabel={t("Close search")}
            icon="arrow.left"
            onPress={closeSearch}
          />
        ) : undefined
      }
      actions={
        searching
          ? []
          : [
              {
                accessibilityLabel: t("Search pull requests"),
                icon: "magnifyingglass",
                onPress: openSearch,
              },
              {
                accessibilityLabel: t("Open settings"),
                icon: "gearshape",
                onPress: () =>
                  navigation.navigate("SettingsSheet", {
                    screen: "SettingsContent",
                    params: { screen: "Settings" },
                  }),
              },
            ]
      }
    />
  );
}
