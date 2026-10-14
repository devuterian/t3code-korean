import { describe, expect, it } from "vite-plus/test";

import {
  isKoreanForkDesktopVersion,
  isNightlyDesktopVersion,
  resolveDefaultDesktopUpdateChannel,
} from "./updateChannels.ts";

describe("updateChannels", () => {
  it("keeps preview builds branded as nightly but on the latest update channel", () => {
    expect(isNightlyDesktopVersion("0.0.41-preview.20260911.7")).toBe(true);
    expect(resolveDefaultDesktopUpdateChannel("0.0.41-preview.20260911.7")).toBe("latest");
    expect(resolveDefaultDesktopUpdateChannel("0.0.41-nightly.20260911.7")).toBe("nightly");
  });

  it("only matches the first prerelease identifier", () => {
    expect(isNightlyDesktopVersion("1.2.3-foo-preview.20260911.1")).toBe(false);
    expect(isNightlyDesktopVersion("1.2.3")).toBe(false);
  });

  it("recognizes Korean fork release versions", () => {
    expect(isKoreanForkDesktopVersion("0.0.46-ko.6")).toBe(true);
    expect(isKoreanForkDesktopVersion("0.0.47-ko.10")).toBe(true);
    expect(isKoreanForkDesktopVersion("0.0.46")).toBe(false);
    expect(isKoreanForkDesktopVersion("0.0.46-nightly.20260911.7")).toBe(false);
  });
});
