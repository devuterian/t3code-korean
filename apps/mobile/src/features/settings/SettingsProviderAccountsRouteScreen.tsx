import {
  isAtomCommandInterrupted,
  squashAtomCommandFailure,
  type AtomCommandResult,
} from "@t3tools/client-runtime/state/runtime";
import type { ProviderAuthResponse, ServerProvider } from "@t3tools/contracts";
import { useRef, useState } from "react";
import { Alert, Linking, Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText as Text } from "../../components/AppText";
import { ScreenScrollView } from "../../components/ScreenScrollView";
import { useEnvironmentQuery } from "../../state/query";
import { serverEnvironment } from "../../state/server";
import { useAtomCommand } from "../../state/use-atom-command";
import { SettingsActionRow } from "./components/SettingsActionRow";
import {
  AndroidSettingsEnvironmentFilter,
  SettingsEnvironmentFilterHeader,
} from "./components/SettingsEnvironmentFilterHeader";
import { SettingsScreen } from "./components/SettingsScreen";
import { SettingsSection } from "./components/SettingsSection";
import { useSettingsEnvironmentFilter, type SettingsTarget } from "./settings-environment-filter";
import { useTranslate } from "../../i18n/translate";

export function SettingsProviderAccountsRouteScreen() {
  const t = useTranslate();
  const { selectedTargets } = useSettingsEnvironmentFilter();
  const insets = useSafeAreaInsets();
  return (
    <>
      <SettingsEnvironmentFilterHeader />
      <SettingsScreen
        title={t("Provider accounts")}
        trailing={<AndroidSettingsEnvironmentFilter />}
      >
        <ScreenScrollView
          className="flex-1"
          contentInsetAdjustmentBehavior="automatic"
          contentContainerClassName="gap-6 px-5 pt-4"
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 18) + 18 }}
        >
          {selectedTargets.length === 0 ? (
            <Text className="text-foreground-muted">{t("Select a connected environment.")}</Text>
          ) : (
            selectedTargets.map((environment) => (
              <SettingsSection key={environment.environmentId} title={environment.label}>
                {environment.serverConfig.providers
                  .filter(
                    (provider) =>
                      provider.setup?.canAuthenticate ||
                      (provider.driver === "acpRegistry" && provider.installed),
                  )
                  .map((provider) => (
                    <ProviderAccount
                      key={provider.instanceId}
                      environment={environment}
                      provider={provider}
                    />
                  ))}
                {!environment.serverConfig.providers.some(
                  (provider) =>
                    provider.setup?.canAuthenticate ||
                    (provider.driver === "acpRegistry" && provider.installed),
                ) ? (
                  <Text className="p-4 text-foreground-muted">
                    {t("Configure a provider with in-app sign-in in web or desktop Settings.")}
                  </Text>
                ) : null}
              </SettingsSection>
            ))
          )}
        </ScreenScrollView>
      </SettingsScreen>
    </>
  );
}

