import { useAtomValue } from "@effect/atom-react";
import { useNavigate } from "@tanstack/react-router";
import type {
  EnvironmentId,
  ProviderAccountOmission,
  ProviderInstanceId,
} from "@t3tools/contracts";
import {
  type AccountSyncBlockReason,
  type AccountSyncEnvironment,
  planProviderAccountSync,
  type ProviderAccountSyncCell,
  type ProviderAccountSyncPlan,
  type ProviderAccountSyncReport,
  supportsProviderAccountSync,
  syncedAccountState,
} from "@t3tools/client-runtime/state/provider-account-sync";
import { Atom } from "effect/reactivity";
import { ArrowLeftRightIcon } from "lucide-react";
import { useState } from "react";

import { translate, useTranslate } from "../../i18n/translate";

import { environmentAtomList, environmentIdsKey } from "../../state/environmentAtomList";
import { type EnvironmentPresentation, useEnvironments } from "../../state/environments";
import { EMPTY_SERVER_PROVIDERS, providerAccountSync, serverEnvironment } from "../../state/server";
import { useAtomCommand } from "../../state/use-atom-command";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog } from "../ui/dialog";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
import { WizardFooter, WizardHeader, WizardPanel, WizardPopup } from "../ui/wizard";
import { SettingsRow, SettingsSearchTarget } from "./settingsLayout";
import { searchableSetting } from "./settingsSearch";

const accountSyncStatesAtom = environmentAtomList(
  "web-provider-account-sync",
  (environmentId: EnvironmentId) =>
    Atom.make((get) => ({
      canExport: get(providerAccountSync.canExportAtom(environmentId)),
      canImport: get(providerAccountSync.canImportAtom(environmentId)),
      settings: get(serverEnvironment.settingsValueAtom(environmentId)),
      providers: get(serverEnvironment.providersValueAtom(environmentId)) ?? EMPTY_SERVER_PROVIDERS,
    })).pipe(Atom.withLabel(`web-provider-account-sync:${environmentId}`)),
);

function useAccountSyncEnvironments(sourceEnvironmentId: EnvironmentId) {
  const { environments } = useEnvironments();
  const states = useAtomValue(
    accountSyncStatesAtom(environmentIdsKey(environments.map((e) => e.environmentId))),
  );
  const all = environments.map((environment, index): AccountSyncEnvironment => {
    const state = states[index];
    const isSource = environment.environmentId === sourceEnvironmentId;
    return {
      environmentId: environment.environmentId,
      label: environment.label,
      connection: environment.connection,
      serverConfig: environment.serverConfig,
      canManageProviders: (isSource ? state?.canExport : state?.canImport) ?? false,
      settings: state?.settings ?? null,
      providers: state?.providers ?? EMPTY_SERVER_PROVIDERS,
    };
  });
  return {
    source: all.find((environment) => environment.environmentId === sourceEnvironmentId),
    destinations: all.filter((environment) => environment.environmentId !== sourceEnvironmentId),
  };
}

function blockNote(reason: AccountSyncBlockReason, device: string): string {
  switch (reason) {
    case "same-environment":
      return translate("This is the source device.");
    case "not-connected":
      return translate("{device} isn't connected.").replace("{device}", () => device);
    case "update-required":
      return translate("Update {device} to sync accounts.").replace("{device}", () => device);
    case "permission-required":
      return translate("This connection can't manage providers on {device}.").replace(
        "{device}",
        () => device,
      );
    case "instance-id-conflict":
      return translate("{device} uses this account's ID for another provider.").replace(
        "{device}",
        () => device,
      );
  }
}

