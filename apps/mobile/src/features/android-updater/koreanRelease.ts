/**
 * Pure release logic for the Korean fork's Android self-updater. Releases are
 * tagged `v<major>.<minor>.<patch>-ko.<n>` on devuterian/t3code-korean and ship
 * an `*-android-arm64.apk` asset.
 */

import type { KoreanAndroidRelease } from "../../persistence/mobile-preferences";

export const KOREAN_RELEASES_URL =
  "https://api.github.com/repos/devuterian/t3code-korean/releases?per_page=30";

export interface KoreanVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly ko: number;
}

export interface GitHubReleaseAsset {
  readonly name?: unknown;
  readonly size?: unknown;
  readonly browser_download_url?: unknown;
  /** `sha256:<hex>` on assets GitHub has hashed. */
  readonly digest?: unknown;
}

export interface GitHubRelease {
  readonly tag_name?: unknown;
  readonly draft?: unknown;
  readonly html_url?: unknown;
  readonly assets?: unknown;
}

export type { KoreanAndroidRelease };

const VERSION_PATTERN = /^v?(\d+)\.(\d+)\.(\d+)-ko\.(\d+)$/;

export function parseKoreanVersion(value: string): KoreanVersion | null {
  const match = VERSION_PATTERN.exec(value.trim());
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    ko: Number(match[4]),
  };
}

export function formatKoreanVersion(version: KoreanVersion): string {
  return `${version.major}.${version.minor}.${version.patch}-ko.${version.ko}`;
}

export function compareKoreanVersions(a: KoreanVersion, b: KoreanVersion): number {
  return a.major - b.major || a.minor - b.minor || a.patch - b.patch || a.ko - b.ko;
}

export const KOREAN_RELEASE_DOWNLOAD_PREFIX =
  "https://github.com/devuterian/t3code-korean/releases/download/";

/** Only `<tag>/<file>` under the fork's release downloads; no `..` or other hosts. */
export function isKoreanReleaseDownloadUrl(url: string): boolean {
  if (!url.startsWith(KOREAN_RELEASE_DOWNLOAD_PREFIX)) return false;
  const segments = url.slice(KOREAN_RELEASE_DOWNLOAD_PREFIX.length).split("/");
  return (
    segments.length === 2 &&
    segments.every((segment) => /^[A-Za-z0-9._-]+$/.test(segment) && !/^\.+$/.test(segment))
  );
}

/** Lowercase hex from a GitHub asset `digest` such as `sha256:ab12…`, or null. */
export function parseSha256Digest(digest: unknown): string | null {
  if (typeof digest !== "string") return null;
  const match = /^sha256:([0-9a-f]{64})$/i.exec(digest.trim());
  return match ? match[1]!.toLowerCase() : null;
}

function pickArm64Apk(assets: unknown): {
  readonly url: string;
  readonly name: string;
  readonly size: number;
  readonly sha256: string | null;
} | null {
  if (!Array.isArray(assets)) return null;
  for (const asset of assets as ReadonlyArray<GitHubReleaseAsset>) {
    if (
      typeof asset?.name === "string" &&
      asset.name.endsWith("-android-arm64.apk") &&
      typeof asset.browser_download_url === "string" &&
      isKoreanReleaseDownloadUrl(asset.browser_download_url) &&
      typeof asset.size === "number" &&
      asset.size > 0
    ) {
      return {
        url: asset.browser_download_url,
        name: asset.name,
        size: asset.size,
        sha256: parseSha256Digest(asset.digest),
      };
    }
  }
  return null;
}

/**
 * Newest non-draft release (prereleases included) that ships an arm64 APK.
 * Releases without an APK, such as desktop-only ones, are skipped.
 */
export function pickNewestAndroidRelease(releases: unknown): KoreanAndroidRelease | null {
  if (!Array.isArray(releases)) return null;
  let best: { version: KoreanVersion; release: KoreanAndroidRelease } | null = null;
  for (const release of releases as ReadonlyArray<GitHubRelease>) {
    if (release === null || typeof release !== "object" || release.draft === true) continue;
    if (typeof release.tag_name !== "string") continue;
    const version = parseKoreanVersion(release.tag_name);
    if (!version) continue;
    const apk = pickArm64Apk(release.assets);
    if (!apk) continue;
    if (best && compareKoreanVersions(version, best.version) <= 0) continue;
    best = {
      version,
      release: {
        version: formatKoreanVersion(version),
        apkUrl: apk.url,
        apkName: apk.name,
        apkSize: apk.size,
        ...(apk.sha256 ? { apkSha256: apk.sha256 } : {}),
        htmlUrl: typeof release.html_url === "string" ? release.html_url : null,
      },
    };
  }
  return best?.release ?? null;
}

/**
 * Whether `latest` should be offered over the running build. Builds whose
 * version is not a Korean release version (development builds) never update.
 */
export function isUpdateAvailable(
  currentVersion: string,
  latest: KoreanAndroidRelease | null,
  skippedVersion?: string | null,
): latest is KoreanAndroidRelease {
  if (!latest) return false;
  const current = parseKoreanVersion(currentVersion);
  const candidate = parseKoreanVersion(latest.version);
  if (!current || !candidate) return false;
  if (compareKoreanVersions(candidate, current) <= 0) return false;
  return skippedVersion !== latest.version;
}

/** Automatic checks run at most this often; the manual check ignores it. */
export const AUTOMATIC_CHECK_INTERVAL_MS = 4 * 60 * 60 * 1000;

export function isAutomaticCheckDue(lastCheckedAt: number | undefined, now: number): boolean {
  return lastCheckedAt === undefined || now - lastCheckedAt >= AUTOMATIC_CHECK_INTERVAL_MS;
}
