import { useAtomValue } from "@effect/atom-react";
import { AsyncResult } from "effect/reactivity";

import { useGT } from "gt-react-native";

import { useFormattingLocale } from "../../i18n/I18nProvider";
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
  const gt = useGT();
  const locale = useFormattingLocale();
  const preferences = useAtomValue(mobilePreferencesAtom);
  const { phase } = useAndroidUpdater();
  const lastCheckedAt = AsyncResult.isSuccess(preferences)
    ? preferences.value.androidUpdate?.lastCheckedAt
    : undefined;
  const lastChecked =
    lastCheckedAt === undefined
      ? gt("Never checked")
      : gt("Last checked {time}", {
          time: new Date(lastCheckedAt).toLocaleString(locale, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
        });
  const status =
    phase.type === "checking"
      ? gt("Checking…")
      : phase.type === "current"
        ? gt("You have the latest version")
        : phase.type === "available"
          ? gt("Version {version} is available", { version: phase.release.version })
          : phase.type === "downloading"
            ? gt("Downloading {version}… {percent}%", {
                version: phase.release.version,
                percent: Math.round(phase.progress * 100),
              })
            : phase.type === "ready"
              ? gt("Version {version} is ready to install", { version: phase.release.version })
              : phase.type === "error"
                ? phase.message
                : lastChecked;

  return (
    <SettingsRow
      icon="arrow.down.circle"
      label={gt("Check for updates")}
      value={`${gt("Current version {version}", { version: getRunningVersion() ?? "?" })} · ${status}`}
      disabled={phase.type === "checking" || phase.type === "downloading"}
      onPress={() => {
        if (phase.type === "available") void downloadAndInstallAndroidUpdate(phase.release);
        else if (phase.type === "ready") installDownloadedUpdate();
        else void checkForAndroidUpdate({ manual: true });
      }}
    />
  );
}