function omittedNote(
  omitted: ReadonlyArray<ProviderAccountOmission>,
  sourceLabel: string,
  destinationLabel: string,
): string | null {
  const names = (reason: ProviderAccountOmission["reason"]) =>
    omitted
      .filter((omission) => omission.reason === reason)
      .map(({ setting }) => (setting._tag === "ConfigField" ? setting.field : setting.name));
  const parts: Array<string> = [];
  const note = (template: string, device: string, settings: ReadonlyArray<string>) =>
    translate(template)
      .replace("{device}", () => device)
      .replace("{settings}", () => settings.join(", "));
  const local = names("machine-local");
  if (local.length > 0) parts.push(note("Stays on {device}: {settings}.", sourceLabel, local));
  const unsupported = names("unsupported-here");
  if (unsupported.length > 0)
    parts.push(
      note("Not supported on {device}, update it: {settings}.", destinationLabel, unsupported),
    );
  const missing = names("missing-on-source");
  if (missing.length > 0)
    parts.push(note("No value on {device}: {settings}.", sourceLabel, missing));
  const oversized = names("too-large");
  if (oversized.length > 0) parts.push(note("Too large to copy: {settings}.", "", oversized));
  return parts.length === 0 ? null : parts.join(" ");
}

function toggled<T>(set: ReadonlySet<T>, value: T, checked: boolean): ReadonlySet<T> {
  const next = new Set(set);
  if (checked) next.add(value);
  else next.delete(value);
  return next;
}

function SyncedAccountRow({
  cell,
  accountLabel,
  sourceLabel,
  destinationLabel,
  onOpen,
}: {
  readonly cell: ProviderAccountSyncCell;
  readonly accountLabel: string;
  readonly sourceLabel: string;
  readonly destinationLabel: string;
  readonly onOpen: () => void;
}) {
  const t = useTranslate();
  const providers =
    useAtomValue(serverEnvironment.providersValueAtom(cell.destinationEnvironmentId)) ??
    EMPTY_SERVER_PROVIDERS;
  const withDevice = (template: string) => t(template).replace("{device}", () => destinationLabel);
  const title = withDevice("{account} on {device}").replace("{account}", () => accountLabel);
  if (cell.status === "skipped") {
    const device = cell.end === "source" ? sourceLabel : destinationLabel;
    return <SettingsRow title={title} description={blockNote(cell.reason, device)} />;
  }
  if (cell.status === "failed") {
    return <SettingsRow title={title} description={cell.message} />;
  }
  const state = syncedAccountState(
    providers.find((candidate) => candidate.instanceId === cell.instanceId),
  );
  const status = (() => {
    switch (state.kind) {
      case "ready":
        return state.signedInAs
          ? t("Ready, signed in as {account}.").replace("{account}", () => state.signedInAs ?? "")
          : t("Ready.");
      case "starting":
        return withDevice("Starting on {device}.");
      case "disabled":
        return withDevice("Turned off on {device}.");
      case "error":
        return state.message
          ? withDevice("Problem on {device}: {message}").replace(
              "{message}",
              () => state.message ?? "",
            )
          : withDevice("Problem on {device}.");
      case "needs-sign-in":
        return withDevice("Sign in on {device} to finish.");
      case "needs-host-setup":
        return withDevice("Sign in on {device} with the provider's own tool.");
    }
  })();
  const openLabel =
    state.kind === "needs-sign-in" || state.kind === "needs-host-setup"
      ? withDevice("Sign in on {device}")
      : state.kind === "disabled" || state.kind === "error"
        ? withDevice("Open on {device}")
        : null;
  const note = omittedNote(cell.omitted, sourceLabel, destinationLabel);
  return (
    <SettingsRow
      title={title}
      description={note === null ? status : `${status} ${note}`}
      control={
        openLabel === null ? undefined : (
          <Button size="sm" variant="outline" onClick={onOpen}>
            {openLabel}
          </Button>
        )
      }
    />
  );
}

