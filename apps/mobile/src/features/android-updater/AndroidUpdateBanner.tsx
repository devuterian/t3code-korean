import { useAtomValue } from "@effect/atom-react";
import { AsyncResult } from "effect/reactivity";
import { useEffect, useRef } from "react";
import { AppState, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText as Text } from "../../components/AppText";
import { SymbolView } from "../../components/AppSymbol";
import { MaterialButton } from "../../components/MaterialButton";
import { useTranslate } from "../../i18n/translate";
import { mobilePreferencesAtom } from "../../state/preferences";
import {
  checkForAndroidUpdate,
  downloadAndInstallAndroidUpdate,
  hideAndroidUpdateBanner,
  installDownloadedUpdate,
  isAndroidUpdaterAvailable,
  resumeAndroidUpdateInstall,
  skipAndroidUpdate,
  useAndroidUpdater,
} from "./androidUpdater";

/** Runs the throttled update check on launch and foreground, and shows a small top card. */
export function AndroidUpdateBanner() {
  if (!isAndroidUpdaterAvailable) return null;
  return <AndroidUpdateBannerContent />;
}

function AndroidUpdateBannerContent() {
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const preferencesReady = AsyncResult.isSuccess(useAtomValue(mobilePreferencesAtom));
  const { phase, bannerHidden } = useAndroidUpdater();
  const startedRef = useRef(false);

  useEffect(() => {
    if (!preferencesReady || startedRef.current) return;
    startedRef.current = true;
    void checkForAndroidUpdate({ manual: false });
  }, [preferencesReady]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      resumeAndroidUpdateInstall();
      void checkForAndroidUpdate({ manual: false });
    });
    return () => subscription.remove();
  }, []);

  if (bannerHidden) return null;
  if (
    phase.type !== "available" &&
    phase.type !== "downloading" &&
    phase.type !== "ready" &&
    !(phase.type === "error" && phase.release)
  ) {
    return null;
  }
  const release = phase.release!;

  const title =
    phase.type === "downloading"
      ? t("Downloading {version}… {percent}%", {
          version: release.version,
          percent: Math.round(phase.progress * 100),
        })
      : phase.type === "ready"
        ? t("Version {version} is ready to install", { version: release.version })
        : t("Version {version} is available", { version: release.version });
  const detail =
    phase.type === "error"
      ? phase.message
      : phase.type === "ready"
        ? t("Android will ask you to confirm the update.")
        : phase.type === "available"
          ? t("{size} MB download. Your connections and threads stay as they are.", {
              size: Math.round(release.apkSize / 1_000_000),
            })
          : null;

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 top-0 px-3"
      style={{
        paddingTop: insets.top + 8,
        paddingLeft: insets.left + 12,
        paddingRight: insets.right + 12,
      }}
    >
      <View
        accessibilityLiveRegion="polite"
        className="gap-3 rounded-3xl border border-border bg-card p-4 shadow-md shadow-black/10"
      >
        <View className="flex-row items-start gap-3">
          <SymbolView
            name="arrow.down.circle"
            size={22}
            tintColorClassName="accent-icon"
            type="monochrome"
            weight="regular"
          />
          <View className="min-w-0 flex-1 gap-1">
            <Text className="text-base text-foreground">{title}</Text>
            {detail ? <Text className="text-sm text-foreground-muted">{detail}</Text> : null}
          </View>
          <Pressable
            accessibilityLabel={t("Hide")}
            accessibilityRole="button"
            hitSlop={12}
            onPress={hideAndroidUpdateBanner}
          >
            <SymbolView name="xmark" size={18} tintColorClassName="accent-icon" />
          </Pressable>
        </View>
        {phase.type === "downloading" ? (
          <View className="h-1 overflow-hidden rounded-full bg-subtle-strong">
            <View className="h-1 bg-primary" style={{ width: `${phase.progress * 100}%` }} />
          </View>
        ) : (
          <View className="flex-row justify-end gap-2">
            {phase.type === "available" ? (
              <MaterialButton
                label={t("Later")}
                tone="text"
                onPress={() => skipAndroidUpdate(release)}
              />
            ) : null}
            <MaterialButton
              label={
                phase.type === "ready"
                  ? t("Install")
                  : phase.type === "error"
                    ? t("Try again")
                    : t("Update")
              }
              tone="primary"
              onPress={() =>
                phase.type === "ready"
                  ? installDownloadedUpdate()
                  : void downloadAndInstallAndroidUpdate(release)
              }
            />
          </View>
        )}
      </View>
    </View>
  );
}
