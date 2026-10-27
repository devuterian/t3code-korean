import { RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";

import { subscribeComposerDraftModelReconciliation } from "./composerDraftStore";
import { environmentThreadShells } from "./state/threads";
import { environmentShell } from "./state/shell";

import { ElectronBrowserHost } from "./browser/ElectronBrowserHost";
import { QuitHoldOverlay } from "./components/QuitHoldOverlay";
import { useClientSettings, useClientSettingsHydrated } from "./hooks/useSettings";
import { markInterfaceLanguageConfigured, setInterfaceLanguage } from "./i18n/translate";
import { appAtomRegistry, AppAtomRegistryProvider } from "./rpc/atomRegistry";
import type { AppRouter } from "./router";

function InterfaceLanguageBootstrap() {
  const interfaceLanguage = useClientSettings((settings) => settings.interfaceLanguage);
  const settingsHydrated = useClientSettingsHydrated();

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
  useEffect(
    () =>
      subscribeComposerDraftModelReconciliation({
        registry: appAtomRegistry,
        threadShellAtom: environmentThreadShells.threadShellAtom,
        threadRefsAtom: environmentThreadShells.threadRefsAtom,
        shellStateAtom: environmentShell.stateAtom,
      }),
    [],
  );
  return (
    <AppAtomRegistryProvider>
      <InterfaceLanguageBootstrap />
      <RouterProvider router={router} />
      <ElectronBrowserHost />
      <QuitHoldOverlay />
    </AppAtomRegistryProvider>
  );
}
