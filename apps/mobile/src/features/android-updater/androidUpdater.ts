import { AsyncResult } from "effect/reactivity";
import { Directory, File, Paths } from "expo-file-system";
import { useSyncExternalStore } from "react";
import { Platform } from "react-native";

import { translate } from "../../i18n/translate";
import { AppInstaller } from "../../native/appInstaller";
import type {
  AndroidUpdatePreferences,
  KoreanAndroidRelease,
} from "../../persistence/mobile-preferences";
import { appAtomRegistry } from "../../state/atom-registry";
import { mobilePreferencesAtom, updateMobilePreferencesAtom } from "../../state/preferences";
import {
  isAutomaticCheckDue,
  isKoreanReleaseDownloadUrl,
  isUpdateAvailable,
  KOREAN_RELEASES_URL,
  pickNewestAndroidRelease,
} from "./koreanRelease";

/**
 * Korean fork self-updater for Android. Checks GitHub releases on launch and
 * when the app returns to the foreground (at most every few hours), downloads
 * the arm64 APK into the cache, and hands it to the system installer.
 */
export type AndroidUpdaterPhase =
  | { readonly type: "idle" }
  | { readonly type: "checking" }
  | { readonly type: "current" }
  | { readonly type: "available"; readonly release: KoreanAndroidRelease }
  | {
      readonly type: "downloading";
      readonly release: KoreanAndroidRelease;
      readonly progress: number;
    }
  | { readonly type: "ready"; readonly release: KoreanAndroidRelease; readonly fileUri: string }
  | {
      readonly type: "error";
      readonly message: string;
      readonly release: KoreanAndroidRelease | null;
    };

interface UpdaterSnapshot {
  readonly phase: AndroidUpdaterPhase;
  /** Hides the banner for this launch without skipping the version. */
  readonly bannerHidden: boolean;
  /** Set when install had to detour through the "install unknown apps" setting. */
  readonly installAfterPermission: boolean;
}

let snapshot: UpdaterSnapshot = {
  phase: { type: "idle" },
  bannerHidden: false,
  installAfterPermission: false,
};
const listeners = new Set<() => void>();
let checkInFlight: Promise<void> | null = null;
let downloadAbort: AbortController | null = null;

function setSnapshot(next: Partial<UpdaterSnapshot>) {
  snapshot = { ...snapshot, ...next };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAndroidUpdater(): UpdaterSnapshot {
  return useSyncExternalStore(subscribe, () => snapshot);
}

export const isAndroidUpdaterAvailable = Platform.OS === "android" && AppInstaller !== null;

export function getRunningVersion(): string | null {
  return AppInstaller?.getAppVersion().versionName ?? null;
}

function readUpdatePreferences(): AndroidUpdatePreferences | null {
  const result = appAtomRegistry.get(mobilePreferencesAtom);
  return AsyncResult.isSuccess(result) ? (result.value.androidUpdate ?? {}) : null;
}

function saveUpdatePreferences(patch: Partial<AndroidUpdatePreferences>) {
  appAtomRegistry.set(updateMobilePreferencesAtom, {
    transform: (current) => ({ androidUpdate: { ...current.androidUpdate, ...patch } }),
  });
}

const updatesDirectory = () => new Directory(Paths.cache, "app-updates");

/** Removes APKs left over from a finished or abandoned update. */
function clearDownloadedUpdates() {
  try {
    const directory = updatesDirectory();
    if (directory.exists) directory.delete();
  } catch {
    // Cache cleanup is best effort; the OS reclaims the cache directory anyway.
  }
}

/**
 * Checks GitHub for a newer release. Automatic checks are throttled and stay
 * silent on failure; a manual check always hits the network and reports.
 */
export function checkForAndroidUpdate(options: { readonly manual: boolean }): Promise<void> {
  if (!isAndroidUpdaterAvailable) return Promise.resolve();
  if (checkInFlight) return checkInFlight;
  const busy = snapshot.phase.type === "downloading" || snapshot.phase.type === "ready";
  if (busy) return Promise.resolve();
  checkInFlight = runCheck(options.manual).finally(() => {
    checkInFlight = null;
  });
  return checkInFlight;
}

async function runCheck(manual: boolean) {
  const stored = readUpdatePreferences();
  const currentVersion = getRunningVersion();
  if (stored === null || currentVersion === null) return;
  const now = Date.now();

  if (!manual && !isAutomaticCheckDue(stored.lastCheckedAt, now)) {
    if (isUpdateAvailable(currentVersion, stored.latest ?? null, stored.skippedVersion)) {
      setSnapshot({ phase: { type: "available", release: stored.latest! } });
    }
    return;
  }

  if (snapshot.phase.type === "idle") clearDownloadedUpdates();
  if (manual) setSnapshot({ phase: { type: "checking" }, bannerHidden: false });

  let latest: KoreanAndroidRelease | null;
  let etag: string | undefined;
  let fresh = false;
  try {
    const response = await fetch(KOREAN_RELEASES_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(stored.etag ? { "If-None-Match": stored.etag } : {}),
      },
    });
    if (response.status === 304) {
      latest = stored.latest ?? null;
      etag = stored.etag;
    } else if (response.ok) {
      latest = pickNewestAndroidRelease(await response.json());
      etag = response.headers.get("etag") ?? undefined;
      fresh = true;
    } else {
      throw new Error(
        response.status === 403 || response.status === 429
          ? translate("GitHub is limiting update checks. Try again in an hour.")
          : translate("GitHub returned an error ({status}).", { status: response.status }),
      );
    }
  } catch (cause) {
    // Record the attempt so a flaky network cannot turn foregrounding into a retry loop.
    saveUpdatePreferences({ lastCheckedAt: now });
    if (manual) {
      setSnapshot({
        phase: {
          type: "error",
          message:
            cause instanceof Error ? cause.message : translate("Could not check for updates."),
          release: null,
        },
      });
    }
    return;
  }

  appAtomRegistry.set(updateMobilePreferencesAtom, {
    transform: (current) => {
      // A fresh listing replaces the cached release, so a pulled one stops being offered.
      const { latest: cachedLatest, ...rest } = current.androidUpdate ?? {};
      const nextLatest = fresh ? latest : cachedLatest;
      return {
        androidUpdate: {
          ...rest,
          lastCheckedAt: now,
          ...(etag ? { etag } : {}),
          ...(nextLatest ? { latest: nextLatest } : {}),
        },
      };
    },
  });
  // A manual check offers even a version the user skipped earlier.
  const skipped = manual ? null : stored.skippedVersion;
  if (isUpdateAvailable(currentVersion, latest, skipped)) {
    setSnapshot({ phase: { type: "available", release: latest }, bannerHidden: false });
  } else if (manual) {
    setSnapshot({ phase: { type: "current" } });
  } else if (snapshot.phase.type === "available") {
    setSnapshot({ phase: { type: "idle" } });
  }
}

