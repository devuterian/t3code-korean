import type {
  EnvironmentId,
  ExecutionEnvironmentCapabilities,
  ServerSettings,
  ServerSettingsPatch,
} from "@t3tools/contracts";
import type { ActiveThreadSortOrder } from "@t3tools/contracts/settings";
import { isModelSelectionProviderEnabled } from "@t3tools/shared/serverSettings";
import * as Struct from "effect/Struct";

import type { EnvironmentConnectionPhase } from "../connection/presentation.ts";

const SHARED_SERVER_SETTING_KEYS = [
  "activeThreadSortOrder",
  "continueThreadsAfterServerUpdate",
  "sidebarAutoSettleAfterDays",
  "sidebarAutoSettleOnMerge",
  "autoResumeLimitedThreads",
  "snoozeLimitedThreads",
  "newWorktreesStartFromOrigin",
  "sourceControlWritingStyle",
  "textGenerationModelSelection",
] as const satisfies ReadonlyArray<keyof ServerSettings & keyof ServerSettingsPatch>;

export type SharedServerSettingKey = (typeof SHARED_SERVER_SETTING_KEYS)[number];

const SHARED_KEY_SET = new Set<string>(SHARED_SERVER_SETTING_KEYS);

export function splitSharedServerPatch(patch: ServerSettingsPatch): {
  sharedPatch: ServerSettingsPatch;
  localPatch: ServerSettingsPatch;
} {
  const sharedPatch: Record<string, unknown> = {};
  const localPatch: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (SHARED_KEY_SET.has(key)) {
      sharedPatch[key] = value;
    } else {
      localPatch[key] = value;
    }
  }
  return {
    sharedPatch: sharedPatch as ServerSettingsPatch,
    localPatch: localPatch as ServerSettingsPatch,
  };
}

export function filterSharedServerPatch(
  patch: ServerSettingsPatch,
  capabilities:
    | Pick<ExecutionEnvironmentCapabilities, "threadRestartContinuation" | "threadSortOrder">
    | undefined,
  settings?: ServerSettings,
  sourceSettings = settings,
  targetIsSource = false,
): ServerSettingsPatch {
  if (capabilities?.threadSortOrder !== true) {
    patch = Struct.omit(patch, ["activeThreadSortOrder"]);
  }
  const instanceId =
    patch.textGenerationModelSelection?.instanceId ??
    sourceSettings?.textGenerationModelSelection.instanceId;
  if (
    !targetIsSource &&
    patch.textGenerationModelSelection &&
    (!settings ||
      (instanceId !== undefined &&
        (sourceSettings?.providerInstances[instanceId]?.driver ?? instanceId) !==
          (settings.providerInstances[instanceId]?.driver ?? instanceId)) ||
      !isModelSelectionProviderEnabled(settings, {
        ...settings.textGenerationModelSelection,
        ...patch.textGenerationModelSelection,
      }))
  ) {
    patch = Struct.omit(patch, ["textGenerationModelSelection"]);
  }
  return capabilities?.threadRestartContinuation === true
    ? patch
    : Struct.omit(patch, ["continueThreadsAfterServerUpdate"]);
}

export function pickSharedServerSettings(
  settings: ServerSettings,
  capabilities?: Pick<
    ExecutionEnvironmentCapabilities,
    "threadRestartContinuation" | "threadSortOrder"
  >,
): ServerSettingsPatch {
  return filterSharedServerPatch(
    Struct.pick(settings, SHARED_SERVER_SETTING_KEYS),
    capabilities,
    settings,
  );
}

export function supportsSharedSettingsSync(environment: {
  readonly connection: { readonly phase: EnvironmentConnectionPhase };
  readonly serverConfig: {
    readonly environment: {
      readonly capabilities: Pick<ExecutionEnvironmentCapabilities, "threadAutoSettlement">;
    };
  } | null;
}): boolean {
  return (
    environment.connection.phase === "connected" &&
    environment.serverConfig?.environment.capabilities.threadAutoSettlement === true
  );
}

/** Stable source for a merged list: independent of connection arrival order.
 * Writes fan out to connected capable environments; clients of each server
 * receive its authoritative preference through the existing config stream.
 */
export function resolveActiveThreadSortOrder(
  configs: ReadonlyMap<
    EnvironmentId,
    {
      readonly settings: Pick<ServerSettings, "activeThreadSortOrder">;
      readonly environment: {
        readonly capabilities: Pick<ExecutionEnvironmentCapabilities, "threadSortOrder">;
      };
    }
  >,
): ActiveThreadSortOrder {
  const source = [...configs]
    .filter(([, config]) => config.environment.capabilities.threadSortOrder === true)
    .sort(([left], [right]) => left.localeCompare(right))[0];
  return source?.[1].settings.activeThreadSortOrder ?? "manual";
}

/** English labels are translation keys; clients translate them at render time. */
export const ACTIVE_THREAD_SORT_OPTIONS = [
  { value: "manual", label: "Configured order" },
  { value: "last_message", label: "Last message" },
] as const satisfies ReadonlyArray<{ value: ActiveThreadSortOrder; label: string }>;
