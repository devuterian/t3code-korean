import { useAtomSet, useAtomValue } from "@effect/atom-react";
import * as Effect from "effect/Effect";
import { AsyncResult } from "effect/reactivity";
import { Camera } from "expo-camera";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AppState, Linking, Modal, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText as Text } from "../../components/AppText";
import { SymbolView } from "../../components/AppSymbol";
import { MaterialButton } from "../../components/MaterialButton";
import { useTranslate } from "../../i18n/translate";
import { AppInstaller } from "../../native/appInstaller";
import { mobilePreferencesAtom, updateMobilePreferencesAtom } from "../../state/preferences";
import { requestAgentNotificationPermission } from "../agent-awareness/notificationPermissions";
import {
  ANDROID_PERMISSION_IDS,
  shouldShowPermissionOnboarding,
  type AndroidPermissionId,
} from "./permissionOnboarding";

type PermissionStatus = "granted" | "askable" | "blocked";
type Statuses = Readonly<Record<AndroidPermissionId, PermissionStatus>>;

let openRequested = false;
const openListeners = new Set<() => void>();

/** Settings entry point: shows the screen again regardless of stored state. */
export function openAndroidPermissionsOnboarding() {
  openRequested = true;
  for (const listener of openListeners) listener();
}

function subscribeOpen(listener: () => void) {
  openListeners.add(listener);
  return () => {
    openListeners.delete(listener);
  };
}

export const isAndroidPermissionsOnboardingAvailable = Platform.OS === "android";

function currentAppVersion(): string {
  return AppInstaller?.getAppVersion().versionName ?? Constants.expoConfig?.version ?? "0.0.0";
}

async function readStatuses(): Promise<Statuses> {
  const [notifications, camera] = await Promise.all([
    Notifications.getPermissionsAsync(),
    Camera.getCameraPermissionsAsync(),
  ]);
  const toStatus = (permission: { granted: boolean; canAskAgain: boolean }): PermissionStatus =>
    permission.granted ? "granted" : permission.canAskAgain ? "askable" : "blocked";
  return {
    notifications: toStatus(notifications),
    camera: toStatus(camera),
    // Only the system setting can grant this one; it is never "blocked".
    installPackages: AppInstaller?.canRequestPackageInstalls() === false ? "askable" : "granted",
  };
}

async function requestPermission(id: AndroidPermissionId, status: PermissionStatus) {
  if (status === "granted") return;
  if (id === "installPackages") {
    AppInstaller?.openInstallPermissionSettings();
    return;
  }
  if (status === "blocked") {
    await Linking.openSettings();
    return;
  }
  if (id === "notifications") {
    await Effect.runPromise(Effect.ignore(requestAgentNotificationPermission));
  } else {
    await Camera.requestCameraPermissionsAsync();
  }
}

const grantedIds = (statuses: Statuses) =>
  ANDROID_PERMISSION_IDS.filter((id) => statuses[id] === "granted");

/**
 * Android first-run screen that asks for every permission the app uses in one
 * place. Mounted once at the app root.
 */
export function AndroidPermissionsOnboarding() {
  if (!isAndroidPermissionsOnboardingAvailable) return null;
  return <AndroidPermissionsOnboardingHost />;
}

function AndroidPermissionsOnboardingHost() {
  const preferences = useAtomValue(mobilePreferencesAtom);
  const savePreferences = useAtomSet(updateMobilePreferencesAtom);
  const reopen = useSyncExternalStore(subscribeOpen, () => openRequested);
  const [visible, setVisible] = useState(false);
  const [statuses, setStatuses] = useState<Statuses | null>(null);
  const [decided, setDecided] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const next = await readStatuses();
      setStatuses(next);
      return next;
    } catch {
      return null;
    }
  }, []);

  // Decide once per launch, after stored preferences load.
  useEffect(() => {
    if (decided || !AsyncResult.isSuccess(preferences)) return;
    setDecided(true);
    const stored = preferences.value.androidPermissionsOnboarding;
    void refresh().then((next) => {
      if (!next) return;
      if (shouldShowPermissionOnboarding(stored, currentAppVersion(), new Set(grantedIds(next)))) {
        setVisible(true);
      }
    });
  }, [decided, preferences, refresh]);

  useEffect(() => {
    if (!reopen) return;
    openRequested = false;
    void refresh().then(() => setVisible(true));
  }, [reopen, refresh]);

  // Grants made in system settings land while the app is in the background.
  useEffect(() => {
    if (!visible) return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    return () => subscription.remove();
  }, [refresh, visible]);

  const close = useCallback(() => {
    setVisible(false);
    void refresh().then((latest) => {
      savePreferences({
        androidPermissionsOnboarding: {
          seenVersion: currentAppVersion(),
          granted: latest ? grantedIds(latest) : [],
        },
      });
    });
  }, [refresh, savePreferences]);

  if (!visible || !statuses) return null;
  return (
    <Modal
      animationType="fade"
      navigationBarTranslucent
      onRequestClose={close}
      statusBarTranslucent
      visible
    >
      <PermissionsScreen statuses={statuses} onClose={close} onRefresh={refresh} />
    </Modal>
  );
}

