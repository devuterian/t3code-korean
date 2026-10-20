import type { ServerUpdateState } from "@t3tools/client-runtime/state/server";
import type { EnvironmentId, ServerConfig } from "@t3tools/contracts";
import { cliReleaseChannelOf } from "@t3tools/shared/cliRelease";

import {
  resolveServerSelfUpdateCapability,
  resolveVersionMismatch,
  supportsDesktopAppUpdate,
  supportsServerUpdateThreadContinuation,
} from "~/versionSkew";
import { getInterfaceLanguage, translate } from "../../i18n/translate";
import type { ServerUpdateOutcome, ServerUpdateTarget } from "../ServerUpdateAction";

export interface UpdateEverythingMachine {
  readonly environmentId: EnvironmentId;
  readonly label: string;
  readonly serverConfig: {
    readonly environment: ServerConfig["environment"];
    readonly settings: Pick<ServerConfig["settings"], "continueThreadsAfterServerUpdate">;
  } | null;
  readonly connected: boolean;
  readonly hostedByThisApp: boolean;
  readonly canMaintain: boolean;
  readonly updateState: ServerUpdateState;
}

export interface RestartingMachine {
  readonly environmentId: EnvironmentId;
  readonly continuesThreads: boolean;
}

export function collectRestartingMachines(
  machines: ReadonlyArray<UpdateEverythingMachine>,
  servers: ReadonlyArray<Pick<ServerUpdateTarget, "environmentId">>,
  installsLocal: boolean,
): RestartingMachine[] {
  const updated = new Set(servers.map((server) => server.environmentId));
  return machines.flatMap((machine) => {
    const config = machine.serverConfig;
    if (
      config === null ||
      !machine.connected ||
      !(updated.has(machine.environmentId) || (installsLocal && machine.hostedByThisApp))
    ) {
      return [];
    }
    return [
      {
        environmentId: machine.environmentId,
        continuesThreads:
          config.environment.capabilities.threadRestartContinuation === true &&
          config.settings.continueThreadsAfterServerUpdate === true,
      },
    ];
  });
}

export interface SkippedMachine {
  readonly environmentId: EnvironmentId;
  readonly label: string;
  readonly reason: string;
}

/**
 * Two kinds are in neither list: servers already on the target, and servers this app hosts,
 * which would relaunch the app mid-run and update with the app's own install anyway. A
 * desktop-managed server follows its own app's update feed, so the channel rule does not apply
 * to it.
 */
export function collectServerUpdateTargets(
  machines: ReadonlyArray<UpdateEverythingMachine>,
  targetVersion: string,
): { readonly targets: ServerUpdateTarget[]; readonly skipped: SkippedMachine[] } {
  const targets: ServerUpdateTarget[] = [];
  const skipped: SkippedMachine[] = [];
  for (const machine of machines) {
    const config = machine.serverConfig;
    if (machine.hostedByThisApp) continue;
    if (
      config !== null &&
      resolveVersionMismatch(config.environment.serverVersion, targetVersion) === null
    ) {
      continue;
    }
    const skip = (reason: string) =>
      skipped.push({ environmentId: machine.environmentId, label: machine.label, reason });
    if (config === null || !machine.connected) {
      skip(translate("not connected"));
      continue;
    }
    if (!machine.canMaintain) {
      skip(translate("no permission"));
      continue;
    }
    if (machine.updateState.status === "running") {
      skip(translate("already updating"));
      continue;
    }
    const selfUpdate = resolveServerSelfUpdateCapability(config);
    const desktopAppUpdate = supportsDesktopAppUpdate(config);
    if (selfUpdate === null) {
      skip(translate("needs a manual update"));
      continue;
    }
    if (selfUpdate === "desktop-managed" && !desktopAppUpdate) {
      skip(translate("needs a newer desktop app"));
      continue;
    }
    const serverVersion = config.environment.serverVersion;
    if (
      selfUpdate !== "desktop-managed" &&
      cliReleaseChannelOf(serverVersion) !== cliReleaseChannelOf(targetVersion)
    ) {
      skip(
        translate("on the {channel} channel").replace("{channel}", () =>
          cliReleaseChannelOf(serverVersion),
        ),
      );
      continue;
    }
    targets.push({
      environmentId: machine.environmentId,
      serverLabel: machine.label,
      selfUpdate,
      installation: config.environment.capabilities.serverInstallation,
      desktopAppUpdate,
      threadContinuation: supportsServerUpdateThreadContinuation(config),
      continueThreadsAfterServerUpdate: config.settings.continueThreadsAfterServerUpdate ?? false,
      targetVersion,
    });
  }
  return { targets, skipped };
}

