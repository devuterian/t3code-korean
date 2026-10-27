import { createFileRoute } from "@tanstack/react-router";

import { ProviderPoolsSettings } from "../components/settings/ProviderPoolsSettings";
import { useSettingsScope } from "../components/settings/SettingsScopeContext";
import { useTranslate } from "../i18n/translate";

function SettingsAccountPoolsRoute() {
  const { environment, scope } = useSettingsScope();
  const t = useTranslate();
  if (!environment) {
    return (
      <p className="p-8 text-sm text-muted-foreground">
        {scope.kind === "environment"
          ? t("Reconnect {environment} to set up its account pools.").replace(
              "{environment}",
              () => scope.label,
            )
          : t("Connect an environment to set up its account pools.")}
      </p>
    );
  }
  return <ProviderPoolsSettings environmentId={environment.environmentId} />;
}

export const Route = createFileRoute("/_chat/settings/account-pools")({
  component: SettingsAccountPoolsRoute,
});
