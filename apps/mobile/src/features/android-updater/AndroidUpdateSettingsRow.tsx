import { useAtomValue } from "@effect/atom-react";
import { AsyncResult } from "effect/reactivity";

import { getFormattingLocale, useTranslate } from "../../i18n/translate";
import { mobilePreferencesAtom } from "../../state/preferences";
import { SettingsRow } from "../settings/components/SettingsRow";
import {
  checkForAndroidUpdate,
  downloadAndInstallAndroidUpdate,
  getRunningVersion,
  installDownloadedUpdate,
  isAndroidUpdaterAvailable,
  useAndroidUpdater,
} from "./androidUpdater";

/** Settings > About row: running version, last check, and a manual check. */
export function AndroidUpdateSettingsRow() {
  if (!isAndroidUpdaterAvailable) return null;
  return <AndroidUpdateSettingsRowContent />;
}

function AndroidUpdateSettingsRowContent() {
  const t = useTranslate();
  const preferences = useAtomValue(mobilePreferencesAtom);
  const { phase } = useAndroidUpdater();
  const lastCheckedAt = AsyncResult.isSuccess(preferences)
    ? preferences.value.androidUpdate?.lastCheckedAt
    : undefined;
  const lastChecked =
    lastCheckedAt === undefined
      ? t("Never checked")
      : t("Last checked {time}", {
          time: new Date(lastCheckedAt).toLocaleString(getFormattingLocale(), {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
        });
  const status =
    phase.type === "checking"
      ? t("Checking…")
      : phase.type === "current"
        ? t("You have the latest version")
        : phase.type === "available"
          ? t("Version {version} is available", { version: phase.release.version })
          : phase.type === "downloading"
            ? t("Downloading {version}… {percent}%", {
                version: phase.release.version,
                percent: Math.round(phase.progress * 100),
              })
            : phase.type === "ready"
              ? t("Version {version} is ready to install", { version: phase.release.version })
              : phase.type === "error"
                ? phase.message
                : lastChecked;

  return (
    <SettingsRow
      icon="arrow.down.circle"
      label={t("Check for updates")}
      value={`${t("Current version {version}", { version: getRunningVersion() ?? "?" })} · ${status}`}
      disabled={phase.type === "checking" || phase.type === "downloading"}
      onPress={() => {
        if (phase.type === "available") void downloadAndInstallAndroidUpdate(phase.release);
        else if (phase.type === "ready") installDownloadedUpdate();
        else void checkForAndroidUpdate({ manual: true });
      }}
    />
  );
}
