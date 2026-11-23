import {
  type AccountSyncBlockReason,
  type AccountSyncEnvironment,
  planProviderAccountSync,
  type ProviderAccountSyncCell,
  providerAccountSyncFailureMessage,
  syncedAccountState,
} from "@t3tools/client-runtime/state/provider-account-sync";
import { msg } from "gt-react-native";
import type {
  EnvironmentId,
  ProviderAccountOmission,
  ProviderInstanceId,
} from "@t3tools/contracts";

import { m, type MessageResolver } from "../../i18n/messages";

export function blockNote(
  reason: AccountSyncBlockReason,
  device: string,
  resolve: MessageResolver = m,
): string {
  switch (reason) {
    case "same-environment":
      return resolve(msg("This is the source device."));
    case "not-connected":
      return resolve(msg("{device} isn't connected.", { device }));
    case "update-required":
      return resolve(msg("Update {device} to sync accounts.", { device }));
    case "permission-required":
      return resolve(msg("This connection can't manage providers on {device}.", { device }));
    case "instance-id-conflict":
      return resolve(msg("{device} uses this account's ID for another provider.", { device }));
  }
}

export interface SyncDestinationChoice {
  readonly environmentId: EnvironmentId;
  readonly label: string;
  readonly disabled: boolean;
  readonly note: string | null;
}

export function syncDestinationChoice(input: {
  readonly resolve?: MessageResolver;
  readonly source: AccountSyncEnvironment;
  readonly destination: AccountSyncEnvironment;
  readonly instanceId: ProviderInstanceId;
}): SyncDestinationChoice {
  const { source, destination, instanceId, resolve = m } = input;
  const plan = planProviderAccountSync({
    source,
    destinations: [destination],
    instanceIds: [instanceId],
  });
  const { environmentId, label } = destination;
  const cell = plan.cells[0];
  const block = plan.destinations[0]?.block ?? null;
  if (block !== null)
    return { environmentId, label, disabled: true, note: blockNote(block, label, resolve) };
  if (plan.sourceBlock !== null)
    return {
      environmentId,
      label,
      disabled: true,
      note: blockNote(plan.sourceBlock, source.label, resolve),
    };
  if (cell?.action === "blocked")
    return { environmentId, label, disabled: true, note: blockNote(cell.reason, label, resolve) };
  if (cell?.action === "update")
    return {
      environmentId,
      label,
      disabled: false,
      note: cell.signedInAs
        ? resolve(
            msg("Updates the copy on {device} (signed in as {account}).", {
              device: label,
              account: cell.signedInAs,
            }),
          )
        : resolve(msg("Updates the copy on {device}.", { device: label })),
    };
  return { environmentId, label, disabled: false, note: null };
}

function omittedNote(
  resolve: MessageResolver,
  omitted: ReadonlyArray<ProviderAccountOmission>,
  sourceLabel: string,
  destinationLabel: string,
): string | null {
  const names = (reason: ProviderAccountOmission["reason"]) =>
    omitted
      .filter((omission) => omission.reason === reason)
      .map(({ setting }) => (setting._tag === "ConfigField" ? setting.field : setting.name));
  const parts: Array<string> = [];
  const local = names("machine-local");
  if (local.length > 0)
    parts.push(
      resolve(
        msg("Stays on {device}: {settings}.", {
          device: sourceLabel,
          settings: local.join(", "),
        }),
      ),
    );
  const unsupported = names("unsupported-here");
  if (unsupported.length > 0)
    parts.push(
      resolve(
        msg("Not supported on {device}, update it: {settings}.", {
          device: destinationLabel,
          settings: unsupported.join(", "),
        }),
      ),
    );
  const missing = names("missing-on-source");
  if (missing.length > 0)
    parts.push(
      resolve(
        msg("No value on {device}: {settings}.", {
          device: sourceLabel,
          settings: missing.join(", "),
        }),
      ),
    );
  const oversized = names("too-large");
  if (oversized.length > 0)
    parts.push(resolve(msg("Too large to copy: {settings}.", { settings: oversized.join(", ") })));
  return parts.length === 0 ? null : parts.join(" ");
}

export interface SyncResultRow {
  readonly key: string;
  readonly title: string;
  readonly description: string;
  readonly tone: "default" | "danger";
}

export function syncResultRow(input: {
  readonly resolve?: MessageResolver;
  readonly cell: ProviderAccountSyncCell;
  readonly accountLabel: string;
  readonly sourceLabel: string;
  readonly destinationLabel: string;
  /** The copy as the destination reports it; undefined until the destination lists it. */
  readonly destinationProvider: Parameters<typeof syncedAccountState>[0];
}): SyncResultRow {
  const { cell, accountLabel, sourceLabel, destinationLabel, resolve = m } = input;
  const key = `${cell.instanceId}:${cell.destinationEnvironmentId}`;
  const title = resolve(
    msg("{account} on {device}", {
      account: accountLabel,
      device: destinationLabel,
    }),
  );
  if (cell.status === "skipped") {
    const device = cell.end === "source" ? sourceLabel : destinationLabel;
    return { key, title, description: blockNote(cell.reason, device, resolve), tone: "default" };
  }
  if (cell.status === "failed") {
    const description =
      cell.failure === "error"
        ? cell.message
        : providerAccountSyncFailureMessage(cell.failure, cell.stage, resolve);
    return { key, title, description, tone: "danger" };
  }
  const state = syncedAccountState(input.destinationProvider);
  const status = (() => {
    switch (state.kind) {
      case "ready":
        return state.signedInAs
          ? resolve(msg("Ready, signed in as {account}.", { account: state.signedInAs }))
          : resolve(msg("Ready."));
      case "starting":
        return resolve(msg("Starting on {device}.", { device: destinationLabel }));
      case "disabled":
        return resolve(msg("Turned off on {device}.", { device: destinationLabel }));
      case "error":
        return state.message
          ? resolve(
              msg("Problem on {device}: {message}", {
                device: destinationLabel,
                message: state.message,
              }),
            )
          : resolve(msg("Problem on {device}.", { device: destinationLabel }));
      case "needs-sign-in":
        return resolve(msg("Sign in on {device} to finish.", { device: destinationLabel }));
      case "needs-host-setup":
        return resolve(
          msg("Sign in on {device} with the provider's own tool.", {
            device: destinationLabel,
          }),
        );
    }
  })();
  const note = omittedNote(resolve, cell.omitted, sourceLabel, destinationLabel);
  return {
    key,
    title,
    description: note === null ? status : `${status} ${note}`,
    tone: state.kind === "error" ? "danger" : "default",
  };
}
