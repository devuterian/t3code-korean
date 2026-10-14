import type { AndroidPermissionsOnboardingPreferences } from "../../persistence/mobile-preferences";

/**
 * Permissions the Android app actually uses. Microphone is absent on purpose:
 * voice input is iOS-only (on-device transcription), and the Android build
 * does not declare RECORD_AUDIO. Photos go through the system photo picker,
 * which needs no permission. Nothing runs in the background, so battery
 * optimization stays untouched.
 */
export type AndroidPermissionId = "notifications" | "camera" | "installPackages";

export const ANDROID_PERMISSION_IDS: ReadonlyArray<AndroidPermissionId> = [
  "notifications",
  "camera",
  "installPackages",
];

/**
 * First run shows the screen. Afterwards it comes back once per app version,
 * and only when something granted at the last visit has since been revoked.
 */
export function shouldShowPermissionOnboarding(
  stored: AndroidPermissionsOnboardingPreferences | undefined,
  currentVersion: string,
  grantedNow: ReadonlySet<AndroidPermissionId>,
): boolean {
  if (!stored) return true;
  if (stored.seenVersion === currentVersion) return false;
  return stored.granted.some((id) => !grantedNow.has(id as AndroidPermissionId));
}
