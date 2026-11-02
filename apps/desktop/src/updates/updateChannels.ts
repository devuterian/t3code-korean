// Preview builds share nightly branding but ship without an update feed.
const PRERELEASE_VERSION_PATTERN = /^[^-+]+-(?:nightly|preview)\.\d{8}\.\d+$/;

export function isNightlyDesktopVersion(version: string): boolean {
  return PRERELEASE_VERSION_PATTERN.test(version);
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