const ROWS: ReadonlyArray<{
  readonly id: AndroidPermissionId;
  readonly icon: ComponentProps<typeof SymbolView>["name"];
  readonly title: string;
  readonly reason: string;
}> = [
  {
    id: "notifications",
    icon: "bell.badge",
    title: "Notifications",
    reason: "Get a heads-up when an agent finishes or needs your answer.",
  },
  {
    id: "camera",
    icon: "qrcode.viewfinder",
    title: "Camera",
    reason: "Scan the pairing QR code to connect to a computer.",
  },
  {
    id: "installPackages",
    icon: "arrow.down.circle",
    title: "Install updates",
    reason: "Install new versions of this app from GitHub without a computer.",
  },
];

function PermissionsScreen(props: {
  readonly statuses: Statuses;
  readonly onClose: () => void;
  readonly onRefresh: () => Promise<Statuses | null>;
}) {
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const allGranted = ANDROID_PERMISSION_IDS.every((id) => props.statuses[id] === "granted");

  const request = async (id: AndroidPermissionId) => {
    setBusy(true);
    try {
      await requestPermission(id, props.statuses[id]);
      await props.onRefresh();
    } finally {
      setBusy(false);
    }
  };

  // In-app dialogs first; the install setting leaves the app, so it goes last.
  // Permissions the user blocked need their own tap into system settings.
  const requestAll = async () => {
    setBusy(true);
    try {
      let current: Statuses | null = props.statuses;
      for (const id of ANDROID_PERMISSION_IDS) {
        if (!current || current[id] !== "askable") continue;
        await requestPermission(id, current[id]);
        if (id !== "installPackages") current = await props.onRefresh();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <View
      className="flex-1 bg-sheet"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <ScrollView className="flex-1" contentContainerClassName="gap-6 px-5 pb-6 pt-10">
        <View className="gap-2">
          <Text className="text-3xl font-t3-bold text-foreground">{t("Set up permissions")}</Text>
          <Text className="text-base text-foreground-muted">
            {t("T3 Code asks only for what it uses. You can change these any time in Settings.")}
          </Text>
        </View>
        <View className="overflow-hidden rounded-3xl bg-grouped-card">
          {ROWS.map((row, index) => {
            const status = props.statuses[row.id];
            return (
              <View
                key={row.id}
                className={
                  index > 0
                    ? "flex-row items-center gap-4 border-t border-border px-4 py-4"
                    : "flex-row items-center gap-4 px-4 py-4"
                }
              >
                <SymbolView
                  name={row.icon}
                  size={24}
                  tintColorClassName="accent-icon"
                  type="monochrome"
                  weight="regular"
                />
                <View className="min-w-0 flex-1 gap-1">
                  <Text className="text-base text-foreground">{t(row.title)}</Text>
                  <Text className="text-sm text-foreground-muted">{t(row.reason)}</Text>
                </View>
                {status === "granted" ? (
                  <View className="flex-row items-center gap-1">
                    <SymbolView
                      name="checkmark.circle"
                      size={18}
                      tintColorClassName="accent-icon"
                    />
                    <Text className="text-sm text-foreground-muted">{t("Allowed")}</Text>
                  </View>
                ) : (
                  <MaterialButton
                    disabled={busy}
                    label={status === "blocked" ? t("Open settings") : t("Allow")}
                    onPress={() => void request(row.id)}
                  />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View className="flex-row justify-end gap-2 px-5 pb-4 pt-2">
        {allGranted ? (
          <MaterialButton label={t("Done")} tone="primary" onPress={props.onClose} />
        ) : (
          <>
            <MaterialButton label={t("Later")} tone="text" onPress={props.onClose} />
            <MaterialButton
              label={t("Allow all")}
              loading={busy}
              tone="primary"
              onPress={() => void requestAll()}
            />
          </>
        )}
      </View>
    </View>
  );
}
