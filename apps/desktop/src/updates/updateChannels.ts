import type { DesktopUpdateChannel } from "@t3tools/contracts";

const NIGHTLY_VERSION_PATTERN = /^[^-+]+-nightly\.\d{8}\.\d+$/;
// They share nightly's branding but are packaged without an update feed (see
// isDesktopPreviewVersion in scripts/build-desktop-artifact.ts), so the channel
// a preview install reports is cosmetic: it never checks for updates and no
// updater feed ever lists a preview release.
const PRERELEASE_VERSION_PATTERN = /^[^-+]+-(?:nightly|preview)\.\d{8}\.\d+$/;

export function isNightlyDesktopVersion(version: string): boolean {
  return PRERELEASE_VERSION_PATTERN.test(version);
}

export function resolveDefaultDesktopUpdateChannel(appVersion: string): DesktopUpdateChannel {
  return NIGHTLY_VERSION_PATTERN.test(appVersion) ? "nightly" : "latest";
}

// Korean fork releases (`0.0.46-ko.6`) are published on devuterian/t3code-korean
// as a mix of stable and prerelease GitHub releases. The updater follows the
// `ko` prerelease identifier across both, downloads in the background, and
// installs on quit, so these builds ignore the upstream latest/nightly split.
const KOREAN_FORK_VERSION_PATTERN = /^[^-+]+-ko\.\d+$/;
export const KOREAN_FORK_UPDATE_CHANNEL = "ko";

export function isKoreanForkDesktopVersion(version: string): boolean {
  return KOREAN_FORK_VERSION_PATTERN.test(version);
}
