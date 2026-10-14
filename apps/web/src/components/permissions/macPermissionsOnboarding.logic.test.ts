import type { MacPermissionStatuses } from "@t3tools/contracts";
import { describe, expect, it } from "vite-plus/test";

import {
  completedMacPermissionsOnboarding,
  macPermissionsAutoOpenReason,
  nextMacPermissionToRequest,
} from "./macPermissionsOnboarding.logic";

const allGranted: MacPermissionStatuses = {
  notifications: "unknown",
  "screen-recording": "granted",
  accessibility: "granted",
  "full-disk-access": "granted",
  microphone: "granted",
  camera: "granted",
};

describe("macPermissionsAutoOpenReason", () => {
  it("opens once on first run", () => {
    expect(
      macPermissionsAutoOpenReason({ onboarding: null, statuses: allGranted, appVersion: "1.0.0" }),
    ).toBe("first-run");
  });

  it("reopens when a previously granted permission is lost, once per version", () => {
    const onboarding = completedMacPermissionsOnboarding({
      previous: null,
      statuses: allGranted,
      appVersion: "1.0.0",
      reason: "first-run",
      now: "2026-10-15T00:00:00.000Z",
    });
    const lost = { ...allGranted, "screen-recording": "denied" } as const;
    expect(
      macPermissionsAutoOpenReason({ onboarding, statuses: allGranted, appVersion: "1.0.1" }),
    ).toBeNull();
    expect(macPermissionsAutoOpenReason({ onboarding, statuses: lost, appVersion: "1.0.1" })).toBe(
      "lost",
    );

    const afterLostPrompt = { ...onboarding, lostPromptVersion: "1.0.1" };
    expect(
      macPermissionsAutoOpenReason({
        onboarding: afterLostPrompt,
        statuses: lost,
        appVersion: "1.0.1",
      }),
    ).toBeNull();
    expect(
      macPermissionsAutoOpenReason({
        onboarding: afterLostPrompt,
        statuses: lost,
        appVersion: "1.0.2",
      }),
    ).toBe("lost");
  });

  it("never counts an unreadable status as lost", () => {
    const onboarding = {
      completedAt: "2026-10-15T00:00:00.000Z",
      granted: ["notifications" as const],
      lostPromptVersion: null,
    };
    expect(
      macPermissionsAutoOpenReason({ onboarding, statuses: allGranted, appVersion: "1.0.0" }),
    ).toBeNull();
  });
});

describe("completedMacPermissionsOnboarding", () => {
  it("records the grants seen and stamps the version only for a loss prompt", () => {
    const statuses = { ...allGranted, camera: "denied" } as const;
    const manual = completedMacPermissionsOnboarding({
      previous: null,
      statuses,
      appVersion: "1.0.0",
      reason: "manual",
      now: "now",
    });
    expect(manual.granted).not.toContain("camera");
    expect(manual.lostPromptVersion).toBeNull();
    const lost = completedMacPermissionsOnboarding({
      previous: manual,
      statuses,
      appVersion: "1.0.1",
      reason: "lost",
      now: "later",
    });
    expect(lost.completedAt).toBe("now");
    expect(lost.lostPromptVersion).toBe("1.0.1");
  });
});

describe("nextMacPermissionToRequest", () => {
  it("walks missing permissions in order, skipping ones already asked", () => {
    const statuses = {
      ...allGranted,
      microphone: "not-determined",
      accessibility: "not-determined",
    } as const;
    expect(nextMacPermissionToRequest(statuses, new Set())).toBe("notifications");
    expect(nextMacPermissionToRequest(statuses, new Set(["notifications"]))).toBe("microphone");
    expect(nextMacPermissionToRequest(statuses, new Set(["notifications", "microphone"]))).toBe(
      "accessibility",
    );
    expect(
      nextMacPermissionToRequest(
        statuses,
        new Set(["notifications", "microphone", "accessibility"]),
      ),
    ).toBeNull();
  });
});