export interface UpdateEverythingSteps<Providers, Servers> {
  readonly downloadLocal?: () => Promise<boolean>;
  readonly updateProviders: () => Promise<Providers>;
  readonly updateServers: () => Promise<Servers>;
}

/**
 * Providers finish before any server restarts, so no install is cut off. The caller installs this app afterwards when `localReady`, because
 * the relaunch ends the run; a failed download skips only that install.
 */
export async function runUpdateEverything<Providers, Servers>(
  steps: UpdateEverythingSteps<Providers, Servers>,
): Promise<{
  readonly localReady: boolean;
  readonly providers: Providers;
  readonly servers: Servers;
}> {
  const [localReady, remote] = await Promise.all([
    steps.downloadLocal?.() ?? Promise.resolve(true),
    steps
      .updateProviders()
      .then(async (providers) => ({ providers, servers: await steps.updateServers() })),
  ]);
  return { localReady, ...remote };
}

export type UpdateRunMachineStatus =
  | "providers"
  | "waiting"
  | "downloading"
  | "restarting"
  | "done"
  | "failed";

export interface UpdateRunMachine {
  readonly environmentId: EnvironmentId;
  readonly label: string;
  readonly updatesProviders: boolean;
  readonly server: ServerUpdateTarget | null;
  readonly handedOffVersion: string | null;
  readonly startedAt: number;
  readonly result: "done" | "failed" | null;
  readonly failure: string | null;
  readonly providerFailure: string | null;
}

export interface UpdateEverythingRun {
  readonly localVersion: string | null;
  readonly phase: "providers" | "servers" | "countdown" | "installing";
  readonly restartAt: number | null;
  readonly machines: ReadonlyArray<UpdateRunMachine>;
}

export function resolveUpdateRunMachineStatus(
  machine: UpdateRunMachine,
  phase: UpdateEverythingRun["phase"],
  serverState: ServerUpdateState,
): UpdateRunMachineStatus {
  if (machine.result !== null) return machine.result;
  if (machine.handedOffVersion !== null) return "restarting";
  if (phase === "providers" && machine.updatesProviders) return "providers";
  if (machine.server !== null && serverState.status === "running") {
    return serverState.stage === "resuming" ? "restarting" : "downloading";
  }
  return "waiting";
}

export function isServerUpdateHandedOff(state: ServerUpdateState): boolean {
  return state.status === "running" && state.stage === "resuming";
}

export function closeFinishedUpdateRun(run: UpdateEverythingRun): UpdateEverythingRun | null {
  return run.phase === "servers" &&
    run.localVersion === null &&
    run.machines.every((machine) => machine.result === "done")
    ? null
    : run;
}

export const UPDATE_SLOW_AFTER_MS = 3 * 60 * 1000;

