import {
  DEFAULT_SERVER_SETTINGS,
  EnvironmentId,
  ProviderDriverKind,
  ProviderInstanceId,
} from "@t3tools/contracts";
import { describe, expect, it } from "@effect/vitest";

import {
  resolveActiveThreadSortOrder,
  filterSharedServerPatch,
  pickSharedServerSettings,
  splitSharedServerPatch,
} from "./sharedSettings.ts";

const primaryId = EnvironmentId.make("env-primary");
const laptopId = EnvironmentId.make("env-laptop");
const boxId = EnvironmentId.make("env-box");
const restartCapabilities = { threadRestartContinuation: true };

describe("filterSharedServerPatch", () => {
  it.each([true, false])(
    "resets a disabled default provider only on the originating environment (%s)",
    (targetIsSource) => {
      const settings = {
        ...DEFAULT_SERVER_SETTINGS,
        providerInstances: {
          codex: { driver: ProviderDriverKind.make("codex"), enabled: false, config: {} },
          claudeAgent: {
            driver: ProviderDriverKind.make("claudeAgent"),
            enabled: true,
            config: {},
          },
        },
        textGenerationModelSelection: {
          instanceId: ProviderInstanceId.make("claudeAgent"),
          model: "claude-opus-4-6",
        },
      };
      const patch = {
        textGenerationModelSelection: DEFAULT_SERVER_SETTINGS.textGenerationModelSelection,
        continueThreadsAfterServerUpdate: true,
        sidebarAutoSettleAfterDays: 7,
      };
      expect(filterSharedServerPatch(patch, undefined, settings, settings, targetIsSource)).toEqual(
        {
          ...(targetIsSource
            ? { textGenerationModelSelection: DEFAULT_SERVER_SETTINGS.textGenerationModelSelection }
            : {}),
          sidebarAutoSettleAfterDays: 7,
        },
      );
    },
  );

  it.each(["missing", "disabled", "different-driver", "enabled"] as const)(
    "shares a custom model only when its target provider is enabled (%s)",
    (availability) => {
      const instanceId = ProviderInstanceId.make("codex_personal");
      const selection = {
        instanceId,
        model: "gpt-5.6-luna",
        options: [{ id: "reasoningEffort", value: "low" }],
      };
      const instance = {
        driver: ProviderDriverKind.make(
          availability === "different-driver" ? "claudeAgent" : "codex",
        ),
        enabled: availability !== "disabled",
        config: {},
      };
      const settings = {
        ...DEFAULT_SERVER_SETTINGS,
        providerInstances: availability === "missing" ? {} : { [instanceId]: instance },
      };
      const patch = { sidebarAutoSettleAfterDays: 7, textGenerationModelSelection: selection };
      const sourceSettings = {
        ...settings,
        providerInstances: {
          [instanceId]: { ...instance, driver: ProviderDriverKind.make("codex"), enabled: true },
        },
      };
      expect(filterSharedServerPatch(patch, restartCapabilities, settings, sourceSettings)).toEqual(
        availability === "enabled" ? patch : { sidebarAutoSettleAfterDays: 7 },
      );
    },
  );

  it.each([undefined, {}, { threadRestartContinuation: false }])(
    "omits only the unsupported restart preference with capabilities %j",
    (capabilities) => {
      expect(
        filterSharedServerPatch(
          { continueThreadsAfterServerUpdate: true, sidebarAutoSettleAfterDays: 7 },
          capabilities,
        ),
      ).toEqual({ sidebarAutoSettleAfterDays: 7 });
      expect(pickSharedServerSettings(DEFAULT_SERVER_SETTINGS, capabilities)).not.toHaveProperty(
        "continueThreadsAfterServerUpdate",
      );
    },
  );
});

describe("active thread sort across clients", () => {
  it("fans out supported sort settings and excludes servers that cannot persist them", () => {
    const patch = { activeThreadSortOrder: "last_message" as const };
    expect(splitSharedServerPatch(patch)).toEqual({ sharedPatch: patch, localPatch: {} });
    expect(filterSharedServerPatch(patch, {})).toEqual({});
    expect(filterSharedServerPatch(patch, { threadSortOrder: true })).toEqual(patch);
  });

  const config = (order: "manual" | "last_message", supported = true) => ({
    settings: { activeThreadSortOrder: order },
    environment: { capabilities: { threadSortOrder: supported } },
  });
  it("reads a returning client's preference from the server and ignores older servers", () => {
    expect(resolveActiveThreadSortOrder(new Map([[primaryId, config("last_message")]]))).toBe(
      "last_message",
    );
    expect(
      resolveActiveThreadSortOrder(new Map([[primaryId, config("last_message", false)]])),
    ).toBe("manual");
    expect(resolveActiveThreadSortOrder(new Map())).toBe("manual");
  });
  it("resolves differing servers independently of their connection arrival order", () => {
    const entries = [
      [boxId, config("last_message")],
      [laptopId, config("manual")],
    ] as const;
    expect(resolveActiveThreadSortOrder(new Map(entries))).toBe("last_message");
    expect(resolveActiveThreadSortOrder(new Map(entries.toReversed()))).toBe("last_message");
  });
});
