import { RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";

import { ElectronBrowserHost } from "./browser/ElectronBrowserHost";
import { QuitHoldOverlay } from "./components/QuitHoldOverlay";
import { useClientSettings, useClientSettingsHydrated } from "./hooks/useSettings";
import { I18nProvider } from "./i18n/I18nProvider";
import { markInterfaceLanguageConfigured, setInterfaceLanguage } from "./i18n/translate";
import { AppAtomRegistryProvider } from "./rpc/atomRegistry";
import type { AppRouter } from "./router";

function InterfaceLanguageBootstrap() {
  const interfaceLanguage = useClientSettings((settings) => settings.interfaceLanguage);
  const settingsHydrated = useClientSettingsHydrated();

  // oxlint-disable-next-line t3code/no-unreasoned-state-sync -- Pushes the hydrated interface language into the module-level translator that non-React code reads.
  useEffect(() => {
    if (!settingsHydrated) return;
    setInterfaceLanguage(interfaceLanguage);
    markInterfaceLanguageConfigured();
  }, [interfaceLanguage, settingsHydrated]);

  return null;
}

/**
 * The Electron browser host intentionally sits outside the router so its
 * webviews survive route transitions, but it must share the same atom registry
 * as routed UI.
 */
export function AppRoot({ router }: { readonly router: AppRouter }) {
  return (
    <I18nProvider>
      <AppAtomRegistryProvider>
        <InterfaceLanguageBootstrap />
        <RouterProvider router={router} />
        <ElectronBrowserHost />
        <QuitHoldOverlay />
      </AppAtomRegistryProvider>
    </I18nProvider>
  );
}