export function formatUpdateElapsed(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return "<1m";
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export interface UpdateRunMachineView {
  readonly machine: UpdateRunMachine;
  readonly status: UpdateRunMachineStatus;
}

export type UpdateRunLocalState =
  | { readonly status: "downloading"; readonly percent: number | null }
  | { readonly status: "waiting" }
  | null;

export interface UpdateCapsuleView {
  readonly tone: "default" | "slow" | "failed";
  readonly label: string;
  readonly slow?: { readonly status: string; readonly elapsed: string };
  readonly action: "later" | "retry" | "dismiss" | null;
}

const isActive = (status: UpdateRunMachineStatus) => status !== "done" && status !== "failed";

export function describeUpdateCapsule(
  run: UpdateEverythingRun,
  machines: ReadonlyArray<UpdateRunMachineView>,
  local: UpdateRunLocalState,
  now: number,
): UpdateCapsuleView {
  if (run.phase === "countdown" && run.restartAt !== null) {
    const seconds = Math.max(0, Math.ceil((run.restartAt - now) / 1000));
    return {
      tone: "default",
      label: translate("Restart in {seconds}s").replace("{seconds}", () => String(seconds)),
      action: "later",
    };
  }
  if (run.phase === "installing") {
    return { tone: "default", label: translate("Restarting…"), action: null };
  }
  const active = machines.filter(({ status }) => isActive(status) && status !== "waiting");
  const slowest = active.toSorted((a, b) => a.machine.startedAt - b.machine.startedAt)[0];
  if (slowest && now - slowest.machine.startedAt >= UPDATE_SLOW_AFTER_MS) {
    return {
      tone: "slow",
      label: slowest.machine.label,
      slow: {
        status: RUN_STATUS_LABELS[slowest.status],
        elapsed: formatUpdateElapsed(now - slowest.machine.startedAt),
      },
      action: null,
    };
  }
  const done = machines.filter(({ status }) => status === "done").length;
  if (machines.some(({ status }) => isActive(status))) {
    return { tone: "default", label: updatedCountLabel(done, machines.length), action: null };
  }
  if (local?.status === "downloading") {
    return {
      tone: "default",
      label:
        local.percent === null
          ? translate("Downloading")
          : translate("Downloading {percent}%").replace("{percent}", () =>
              String(Math.floor(local.percent ?? 0)),
            ),
      action: null,
    };
  }
  const failed = machines.filter(({ status }) => status === "failed");
  if (failed.length > 0) {
    return {
      tone: "failed",
      label: translate(failed.length === 1 ? "{label} failed" : "{count} failed")
        .replace("{label}", () => failed[0]!.machine.label)
        .replace("{count}", () => String(failed.length)),
      action: failed.some(({ machine }) => machine.server !== null) ? "retry" : "dismiss",
    };
  }
  return { tone: "default", label: updatedCountLabel(done, machines.length), action: null };
}

function updatedCountLabel(done: number, total: number): string {
  return translate("{done} of {total} updated")
    .replace("{done}", () => String(done))
    .replace("{total}", () => String(total));
}

export const RUN_STATUS_LABELS: Record<UpdateRunMachineStatus, string> = {
  providers: "updating providers",
  waiting: "waiting",
  downloading: "downloading",
  restarting: "restarting",
  done: "done",
  failed: "failed",
};

export interface UpdateEverythingResult {
  readonly localVersion: string | null;
  readonly updatedServers: number;
  readonly updatedProviders: number;
  readonly failures: ReadonlyArray<string>;
  readonly restarting: ReadonlyArray<string>;
}

export function collectUpdateEverythingResult(input: {
  readonly localVersion: string | null;
  readonly localFailures: ReadonlyArray<string>;
  readonly servers: ReadonlyArray<{
    readonly label: string;
    readonly outcome: ServerUpdateOutcome;
  }>;
  readonly providers: ReadonlyArray<
    | { readonly status: "interrupted" | "updated" }
    | { readonly status: "failed"; readonly line: string }
  >;
}): UpdateEverythingResult {
  return {
    localVersion: input.localVersion,
    updatedServers: input.servers.filter(({ outcome }) => outcome.status === "updated").length,
    updatedProviders: input.providers.filter((outcome) => outcome.status === "updated").length,
    restarting: [],
    failures: [
      ...input.localFailures.map((failure) => `${translate("This app:")} ${failure}`),
      ...input.servers.flatMap(({ label, outcome }) =>
        outcome.status === "failed" ? [`${label}: ${outcome.message}`] : [],
      ),
      ...input.providers.flatMap((outcome) => (outcome.status === "failed" ? [outcome.line] : [])),
    ],
  };
}

export function getUpdateEverythingToastView(
  result: UpdateEverythingResult,
  appVersion: string,
): {
  readonly type: "success" | "error";
  readonly title: string;
  readonly description?: string;
} | null {
  const parts = [
    result.localVersion !== null && result.localVersion === appVersion
      ? translate("this app")
      : null,
    countLabel(result.updatedServers, "{count} server", "{count} servers"),
    countLabel(result.updatedProviders, "{count} provider", "{count} providers"),
  ].filter((part) => part !== null);
  const restarting =
    result.restarting.length === 0
      ? []
      : [
          translate(
            result.restarting.length === 1
              ? "{names} is still restarting."
              : "{names} are still restarting.",
          ).replace("{names}", () => joinList(result.restarting)),
        ];
  if (result.failures.length === 0) {
    if (parts.length === 0) return null;
    return {
      type: "success",
      title: updatedTitle(parts),
      ...(restarting.length === 0 ? {} : { description: restarting.join("\n") }),
    };
  }
  return {
    type: "error",
    title: parts.length === 0 ? translate("Update failed") : updatedTitle(parts),
    description: [...result.failures, ...restarting].join("\n"),
  };
}

export interface UpdateEverythingPlan {
  readonly localVersion: string | null;
  readonly servers: ReadonlyArray<
    Pick<ServerUpdateTarget, "environmentId" | "serverLabel" | "selfUpdate" | "targetVersion">
  >;
  readonly providerMachines: ReadonlyArray<{
    readonly environmentId: EnvironmentId;
    readonly label: string;
    readonly providers: ReadonlyArray<string>;
  }>;
}

function countLabel(count: number, singular: string, plural: string): string | null {
  return count === 0
    ? null
    : translate(count === 1 ? singular : plural).replace("{count}", () => String(count));
}

/** "a, b, and c" in English; other interface languages use their own list conjunction. */
function joinList(parts: ReadonlyArray<string>): string {
  return new Intl.ListFormat(getInterfaceLanguage(), { type: "conjunction" }).format(parts);
}

function updatedTitle(parts: ReadonlyArray<string>): string {
  return translate("Updated {items}").replace("{items}", () => joinList(parts));
}

export function describeUpdateEverything(plan: UpdateEverythingPlan): {
  readonly summary: string;
  readonly lines: ReadonlyArray<string>;
} {
  const providerCount = plan.providerMachines.reduce(
    (count, machine) => count + machine.providers.length,
    0,
  );
  const summary = translate("Update {items}").replace("{items}", () =>
    joinList(
      [
        plan.localVersion ? translate("this app") : null,
        countLabel(plan.servers.length, "{count} server", "{count} servers"),
        countLabel(providerCount, "{count} provider", "{count} providers"),
      ].filter((part) => part !== null),
    ),
  );

  const machines = new Map<EnvironmentId, { label: string; items: string[] }>();
  const itemsFor = (environmentId: EnvironmentId, label: string) => {
    const existing = machines.get(environmentId);
    if (existing) return existing.items;
    const items: string[] = [];
    machines.set(environmentId, { label, items });
    return items;
  };
  for (const server of plan.servers) {
    itemsFor(server.environmentId, server.serverLabel).push(
      server.selfUpdate === "desktop-managed"
        ? translate("desktop app update")
        : translate("server to {version}").replace("{version}", () => server.targetVersion),
    );
  }
  for (const machine of plan.providerMachines) {
    itemsFor(machine.environmentId, machine.label).push(...machine.providers);
  }

  return {
    summary,
    lines: [
      ...(plan.localVersion
        ? [
            translate("This app: {version}, restarts last").replace(
              "{version}",
              () => plan.localVersion ?? "",
            ),
          ]
        : []),
      ...Array.from(machines.values(), ({ label, items }) => `${label}: ${items.join(", ")}`),
    ],
  };
}
