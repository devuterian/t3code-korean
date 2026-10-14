import type { MacPermissionId, MacPermissionStatuses } from "@t3tools/contracts";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Path from "effect/Path";
import * as Electron from "electron";
import * as DesktopEnvironment from "../app/DesktopEnvironment.ts";
import {
  MAC_MEDIA_SETTINGS_URLS,
  macNotificationSettingsUrl,
  probeFullDiskAccess,
  readMacPermissionStatuses,
} from "./MacPermissionAccess.ts";
import { macAppBundlePath, MacPermissionHelper } from "./MacPermissionHelper.ts";
import { MAC_PERMISSION_SETTINGS_URLS, type MacPermission } from "./MacPermission.ts";
import { NativePermissionFlow } from "./NativePermissionFlow.ts";

export class MacPermissions extends Context.Service<
  MacPermissions,
  {
    readonly showHelper: (
      permission: MacPermission,
      owner: Electron.BrowserWindow | null,
      isGranted?: () => boolean | Promise<boolean>,
    ) => Effect.Effect<void>;
    /** Fork-only: every onboarding permission's state; null off macOS. */
    readonly readStatuses: Effect.Effect<MacPermissionStatuses | null>;
    /** Fork-only: prompt for one permission, or open its pane with the drag helper. */
    readonly request: (
      permission: MacPermissionId,
      owner: Electron.BrowserWindow | null,
    ) => Effect.Effect<void>;
  }
>()("@t3tools/desktop/permissions/MacPermissions") {}

const defaultGrantCheck = (permission: MacPermission) => () => {
  if (permission === "screen-recording")
    return Electron.systemPreferences.getMediaAccessStatus("screen") === "granted";
  if (permission === "accessibility")
    return Electron.systemPreferences.isTrustedAccessibilityClient(false);
  return probeFullDiskAccess() === "granted";
};

const openUrl = (url: string) =>
  Effect.promise(() => Electron.shell.openExternal(url).catch(() => undefined));

export const layer = Layer.effect(
  MacPermissions,
  Effect.gen(function* () {
    const environment = yield* DesktopEnvironment.DesktopEnvironment;
    const path = yield* Path.Path;
    const fileSystem = yield* FileSystem.FileSystem;
    const helper = new MacPermissionHelper();
    // The packaged Swift helper (PermissionFlow) replaces the JS panel when present.
    const nativeExecutable = path.join(
      environment.resourcesPath,
      "permission-flow",
      "t3-permission-flow",
    );
    const native =
      environment.platform === "darwin" &&
      environment.isPackaged &&
      (yield* fileSystem.exists(nativeExecutable).pipe(Effect.orElseSucceed(() => false)))
        ? new NativePermissionFlow(nativeExecutable)
        : undefined;
    yield* Effect.addFinalizer(() =>
      Effect.sync(() => {
        helper.close();
        native?.close();
      }),
    );

    const showHelper = Effect.fn("MacPermissions.showHelper")(function* (
      permission: MacPermission,
      owner: Electron.BrowserWindow | null,
      isGranted?: () => boolean | Promise<boolean>,
    ) {
      if (environment.platform !== "darwin" || !environment.isPackaged) return;
      yield* Effect.tryPromise(() =>
        native
          ? native.show(permission, owner, isGranted ?? defaultGrantCheck(permission))
          : helper.show(
              permission,
              path.join(environment.dirname, "mac-permission-preload.cjs"),
              owner,
              environment.resolveResourcePathCandidates("icon.png"),
              isGranted,
            ),
      ).pipe(Effect.catch((cause) => Effect.logWarning("Could not show permission helper", cause)));
    });

    const openPaneWithHelper = Effect.fn("MacPermissions.openPaneWithHelper")(function* (
      permission: MacPermission,
      owner: Electron.BrowserWindow | null,
    ) {
      // The native helper opens the pane itself; the JS panel needs it open first.
      if (!native) yield* openUrl(MAC_PERMISSION_SETTINGS_URLS[permission]);
      yield* showHelper(permission, owner, defaultGrantCheck(permission));
    });

    return MacPermissions.of({
      showHelper,
      readStatuses: Effect.sync(() =>
        environment.platform === "darwin" ? readMacPermissionStatuses() : null,
      ),
      request: Effect.fn("MacPermissions.request")(function* (permission, owner) {
        if (environment.platform !== "darwin") return;
        const prefs = Electron.systemPreferences;
        switch (permission) {
          case "notifications":
            // The renderer sends a test notification to trigger the prompt;
            // this opens the app's Notifications page to change it later.
            yield* openUrl(
              macNotificationSettingsUrl(macAppBundlePath(Electron.app.getPath("exe"))),
            );
            return;
          case "microphone":
          case "camera": {
            const status = prefs.getMediaAccessStatus(permission);
            if (status === "granted") return;
            if (status === "not-determined") {
              yield* Effect.promise(() => prefs.askForMediaAccess(permission).catch(() => false));
              return;
            }
            yield* openUrl(MAC_MEDIA_SETTINGS_URLS[permission]);
            return;
          }
          case "screen-recording": {
            if (prefs.getMediaAccessStatus("screen") === "granted") return;
            if (prefs.getMediaAccessStatus("screen") === "not-determined") {
              // Capturing once registers the app and shows macOS's own prompt.
              yield* Effect.promise(() =>
                Electron.desktopCapturer
                  .getSources({ types: ["screen"], thumbnailSize: { width: 1, height: 1 } })
                  .catch(() => []),
              );
              if (prefs.getMediaAccessStatus("screen") === "granted") return;
            }
            yield* openPaneWithHelper("screen-recording", owner);
            return;
          }
          case "accessibility":
            // Prompting also adds the app to the list, switched off.
            if (prefs.isTrustedAccessibilityClient(true)) return;
            yield* openPaneWithHelper("accessibility", owner);
            return;
          case "full-disk-access":
            if (probeFullDiskAccess() === "granted") return;
            yield* openPaneWithHelper("full-disk-access", owner);
            return;
        }
      }),
    });
  }),
);
