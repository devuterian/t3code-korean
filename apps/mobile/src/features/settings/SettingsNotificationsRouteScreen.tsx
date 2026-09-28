import { ScreenScrollView as ScrollView } from "../../components/ScreenScrollView";
import { useAuth } from "@clerk/expo";
import { useAtomSet, useAtomValue } from "@effect/atom-react";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import * as Effect from "effect/Effect";
import { AsyncResult } from "effect/unstable/reactivity";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Alert, AppState, Linking, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText as Text } from "../../components/AppText";
import {
  isAtomCommandInterrupted,
  reportAtomCommandResult,
  settleAsyncResult,
  settlePromise,
  squashAtomCommandFailure,
} from "@t3tools/client-runtime/state/runtime";
import { supportsAgentAwarenessPush } from "../agent-awareness/capabilities";
import {
  openAndroidLiveUpdateSettings,
  supportsAndroidLiveUpdateSettings,
} from "../agent-awareness/androidNotifications";
import { setLiveActivityUpdatesEnabled } from "../agent-awareness/liveActivityPreferences";
import { requestAgentNotificationPermission } from "../agent-awareness/notificationPermissions";
import {
  getAgentAwarenessRegistrationStatus,
  refreshAgentAwarenessRegistration,
  subscribeAgentAwarenessRegistrationStatus,
} from "../agent-awareness/remoteRegistration";
import { refreshManagedRelayEnvironments } from "../cloud/managedRelayState";
import { hasCloudPublicConfig, resolveRelayClerkTokenOptions } from "../cloud/publicConfig";
import { runtime } from "../../lib/runtime";
import { mobilePreferencesAtom, updateMobilePreferencesAtom } from "../../state/preferences";
import { useSavedRemoteConnections } from "../../state/use-remote-environment-registry";
import { SettingsRow } from "./components/SettingsRow";
import { SettingsSection } from "./components/SettingsSection";
import { SettingsSwitchRow } from "./components/SettingsSwitchRow";
import { SettingsScreen } from "./components/SettingsScreen";
import { resolveAgentAwarenessPlatformPresentation } from "./SettingsRouteScreen.logic";
import { translate, useTranslate } from "../../i18n/translate";

type NotificationStatus = "checking" | "enabled" | "disabled" | "unsupported";
type LiveActivityStatus = "checking" | "enabled" | "disabled" | "signed-out" | "linking";

// Reflects whether the relay actually accepted this device's registration.
// The notification and Live Activity switches are gated on this so they can
// never read as enabled when the device cannot receive anything (e.g. the
// registration request timed out).
function useDeviceRegistered(): boolean {
  const status = useSyncExternalStore(
    subscribeAgentAwarenessRegistrationStatus,
    getAgentAwarenessRegistrationStatus,
    () => "unknown" as const,
  );
  return status === "registered";
}

export function SettingsNotificationsRouteScreen() {
  const t = useTranslate();
  if (!hasCloudPublicConfig()) {
    return (
      <SettingsScreen title={t("Notifications")}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerClassName="px-5 pt-4"
        >
          <Text className="text-base text-foreground-muted">
            {t("Notifications require T3 Connect in this app build.")}
          </Text>
        </ScrollView>
      </SettingsScreen>
    );
  }

  return <ConfiguredSettingsNotificationsRouteScreen />;
}

