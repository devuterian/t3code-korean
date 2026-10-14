// @effect-diagnostics nodeBuiltinImport:off -- Full Disk Access is only observable by touching a TCC-protected file.
import * as NodeFS from "node:fs";
import * as NodeOS from "node:os";
import * as NodePath from "node:path";
import type { MacPermissionStatus, MacPermissionStatuses } from "@t3tools/contracts";
import * as Electron from "electron";

/** Fork-only: System Settings panes for permissions without a drag list. */
export const MAC_MEDIA_SETTINGS_URLS = {
  microphone: "x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone",
  camera: "x-apple.systempreferences:com.apple.preference.security?Privacy_Camera",
} as const;

/** Opens the app's own Notifications page when the bundle id is readable. */
export function macNotificationSettingsUrl(bundle: string | undefined): string {
  const base = "x-apple.systempreferences:com.apple.Notifications-Settings.extension";
  let bundleId: string | undefined;
  try {
    if (bundle) {
      const plist = NodeFS.readFileSync(NodePath.join(bundle, "Contents/Info.plist"), "utf8");
      bundleId = /<key>CFBundleIdentifier<\/key>\s*<string>([^<]+)<\/string>/.exec(plist)?.[1];
    }
  } catch {
    // Fall back to the Notifications list.
  }
  return bundleId ? `${base}?id=${encodeURIComponent(bundleId)}` : base;
}

export function mediaStatus(
  status: ReturnType<typeof Electron.systemPreferences.getMediaAccessStatus>,
): MacPermissionStatus {
  if (status === "restricted") return "denied";
  return status;
}

/** Errors that mean TCC hid a file from us, as opposed to it not existing. */
const isPermissionError = (error: unknown) =>
  error instanceof Error && "code" in error && (error.code === "EPERM" || error.code === "EACCES");

/**
 * Full Disk Access has no query API. The user's TCC database and Safari's data
 * exist on every Mac and open only with Full Disk Access, so try those.
 */
export function probeFullDiskAccess(home = NodeOS.homedir()): MacPermissionStatus {
  const probes = [
    () =>
      NodeFS.closeSync(
        NodeFS.openSync(
          NodePath.join(home, "Library/Application Support/com.apple.TCC/TCC.db"),
          "r",
        ),
      ),
    () => NodeFS.readdirSync(NodePath.join(home, "Library/Safari")),
  ];
  let denied = false;
  for (const probe of probes) {
    try {
      probe();
      return "granted";
    } catch (error) {
      if (isPermissionError(error)) denied = true;
    }
  }
  return denied ? "denied" : "unknown";
}

/** Notifications stay `unknown`: macOS keeps that state from other processes. */
export function readMacPermissionStatuses(): MacPermissionStatuses {
  const prefs = Electron.systemPreferences;
  return {
    notifications: "unknown",
    "screen-recording": mediaStatus(prefs.getMediaAccessStatus("screen")),
    accessibility: prefs.isTrustedAccessibilityClient(false) ? "granted" : "not-determined",
    "full-disk-access": probeFullDiskAccess(),
    microphone: mediaStatus(prefs.getMediaAccessStatus("microphone")),
    camera: mediaStatus(prefs.getMediaAccessStatus("camera")),
  };
}