function ProviderAccount({
  environment,
  provider,
}: {
  readonly environment: SettingsTarget;
  readonly provider: ServerProvider;
}) {
  const t = useTranslate();
  const environmentId = environment.environmentId;
  const instanceId = provider.instanceId;
  const target = { environmentId, input: { instanceId } };
  const auth = useEnvironmentQuery(serverEnvironment.providerAuthState(target));
  const options = { reportFailure: false, reportDefect: false };
  const start = useAtomCommand(serverEnvironment.startProviderAuth, options);
  const respond = useAtomCommand(serverEnvironment.respondProviderAuth, options);
  const complete = useAtomCommand(serverEnvironment.completeProviderAuth, options);
  const cancel = useAtomCommand(serverEnvironment.cancelProviderAuth, options);
  const logout = useAtomCommand(serverEnvironment.logoutProviderAuth, options);
  const [pending, setPending] = useState(false);
  const [choosingMethod, setChoosingMethod] = useState(false);
  const pendingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState({ id: "", values: {} as Record<string, string> });
  const state = auth.data;
  const interaction = state?.interaction;
  const draftId = `${state?.flowId ?? ""}:${interaction?.id ?? ""}`;
  const values = draft.id === draftId ? draft.values : {};
  const active =
    state?.phase === "starting" || state?.phase === "waiting" || state?.phase === "verifying";
  const signedIn =
    provider.auth.status === "authenticated" ||
    (provider.auth.status === "unknown" && state?.phase === "succeeded");
  const isDiscovering =
    provider.driver === "acpRegistry" &&
    !active &&
    !signedIn &&
    !auth.error &&
    state?.methods === undefined;
  const needsExternalSetup =
    !active &&
    !signedIn &&
    (provider.setup?.canAuthenticate === false ||
      (provider.driver === "acpRegistry" && state?.methods?.length === 0));
  const url =
    interaction?.type === "browser" || interaction?.type === "deviceCode"
      ? interaction.url
      : state?.authorizationUrl;
  const disabled = pending || auth.error !== null || isDiscovering;
  async function run(command: () => Promise<AtomCommandResult<unknown, unknown>>) {
    if (pendingRef.current) return false;
    pendingRef.current = true;
    setPending(true);
    setError(null);
    let succeeded = false;
    try {
      const result = await command();
      if (result._tag === "Success") succeeded = true;
      else if (!isAtomCommandInterrupted(result)) {
        const failure = squashAtomCommandFailure(result);
        setError(
          failure instanceof Error ? failure.message : t("Could not update provider sign-in."),
        );
      }
    } catch {
      setError(t("Could not update provider sign-in."));
    }
    pendingRef.current = false;
    setPending(false);
    return succeeded;
  }
  function send(response: ProviderAuthResponse) {
    if (!state?.flowId || !interaction) return Promise.resolve(false);
    return run(() =>
      respond({
        environmentId,
        input: { instanceId, flowId: state.flowId!, interactionId: interaction.id, response },
      }),
    );
  }
  function field(name: string, label: string, secret: boolean) {
    return (
      <TextInput
        accessibilityLabel={label}
        className="rounded-lg border border-border-subtle px-3 py-2 text-base text-foreground"
        placeholderTextColorClassName="accent-foreground-muted"
        placeholder={label}
        secureTextEntry={secret}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!disabled}
        maxLength={secret && interaction?.type === "terminal" ? 4_095 : 16_384}
        value={values[name] ?? ""}
        onChangeText={(value) => setDraft({ id: draftId, values: { ...values, [name]: value } })}
      />
    );
  }
  function chooseMethod() {
    const methods = state?.methods ?? [];
    if (methods.length <= 1) {
      void run(() => start(target));
      return;
    }
    setChoosingMethod(true);
  }
  return (
    <View className="border-b border-border-subtle">
      <View className="gap-2 p-4">
        <Text className="text-lg font-semibold text-foreground">
          {provider.displayName ?? provider.driver}
        </Text>
        <Text accessibilityLiveRegion="polite" className="text-sm text-foreground-muted">
          {active || state?.phase === "failed" || state?.phase === "cancelled"
            ? state.message
            : signedIn
              ? t("Signed in.")
              : isDiscovering
                ? t("Discovering sign-in methods…")
                : needsExternalSetup
                  ? t("No in-app sign-in advertised. Follow the provider's docs to finish setup.")
                  : t("Connect this provider.")}
        </Text>
        {signedIn && !active && provider.auth.email?.trim() ? (
          <ProviderAccountEmail key={provider.auth.email} email={provider.auth.email} />
        ) : null}
        {interaction?.type === "deviceCode" ? (
          <Text selectable className="text-foreground">
            {t("Enter code {code} on the sign-in page.", { code: interaction.userCode })}
          </Text>
        ) : null}
        {interaction?.type === "terminal" ? (
          <>
            <ScrollView className="max-h-64" nestedScrollEnabled>
              <Text selectable className="font-mono text-sm text-foreground">
                {interaction.output.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "")}
              </Text>
            </ScrollView>
            {field("input", t("Terminal response"), true)}
            <SettingsActionRow
              icon="arrow.up"
              label={t("Send response")}
              disabled={disabled}
              onPress={() => {
                void send({ type: "terminal", data: `${values.input ?? ""}\r` }).then((sent) => {
                  if (sent) setDraft({ id: "", values: {} });
                });
              }}
            />
          </>
        ) : null}
        {interaction?.type === "credentials" ? (
          <>
            {interaction.fields.map((entry) => (
              <View key={entry.name}>{field(entry.name, entry.label, entry.secret)}</View>
            ))}
            <SettingsActionRow
              icon="person.crop.circle"
              label={t("Connect")}
              disabled={disabled}
              onPress={() => {
                void send({ type: "credentials", values }).then((sent) => {
                  if (sent) setDraft({ id: "", values: {} });
                });
              }}
            />
          </>
        ) : null}
        {url && (interaction?.type === "browser" ? interaction.acceptsCallback : !interaction) ? (
          <>
            {field("callback", t("Final localhost URL"), false)}
            <SettingsActionRow
              icon="arrow.right"
              label={t("Continue")}
              disabled={disabled || !values.callback?.trim()}
              onPress={() => {
                if (!state?.flowId) return;
                void run(() =>
                  complete({
                    environmentId,
                    input: { instanceId, flowId: state.flowId!, callbackUrl: values.callback! },
                  }),
                ).then((sent) => {
                  if (sent) setDraft({ id: "", values: {} });
                });
              }}
            />
          </>
        ) : null}
        {error || auth.error ? (
          <Text accessibilityRole="alert" className="text-danger-foreground">
            {error ?? auth.error}
          </Text>
        ) : null}
      </View>
      {choosingMethod && !active ? (
        <View>
          {state?.methods?.map((method) => (
            <SettingsActionRow
              key={method.id}
              icon="person.crop.circle"
              label={method.name}
              disabled={disabled}
              onPress={() => {
                setChoosingMethod(false);
                void run(() =>
                  start({ environmentId, input: { instanceId, methodId: method.id } }),
                );
              }}
            />
          ))}
          <SettingsActionRow
            icon="xmark"
            label={t("Cancel")}
            onPress={() => setChoosingMethod(false)}
          />
        </View>
      ) : null}
      {url ? (
        <SettingsActionRow
          icon="globe"
          label={t("Open sign-in page")}
          disabled={disabled}
          onPress={() => {
            void (async () => {
              if (
                interaction?.type === "browser" &&
                interaction.requiresConsent &&
                !(await send({ type: "browser", action: "accept" }))
              )
                return;
              await Linking.openURL(url);
            })().catch(() => setError(t("Could not open the sign-in page.")));
          }}
        />
      ) : null}
      {needsExternalSetup && provider.setup?.documentationUrl ? (
        <SettingsActionRow
          icon="globe"
          label={t("Open docs")}
          onPress={() => {
            void Linking.openURL(provider.setup!.documentationUrl!).catch(() =>
              setError(t("Could not open the provider docs.")),
            );
          }}
        />
      ) : active && state?.flowId ? (
        <SettingsActionRow
          icon="xmark"
          label={t("Cancel sign-in")}
          disabled={disabled}
          onPress={() => {
            void run(() => cancel({ environmentId, input: { instanceId, flowId: state.flowId! } }));
          }}
        />
      ) : !active && !needsExternalSetup && provider.setup?.canAuthenticate !== false ? (
        <SettingsActionRow
          icon="person.crop.circle"
          label={signedIn ? t("Change account") : t("Sign in")}
          disabled={disabled || !provider.enabled || !provider.installed || state === null}
          loading={pending}
          onPress={chooseMethod}
        />
      ) : null}
      {!active && signedIn && (provider.auth.canLogout ?? provider.setup?.canAuthenticate) ? (
        <SettingsActionRow
          icon="person.crop.circle"
          label={t("Sign out")}
          tone="danger"
          disabled={disabled || state === null}
          onPress={() =>
            Alert.alert(
              t("Sign out?"),
              t(
                "Running threads sharing this sign-in on {environment} will stop. Thread history is kept.",
                { environment: environment.label },
              ),
              [
                { text: t("Cancel"), style: "cancel" },
                {
                  text: t("Sign out"),
                  style: "destructive",
                  onPress: () => {
                    void run(() => logout(target));
                  },
                },
              ],
            )
          }
        />
      ) : null}
    </View>
  );
}

function ProviderAccountEmail({ email }: { readonly email: string }) {
  const t = useTranslate();
  const [revealed, setRevealed] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={revealed ? t("Hide account email") : t("Reveal account email")}
      onPress={() => setRevealed((value) => !value)}
      className="min-h-[44px] justify-center"
    >
      <Text className="text-sm text-foreground-muted">{revealed ? email : "••••••@••••••"}</Text>
    </Pressable>
  );
}