function ChoiceRow({
  checked,
  disabled,
  title,
  description,
  onCheckedChange,
}: {
  readonly checked: boolean;
  readonly disabled?: boolean;
  readonly title: string;
  readonly description: string | null;
  readonly onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 py-1.5">
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={(next) => onCheckedChange(next === true)}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-foreground">{title}</span>
        {description ? (
          <span className="block text-xs text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

function destinationNote(
  plan: ProviderAccountSyncPlan,
  destination: ProviderAccountSyncPlan["destinations"][number],
  sourceLabel: string,
): string | null {
  if (destination.block !== null) return blockNote(destination.block, destination.label);
  if (plan.sourceBlock !== null) return blockNote(plan.sourceBlock, sourceLabel);
  const notes = plan.cells.flatMap((cell) => {
    if (cell.destinationEnvironmentId !== destination.environmentId) return [];
    const account =
      plan.accounts.find((candidate) => candidate.instanceId === cell.instanceId)?.label ??
      cell.instanceId;
    switch (cell.action) {
      case "create":
        return [translate("Adds {account}").replace("{account}", () => account)];
      case "update":
        return [
          (cell.signedInAs
            ? translate("Updates {account} (signed in as {email})").replace(
                "{email}",
                () => cell.signedInAs ?? "",
              )
            : translate("Updates {account}")
          ).replace("{account}", () => account),
        ];
      case "blocked":
        return [`${account}: ${blockNote(cell.reason, destination.label)}`];
    }
  });
  return notes.length === 0 ? null : notes.join(". ");
}

function SyncProviderAccountsDialog(props: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly sourceEnvironmentId: EnvironmentId;
  readonly initialInstanceIds: ReadonlyArray<ProviderInstanceId>;
}) {
  const t = useTranslate();
  const { source, destinations } = useAccountSyncEnvironments(props.sourceEnvironmentId);
  const [instanceIds, setInstanceIds] = useState<ReadonlySet<ProviderInstanceId>>(
    () => new Set(props.initialInstanceIds),
  );
  const [destinationIds, setDestinationIds] = useState<ReadonlySet<EnvironmentId>>(() => new Set());
  const [report, setReport] = useState<ProviderAccountSyncReport | null>(null);
  const [running, setRunning] = useState(false);
  const sync = useAtomCommand(providerAccountSync, { reportFailure: false });
  const navigate = useNavigate();
  if (source === undefined) return null;

  const plan = planProviderAccountSync({ source, destinations, instanceIds: [...instanceIds] });
  // A card's "Sync to…" may name an account the planner wouldn't offer (unconfigured, signed
  // out); keep it visible so the choice the user made is on screen.
  const accounts = [
    ...plan.accounts,
    ...[...instanceIds]
      .filter((id) => !plan.accounts.some((account) => account.instanceId === id))
      .map((id) => ({ instanceId: id, label: id, signedInAs: undefined })),
  ];
  const accountLabel = (instanceId: ProviderInstanceId) =>
    accounts.find((account) => account.instanceId === instanceId)?.label ?? instanceId;
  const destinationLabel = (environmentId: EnvironmentId) =>
    destinations.find((candidate) => candidate.environmentId === environmentId)?.label ??
    environmentId;
  const canRun = !running && instanceIds.size > 0 && destinationIds.size > 0;

  const runSync = async () => {
    setRunning(true);
    const result = await sync({
      sourceEnvironmentId: source.environmentId,
      instanceIds: [...instanceIds],
      destinationEnvironmentIds: [...destinationIds],
    });
    setRunning(false);
    // The command never fails as a whole; an interruption leaves the report as it was.
    if (result._tag === "Success") setReport(result.value);
  };
  const openOn = (environmentId: EnvironmentId, instanceId: ProviderInstanceId) => {
    props.onOpenChange(false);
    void navigate({ to: "/settings/providers", search: { environmentId, instanceId } });
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <WizardPopup size="wide">
        <WizardHeader
          title={t("Sync accounts")}
          description={
            report === null
              ? t(
                  "Settings and API keys are copied from {device}. Sign-ins are not: each device signs in on its own, and a Cursor sign-in travels as an API key. Paths stay on {device}.",
                ).replaceAll("{device}", () => source.label)
              : t("Sync again at any time; it updates the copies without duplicating them.")
          }
        />
        <WizardPanel>
          {report === null ? (
            <>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {t("Accounts on {device}").replace("{device}", () => source.label)}
                </p>
                {accounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("No configured or signed-in accounts on {device}.").replace(
                      "{device}",
                      () => source.label,
                    )}
                  </p>
                ) : (
                  accounts.map((account) => (
                    <ChoiceRow
                      key={account.instanceId}
                      checked={instanceIds.has(account.instanceId)}
                      title={account.label}
                      description={
                        account.signedInAs
                          ? t("Signed in as {account}").replace(
                              "{account}",
                              () => account.signedInAs ?? "",
                            )
                          : null
                      }
                      onCheckedChange={(checked) =>
                        setInstanceIds((current) => toggled(current, account.instanceId, checked))
                      }
                    />
                  ))
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{t("Copy to")}</p>
                {plan.destinations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("Connect another device to sync accounts to it.")}
                  </p>
                ) : (
                  plan.destinations.map((destination) => (
                    <ChoiceRow
                      key={destination.environmentId}
                      checked={destinationIds.has(destination.environmentId)}
                      disabled={destination.block !== null || plan.sourceBlock !== null}
                      title={destination.label}
                      description={destinationNote(plan, destination, source.label)}
                      onCheckedChange={(checked) =>
                        setDestinationIds((current) =>
                          toggled(current, destination.environmentId, checked),
                        )
                      }
                    />
                  ))
                )}
              </div>
            </>
          ) : (
            report.cells.map((cell) => (
              <SyncedAccountRow
                key={`${cell.instanceId}:${cell.destinationEnvironmentId}`}
                cell={cell}
                accountLabel={accountLabel(cell.instanceId)}
                sourceLabel={source.label}
                destinationLabel={destinationLabel(cell.destinationEnvironmentId)}
                onOpen={() => openOn(cell.destinationEnvironmentId, cell.instanceId)}
              />
            ))
          )}
        </WizardPanel>
        <WizardFooter>
          {report === null ? (
            <>
              <Button size="sm" variant="ghost" onClick={() => props.onOpenChange(false)}>
                {t("Cancel")}
              </Button>
              <Button size="sm" disabled={!canRun} onClick={() => void runSync()}>
                {running ? t("Syncing…") : t("Sync")}
              </Button>
            </>
          ) : (
            <>
              {report.cells.some((cell) => cell.status === "failed") ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={running}
                  onClick={() => void runSync()}
                >
                  {t("Retry")}
                </Button>
              ) : null}
              <Button size="sm" onClick={() => props.onOpenChange(false)}>
                {t("Done")}
              </Button>
            </>
          )}
        </WizardFooter>
      </WizardPopup>
    </Dialog>
  );
}

