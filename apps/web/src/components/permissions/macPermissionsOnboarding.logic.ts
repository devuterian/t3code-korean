import type {
  MacPermissionId,
  MacPermissionsOnboarding,
  MacPermissionStatuses,
} from "@t3tools/contracts";

/** Onboarding order: the cheap system prompts first, drag-to-list panes last. */
export const MAC_PERMISSION_ORDER: readonly MacPermissionId[] = [
  "notifications",
  "microphone",
  "camera",
  "screen-recording",
  "accessibility",
  "full-disk-access",
];

export function grantedPermissions(statuses: MacPermissionStatuses): MacPermissionId[] {
  return MAC_PERMISSION_ORDER.filter((id) => statuses[id] === "granted");
}

/**
 * Why the onboarding should open by itself, if at all: never finished, or a
 * permission it last saw granted is gone. A loss reopens it once per app
 * version so a deliberate revoke does not nag on every launch.
 */
export function macPermissionsAutoOpenReason(input: {
  readonly onboarding: MacPermissionsOnboarding | null;
  readonly statuses: MacPermissionStatuses;
  readonly appVersion: string;
}): "first-run" | "lost" | null {
  const { onboarding, statuses, appVersion } = input;
  if (onboarding === null) return "first-run";
  if (onboarding.lostPromptVersion === appVersion) return null;
  const lost = onboarding.granted.some(
    (id) => statuses[id] !== "granted" && statuses[id] !== "unknown",
  );
  return lost ? "lost" : null;
}

/** The record to persist when the dialog closes. */
export function completedMacPermissionsOnboarding(input: {
  readonly previous: MacPermissionsOnboarding | null;
  readonly statuses: MacPermissionStatuses;
  readonly appVersion: string;
  readonly reason: "first-run" | "lost" | "manual";
  readonly now: string;
}): MacPermissionsOnboarding {
  const { previous } = input;
  return {
    completedAt: previous?.completedAt ?? input.now,
    granted: grantedPermissions(input.statuses),
    lostPromptVersion:
      input.reason === "lost" ? input.appVersion : (previous?.lostPromptVersion ?? null),
  };
}

/** Next permission "Allow all" should ask for, skipping granted and already-asked ones. */
export function nextMacPermissionToRequest(
  statuses: MacPermissionStatuses,
  asked: ReadonlySet<MacPermissionId>,
): MacPermissionId | null {
  return MAC_PERMISSION_ORDER.find((id) => statuses[id] !== "granted" && !asked.has(id)) ?? null;
}
