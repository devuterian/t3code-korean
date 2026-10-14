import { describe, expect, it } from "vite-plus/test";

import { shouldShowPermissionOnboarding, type AndroidPermissionId } from "./permissionOnboarding";

const granted = (...ids: AndroidPermissionId[]) => new Set<AndroidPermissionId>(ids);

describe("shouldShowPermissionOnboarding", () => {
  it("shows on first run", () => {
    expect(shouldShowPermissionOnboarding(undefined, "0.0.46-ko.6", granted())).toBe(true);
  });

  it("stays hidden for the version it was dismissed on, even after a revocation", () => {
    const stored = { seenVersion: "0.0.46-ko.6", granted: ["camera"] };
    expect(shouldShowPermissionOnboarding(stored, "0.0.46-ko.6", granted())).toBe(false);
  });

  it("returns on a new version only when a granted permission was revoked", () => {
    const stored = { seenVersion: "0.0.46-ko.6", granted: ["notifications", "camera"] };
    expect(
      shouldShowPermissionOnboarding(stored, "0.0.46-ko.7", granted("notifications", "camera")),
    ).toBe(false);
    expect(shouldShowPermissionOnboarding(stored, "0.0.46-ko.7", granted("notifications"))).toBe(
      true,
    );
  });

  it("does not nag about permissions the user declined", () => {
    const stored = { seenVersion: "0.0.46-ko.6", granted: ["notifications"] };
    expect(shouldShowPermissionOnboarding(stored, "0.0.46-ko.7", granted("notifications"))).toBe(
      false,
    );
  });
});