export function SyncProviderAccountsAction({
  sourceEnvironmentId,
  readOnly,
  instanceIds,
}: {
  readonly sourceEnvironmentId: EnvironmentId;
  readonly readOnly: boolean;
  readonly instanceIds?: ReadonlyArray<ProviderInstanceId>;
}) {
  const t = useTranslate();
  const [open, setOpen] = useState(false);
  const { environments } = useEnvironments();
  const canExport = useAtomValue(providerAccountSync.canExportAtom(sourceEnvironmentId));
  const source = environments.find(
    (environment: EnvironmentPresentation) => environment.environmentId === sourceEnvironmentId,
  );
  const hasDestinations = environments.some(
    (environment) => environment.environmentId !== sourceEnvironmentId,
  );
  if (
    readOnly ||
    !canExport ||
    !hasDestinations ||
    source === undefined ||
    !supportsProviderAccountSync(source)
  )
    return null;
  const dialog = open ? (
    <SyncProviderAccountsDialog
      open
      onOpenChange={setOpen}
      sourceEnvironmentId={sourceEnvironmentId}
      initialInstanceIds={instanceIds ?? []}
    />
  ) : null;
  if (instanceIds !== undefined) {
    return (
      <>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                onClick={() => setOpen(true)}
                aria-label={t("Sync this account to another device")}
              >
                <ArrowLeftRightIcon />
              </Button>
            }
          />
          <TooltipPopup side="top">{t("Sync to…")}</TooltipPopup>
        </Tooltip>
        {dialog}
      </>
    );
  }
  const search = searchableSetting("provider-account-sync");
  return (
    <>
      <SettingsSearchTarget id={search.id} className="inline-flex">
        <Button size="xs" variant="ghost-muted" onClick={() => setOpen(true)}>
          <ArrowLeftRightIcon />
          <span className="hidden sm:inline">{t("Sync accounts")}</span>
        </Button>
      </SettingsSearchTarget>
      {dialog}
    </>
  );
}
