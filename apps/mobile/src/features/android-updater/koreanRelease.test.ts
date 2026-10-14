import { describe, expect, it } from "vite-plus/test";

import {
  compareKoreanVersions,
  isAutomaticCheckDue,
  isKoreanReleaseDownloadUrl,
  isUpdateAvailable,
  parseSha256Digest,
  parseKoreanVersion,
  pickNewestAndroidRelease,
  AUTOMATIC_CHECK_INTERVAL_MS,
} from "./koreanRelease";

const DOWNLOAD = "https://github.com/devuterian/t3code-korean/releases/download";
const SHA = "a".repeat(64);

function release(
  tag: string,
  options: { draft?: boolean; apk?: boolean; apkUrl?: string; digest?: string } = {},
) {
  const version = tag.replace(/^v/, "");
  return {
    tag_name: tag,
    draft: options.draft ?? false,
    prerelease: true,
    html_url: `https://github.com/devuterian/t3code-korean/releases/tag/${tag}`,
    assets: [
      {
        name: `T3-Code-${version}-arm64.dmg`,
        size: 10,
        browser_download_url: "https://example.com/a.dmg",
      },
      ...(options.apk === false
        ? []
        : [
            {
              name: `T3-Code-Korean-${version}-android-arm64.apk`,
              size: 78_257_879,
              browser_download_url:
                options.apkUrl ?? `${DOWNLOAD}/${tag}/T3-Code-Korean-${version}-android-arm64.apk`,
              ...(options.digest === undefined ? {} : { digest: options.digest }),
            },
          ]),
    ],
  };
}

describe("parseKoreanVersion", () => {
  it("reads tags and plain versions", () => {
    expect(parseKoreanVersion("v0.0.46-ko.12")).toEqual({ major: 0, minor: 0, patch: 46, ko: 12 });
    expect(parseKoreanVersion("0.0.46-ko.6")).toEqual({ major: 0, minor: 0, patch: 46, ko: 6 });
  });

  it("rejects non-Korean versions", () => {
    expect(parseKoreanVersion("2.0.0")).toBeNull();
    expect(parseKoreanVersion("v0.0.46-nightly.20261009")).toBeNull();
  });

  it("compares numerically, not lexically", () => {
    const a = parseKoreanVersion("0.0.46-ko.10")!;
    const b = parseKoreanVersion("0.0.46-ko.9")!;
    const c = parseKoreanVersion("0.0.47-ko.1")!;
    expect(compareKoreanVersions(a, b)).toBeGreaterThan(0);
    expect(compareKoreanVersions(c, a)).toBeGreaterThan(0);
  });
});

describe("pickNewestAndroidRelease", () => {
  it("takes the newest prerelease with an APK and skips drafts and APK-less releases", () => {
    const picked = pickNewestAndroidRelease([
      release("v0.0.46-ko.9", { draft: true }),
      release("v0.0.46-ko.8", { apk: false }),
      release("v0.0.46-ko.7"),
      release("v0.0.46-ko.10"),
      release("v0.0.42-ko.1"),
      release("v0.0.46-nightly.1"),
    ]);
    expect(picked).toEqual({
      version: "0.0.46-ko.10",
      apkUrl: `${DOWNLOAD}/v0.0.46-ko.10/T3-Code-Korean-0.0.46-ko.10-android-arm64.apk`,
      apkName: "T3-Code-Korean-0.0.46-ko.10-android-arm64.apk",
      apkSize: 78_257_879,
      htmlUrl: "https://github.com/devuterian/t3code-korean/releases/tag/v0.0.46-ko.10",
    });
  });

  it("only takes APKs from the fork's release downloads", () => {
    for (const apkUrl of [
      "https://github.com/download/v0.0.46-ko.7.apk",
      "https://github.com/someone/t3code-korean/releases/download/v0.0.46-ko.7/a.apk",
      `${DOWNLOAD}/../../../evil/repo/releases/download/v1/a.apk`,
      `${DOWNLOAD}/v0.0.46-ko.7/../a.apk`,
      `http://github.com/devuterian/t3code-korean/releases/download/v0.0.46-ko.7/a.apk`,
    ]) {
      expect(isKoreanReleaseDownloadUrl(apkUrl)).toBe(false);
      expect(pickNewestAndroidRelease([release("v0.0.46-ko.7", { apkUrl })])).toBeNull();
    }
    expect(isKoreanReleaseDownloadUrl(`${DOWNLOAD}/v0.0.46-ko.7/T3-Code-Korean.apk`)).toBe(true);
  });

  it("carries the asset's SHA-256 digest when GitHub provides one", () => {
    expect(
      pickNewestAndroidRelease([release("v0.0.46-ko.7", { digest: `sha256:${SHA.toUpperCase()}` })])
        ?.apkSha256,
    ).toBe(SHA);
    expect(pickNewestAndroidRelease([release("v0.0.46-ko.7")])).not.toHaveProperty("apkSha256");
    expect(parseSha256Digest(`sha256:${SHA}`)).toBe(SHA);
    expect(parseSha256Digest(`sha512:${SHA}`)).toBeNull();
    expect(parseSha256Digest("sha256:abc")).toBeNull();
    expect(parseSha256Digest(null)).toBeNull();
  });

  it("returns null for unexpected payloads", () => {
    expect(pickNewestAndroidRelease({ message: "API rate limit exceeded" })).toBeNull();
    expect(pickNewestAndroidRelease([null, 3, { tag_name: 5 }])).toBeNull();
  });
});

describe("isUpdateAvailable", () => {
  const latest = pickNewestAndroidRelease([release("v0.0.46-ko.7")]);

  it("offers only strictly newer releases", () => {
    expect(isUpdateAvailable("0.0.46-ko.6", latest)).toBe(true);
    expect(isUpdateAvailable("0.0.46-ko.7", latest)).toBe(false);
    expect(isUpdateAvailable("0.0.46-ko.8", latest)).toBe(false);
  });

  it("respects a skipped version and ignores development builds", () => {
    expect(isUpdateAvailable("0.0.46-ko.6", latest, "0.0.46-ko.7")).toBe(false);
    expect(isUpdateAvailable("2.0.0", latest)).toBe(false);
  });
});

describe("isAutomaticCheckDue", () => {
  it("throttles automatic checks", () => {
    expect(isAutomaticCheckDue(undefined, 1000)).toBe(true);
    expect(isAutomaticCheckDue(1000, 1000 + AUTOMATIC_CHECK_INTERVAL_MS - 1)).toBe(false);
    expect(isAutomaticCheckDue(1000, 1000 + AUTOMATIC_CHECK_INTERVAL_MS)).toBe(true);
  });
});