function ConfiguredSettingsNotificationsRouteScreen() {
  const t = useTranslate();
  const preferencesResult = useAtomValue(mobilePreferencesAtom);
  const savePreferences = useAtomSet(updateMobilePreferencesAtom);
  const agentAwarenessPushAvailable = supportsAgentAwarenessPush();
  const agentAwarenessPlatform = resolveAgentAwarenessPlatformPresentation(Platform.OS);
  const agentAwarenessSubtitle =
    Platform.OS === "android" && !agentAwarenessPushAvailable
      ? t("Install a newer app build to enable notifications")
      : agentAwarenessPlatform.subtitle === undefined
        ? undefined
        : t(agentAwarenessPlatform.subtitle);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { getToken, isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const { savedConnectionsById } = useSavedRemoteConnections();
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatus>("checking");
  const [liveActivityStatus, setLiveActivityStatus] = useState<LiveActivityStatus>("checking");
  const liveActivityWriteInFlight = useRef(false);
  const deviceRegistered = useDeviceRegistered();
  const liveActivitiesPreferenceEnabled = AsyncResult.isSuccess(preferencesResult)
    ? preferencesResult.value.liveActivitiesEnabled !== false
    : true;
  const canClearLiveActivitiesPreference =
    AsyncResult.isSuccess(preferencesResult) &&
    preferencesResult.value.liveActivitiesEnabled !== false;

  const connections = useMemo(() => Object.values(savedConnectionsById), [savedConnectionsById]);
  const environmentCount = connections.length;

  const refreshNotifications = useCallback(async () => {
    if (Platform.OS !== "ios" && Platform.OS !== "android") {
      setNotificationStatus("unsupported");
      return;
    }
    const result = await settlePromise(() => Notifications.getPermissionsAsync());
    if (result._tag === "Failure") {
      reportAtomCommandResult(result, { label: "notification permission refresh" });
      setNotificationStatus("disabled");
      return;
    }
    setNotificationStatus(result.value.granted ? "enabled" : "disabled");
  }, []);

  useEffect(() => {
    void refreshNotifications();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void refreshNotifications();
    });
    return () => subscription.remove();
  }, [refreshNotifications]);

  useEffect(() => {
    if (!isLoaded) {
      setLiveActivityStatus("checking");
      return;
    }
    if (!isSignedIn) {
      setLiveActivityStatus("signed-out");
      return;
    }
    if (!AsyncResult.isSuccess(preferencesResult)) {
      if (AsyncResult.isFailure(preferencesResult)) {
        reportAtomCommandResult(preferencesResult, { label: "live activity preference load" });
        setLiveActivityStatus("enabled");
      } else {
        setLiveActivityStatus("checking");
      }
      return;
    }
    setLiveActivityStatus(
      preferencesResult.value.liveActivitiesEnabled === false ? "disabled" : "enabled",
    );
  }, [isLoaded, isSignedIn, preferencesResult]);

  const requestNotifications = useCallback(async () => {
    const result = await settleAsyncResult(() =>
      runtime.runPromiseExit(
        requestAgentNotificationPermission.pipe(
          Effect.tap((permission) =>
            permission.type === "granted" ? refreshAgentAwarenessRegistration() : Effect.void,
          ),
        ),
      ),
    );
    if (result._tag === "Failure") {
      if (!isAtomCommandInterrupted(result)) {
        const error = squashAtomCommandFailure(result);
        Alert.alert(
          translate("Notifications unavailable"),
          error instanceof Error
            ? error.message
            : translate("Could not request notification permission."),
        );
      }
      return;
    }
    if (result.value.type === "granted") {
      setNotificationStatus("enabled");
      // Permission alone is not enough: the switch stays off until the relay
      // registration succeeds, so tell the user the truth about which happened.
      if (getAgentAwarenessRegistrationStatus() === "registered") {
        Alert.alert(
          translate("Notifications enabled"),
          translate("Agent notifications are enabled for this device."),
        );
      } else {
        Alert.alert(
          translate("Couldn't finish enabling notifications"),
          translate(
            "Notification access was granted, but this device could not be registered with T3 Connect. Notifications will start once registration succeeds.",
          ),
        );
      }
      return;
    }
    if (result.value.type === "unsupported") {
      setNotificationStatus("unsupported");
      Alert.alert(
        translate("Notifications unavailable"),
        translate("Agent notifications are unavailable on this platform."),
      );
      return;
    }
    setNotificationStatus("disabled");
    if (result.value.canAskAgain) {
      Alert.alert(
        translate("Notifications disabled"),
        translate("Notifications were not enabled."),
      );
      return;
    }
    Alert.alert(
      translate("Notifications disabled"),
      translate("Notifications were denied for this app. Open Settings to enable them."),
      [
        { text: translate("Cancel"), style: "cancel" },
        { text: translate("Open Settings"), onPress: () => void Linking.openSettings() },
      ],
    );
  }, []);

  const promptSignIn = useCallback(() => {
    Alert.alert(
      translate("Sign in to T3 Connect"),
      translate(
        "Live Activity updates require T3 Connect so relay can deliver updates to this device.",
      ),
      [
        { text: translate("Cancel"), style: "cancel" },
        {
          text: translate("Continue"),
          onPress: () => navigation.navigate("SettingsSheet", { screen: "SettingsAuth" }),
        },
      ],
    );
  }, [navigation]);

  const linkEnvironments = useCallback(async () => {
    if (!isSignedIn) {
      promptSignIn();
      return;
    }

    setLiveActivityStatus("linking");
    if (Platform.OS === "android") {
      const permission = await settleAsyncResult(() =>
        runtime.runPromiseExit(requestAgentNotificationPermission),
      );
      if (permission._tag === "Failure") {
        setLiveActivityStatus("disabled");
        const error = squashAtomCommandFailure(permission);
        Alert.alert(
          translate("Ongoing activity unavailable"),
          error instanceof Error
            ? error.message
            : translate("Could not enable agent notifications."),
        );
        return;
      }
      if (permission.value.type !== "granted") {
        setLiveActivityStatus("disabled");
        Alert.alert(
          translate("Notification permission needed"),
          translate("Enable notifications in system Settings to show ongoing agent activity."),
          [
            { text: translate("Cancel"), style: "cancel" },
            { text: translate("Open Settings"), onPress: () => void Linking.openSettings() },
          ],
        );
        return;
      }
      setNotificationStatus("enabled");
    }
    const tokenResult = await settlePromise(() => getToken(resolveRelayClerkTokenOptions()));
    if (tokenResult._tag === "Failure") {
      setLiveActivityStatus("disabled");
      const error = squashAtomCommandFailure(tokenResult);
      Alert.alert(
        Platform.OS === "android"
          ? translate("Ongoing activity unavailable")
          : translate("Live Activities unavailable"),
        error instanceof Error
          ? error.message
          : translate("Could not enable agent activity updates."),
      );
      return;
    }
    if (!tokenResult.value) {
      promptSignIn();
      setLiveActivityStatus("signed-out");
      return;
    }

    const updateResult = await settleAsyncResult(() =>
      runtime.runPromiseExit(
        setLiveActivityUpdatesEnabled({
          enabled: true,
          previousEnabled: liveActivitiesPreferenceEnabled,
          clerkToken: tokenResult.value,
          connections,
        }),
      ),
    );
    if (updateResult._tag === "Failure") {
      setLiveActivityStatus("disabled");
      if (!isAtomCommandInterrupted(updateResult)) {
        const error = squashAtomCommandFailure(updateResult);
        Alert.alert(
          Platform.OS === "android"
            ? translate("Ongoing activity unavailable")
            : translate("Live Activities unavailable"),
          error instanceof Error
            ? error.message
            : translate("Could not enable agent activity updates."),
        );
      }
      return;
    }

    savePreferences({ liveActivitiesEnabled: true });
    refreshManagedRelayEnvironments();
    setLiveActivityStatus("enabled");
    // The environment link can succeed while this device's own registration
    // (the push-to-start token the relay needs) has not — don't claim Live
    // Activities are live until the device is actually registered.
    if (getAgentAwarenessRegistrationStatus() === "registered") {
      Alert.alert(
        Platform.OS === "android"
          ? translate("Ongoing activity enabled")
          : translate("Live Activities enabled"),
        environmentCount > 0
          ? translate(
              environmentCount === 1
                ? "{count} environment linked for agent activity updates."
                : "{count} environments linked for agent activity updates.",
              { count: environmentCount },
            )
          : translate(
              "Agent activity updates are enabled. Add an environment to start receiving updates.",
            ),
      );
    } else {
      Alert.alert(
        translate("Couldn't finish enabling activity updates"),
        translate(
          "This device could not be registered with T3 Connect, so activity updates won't appear yet. They'll start once registration succeeds.",
        ),
      );
    }
  }, [
    connections,
    environmentCount,
    getToken,
    isSignedIn,
    liveActivitiesPreferenceEnabled,
    promptSignIn,
    savePreferences,
  ]);

  const handleDeviceNotificationsChange = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        if (!isSignedIn) {
          promptSignIn();
          return;
        }
        void requestNotifications();
        return;
      }

      Alert.alert(
        translate("Disable notifications"),
        translate("Open system Settings to disable notifications for T3 Code."),
        [
          { text: translate("Cancel"), style: "cancel" },
          { text: translate("Open Settings"), onPress: () => void Linking.openSettings() },
        ],
      );
    },
    [isSignedIn, promptSignIn, requestNotifications],
  );

  const handleLiveActivitiesChange = useCallback(
    (enabled: boolean) => {
      if (liveActivityWriteInFlight.current) return;
      if (!enabled) {
        liveActivityWriteInFlight.current = true;
        setLiveActivityStatus("linking");
        void (async () => {
          try {
            let token: string | null = null;
            if (isSignedIn) {
              const tokenResult = await settlePromise(() =>
                getToken(resolveRelayClerkTokenOptions()),
              );
              if (tokenResult._tag === "Failure") {
                setLiveActivityStatus("enabled");
                reportAtomCommandResult(tokenResult, {
                  label: "live activity disable token lookup",
                });
                return;
              }
              token = tokenResult.value;
            }

            const updateResult = await settleAsyncResult(() =>
              runtime.runPromiseExit(
                setLiveActivityUpdatesEnabled({
                  enabled: false,
                  previousEnabled: liveActivitiesPreferenceEnabled,
                  clerkToken: token,
                  connections,
                }),
              ),
            );
            if (updateResult._tag === "Failure") {
              setLiveActivityStatus(isSignedIn ? "enabled" : "signed-out");
              reportAtomCommandResult(updateResult, {
                label: "live activity disable",
              });
              return;
            }
            savePreferences({ liveActivitiesEnabled: false });
            refreshManagedRelayEnvironments();
            setLiveActivityStatus("disabled");
          } finally {
            liveActivityWriteInFlight.current = false;
          }
        })();
        return;
      }

      if (!isSignedIn) {
        promptSignIn();
        return;
      }

      liveActivityWriteInFlight.current = true;
      void linkEnvironments().finally(() => {
        liveActivityWriteInFlight.current = false;
      });
    },
    [
      connections,
      getToken,
      isSignedIn,
      linkEnvironments,
      liveActivitiesPreferenceEnabled,
      promptSignIn,
      savePreferences,
    ],
  );

  return (
    <SettingsScreen title={t("Notifications")}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pt-4"
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 18) + 18,
        }}
      >
        <SettingsSection title={t("Agent activity")}>
          <SettingsSwitchRow
            icon="bell.badge"
            label={t("Device Notifications")}
            disabled={
              !agentAwarenessPlatform.supported ||
              !agentAwarenessPushAvailable ||
              notificationStatus === "checking" ||
              notificationStatus === "unsupported"
            }
            subtitle={agentAwarenessSubtitle}
            // Only reads as on when this device is actually registered with the
            // relay; otherwise notifications cannot be delivered regardless of
            // the local iOS permission.
            value={
              agentAwarenessPushAvailable && notificationStatus === "enabled" && deviceRegistered
            }
            onValueChange={handleDeviceNotificationsChange}
          />
          <SettingsSwitchRow
            disabled={
              !agentAwarenessPlatform.supported ||
              !agentAwarenessPushAvailable ||
              !isLoaded ||
              liveActivityStatus === "checking" ||
              liveActivityStatus === "linking"
            }
            icon="bolt.circle"
            label={
              Platform.OS === "android"
                ? supportsAndroidLiveUpdateSettings()
                  ? t("Agent Live Updates")
                  : t("Ongoing Agent Activity")
                : t("Live Activity Updates")
            }
            subtitle={agentAwarenessSubtitle}
            // Same gate: a saved preference is meaningless until the device
            // registration the relay needs to push updates has succeeded.
            value={
              agentAwarenessPushAvailable &&
              (liveActivityStatus === "enabled" || liveActivityStatus === "linking") &&
              deviceRegistered
            }
            onValueChange={handleLiveActivitiesChange}
          />
          {liveActivityStatus === "signed-out" && canClearLiveActivitiesPreference ? (
            <SettingsRow
              icon="bolt.circle"
              label={t("Turn off Live Activity preference")}
              onPress={() => handleLiveActivitiesChange(false)}
            />
          ) : null}
          {supportsAndroidLiveUpdateSettings() ? (
            <SettingsRow
              icon="bolt.circle"
              label={t("Live Update Settings")}
              onPress={() => {
                void openAndroidLiveUpdateSettings().catch(() => {
                  Alert.alert(
                    t("Couldn't open Settings"),
                    t(
                      "Open Android Settings, select T3 Code, then enable Live Updates in Notifications.",
                    ),
                  );
                });
              }}
            />
          ) : null}
        </SettingsSection>
      </ScrollView>
    </SettingsScreen>
  );
}