/** "Later": stop offering this version until a newer one ships. */
export function skipAndroidUpdate(release: KoreanAndroidRelease) {
  downloadAbort?.abort();
  saveUpdatePreferences({ skippedVersion: release.version });
  clearDownloadedUpdates();
  setSnapshot({ phase: { type: "idle" }, bannerHidden: true, installAfterPermission: false });
}

export function hideAndroidUpdateBanner() {
  setSnapshot({ bannerHidden: true });
}

export async function downloadAndInstallAndroidUpdate(release: KoreanAndroidRelease) {
  if (!AppInstaller || snapshot.phase.type === "downloading") return;
  if (snapshot.phase.type === "ready" && snapshot.phase.release.version === release.version) {
    installDownloadedUpdate();
    return;
  }

  clearDownloadedUpdates();
  const directory = updatesDirectory();
  const abort = new AbortController();
  downloadAbort = abort;
  setSnapshot({ phase: { type: "downloading", release, progress: 0 }, bannerHidden: false });
  let lastPercent = 0;
  try {
    // Releases cached before the URL was pinned are refused here too.
    if (!isKoreanReleaseDownloadUrl(release.apkUrl)) throw new Error(translate("Download failed."));
    directory.create({ intermediates: true, idempotent: true });
    const file = new File(directory, `t3code-ko-${release.version}.apk`);
    await File.downloadFileAsync(release.apkUrl, file, {
      idempotent: true,
      signal: abort.signal,
      onProgress: ({ bytesWritten }) => {
        // Re-render on whole-percent steps only.
        const percent = Math.min(99, Math.floor((bytesWritten / release.apkSize) * 100));
        if (percent === lastPercent) return;
        lastPercent = percent;
        setSnapshot({ phase: { type: "downloading", release, progress: percent / 100 } });
      },
    });
    if (file.size !== release.apkSize) {
      file.delete();
      throw new Error(translate("The download was incomplete. Try again."));
    }
    // GitHub publishes a SHA-256 for newer assets; without one the size check is all we have.
    if (release.apkSha256) {
      const actual = AppInstaller.sha256File ? await AppInstaller.sha256File(file.uri) : null;
      if (actual !== release.apkSha256) {
        file.delete();
        throw new Error(translate("The downloaded update failed verification. Try again."));
      }
    }
    setSnapshot({ phase: { type: "ready", release, fileUri: file.uri } });
    installDownloadedUpdate();
  } catch (cause) {
    if (abort.signal.aborted) return;
    clearDownloadedUpdates();
    setSnapshot({
      phase: {
        type: "error",
        message: cause instanceof Error ? cause.message : translate("Download failed."),
        release,
      },
    });
  } finally {
    if (downloadAbort === abort) downloadAbort = null;
  }
}

/**
 * Opens the system installer for the downloaded APK. Without the "install
 * unknown apps" grant, opens that setting first; `resumeAndroidUpdateInstall`
 * continues when the app comes back to the foreground.
 */
export function installDownloadedUpdate() {
  const phase = snapshot.phase;
  if (!AppInstaller || phase.type !== "ready") return;
  try {
    if (!AppInstaller.canRequestPackageInstalls()) {
      setSnapshot({ installAfterPermission: true });
      AppInstaller.openInstallPermissionSettings();
      return;
    }
    setSnapshot({ installAfterPermission: false });
    AppInstaller.installApk(phase.fileUri);
  } catch (cause) {
    setSnapshot({
      phase: {
        type: "error",
        message:
          cause instanceof Error ? cause.message : translate("Could not open the installer."),
        release: phase.release,
      },
    });
  }
}

export function resumeAndroidUpdateInstall() {
  if (!snapshot.installAfterPermission || !AppInstaller) return;
  if (AppInstaller.canRequestPackageInstalls()) installDownloadedUpdate();
  else setSnapshot({ installAfterPermission: false });
}
