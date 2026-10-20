import type { MacPermissionId, MacPermissionStatuses } from "@t3tools/contracts";
import { useLocation } from "@tanstack/react-router";
import { BellIcon, CameraIcon, CircleCheckIcon, HardDriveIcon, MicIcon } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from "react";

import { APP_VERSION } from "../../branding";
import {
  persistClientSettingsUpdate,
  useClientSettings,
  useClientSettingsHydrated,
  updateClientSettings,
} from "../../hooks/useSettings";
import { useTranslate } from "../../i18n/translate";
import { MacAccessibilityIcon, MacScreenRecordingIcon } from "../Icons";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { WizardFooter, WizardHeader, WizardPanel, WizardPopup } from "../ui/wizard";
import {
  completedMacPermissionsOnboarding,
  MAC_PERMISSION_ORDER,
  macPermissionsAutoOpenReason,
  nextMacPermissionToRequest,
} from "./macPermissionsOnboarding.logic";
import { usePermissionStatus } from "./usePermissionStatus";

type OpenReason = "first-run" | "lost" | "manual";

const ICON_CLASS = "size-8 shrink-0 drop-shadow-sm";
const LUCIDE_ICON_CLASS = "size-8 shrink-0 p-1 text-muted-foreground";

const PERMISSION_COPY: Record<
  MacPermissionId,
  { readonly title: string; readonly description: string; readonly icon: ReactNode }
> = {
  notifications: {
    title: "Notifications",
    description: "Get an alert when a turn finishes or a thread needs you.",
    icon: <BellIcon className={LUCIDE_ICON_CLASS} aria-hidden="true" />,
  },
  microphone: {
    title: "Microphone",
    description: "Dictate messages by voice.",
    icon: <MicIcon className={LUCIDE_ICON_CLASS} aria-hidden="true" />,
  },
  camera: {
    title: "Camera",
    description: "Let device and preview tools use the camera.",
    icon: <CameraIcon className={LUCIDE_ICON_CLASS} aria-hidden="true" />,
  },
  "screen-recording": {
    title: "Screen Recording",
    description: "Capture other app windows with the window capture shortcut.",
    icon: <MacScreenRecordingIcon className={ICON_CLASS} />,
  },
  accessibility: {
    title: "Accessibility",
    description: "Include on-screen text in captures and let agents control apps.",
    icon: <MacAccessibilityIcon className={ICON_CLASS} />,
  },
  "full-disk-access": {
    title: "Full Disk Access",
    description: "Let agents read and edit files anywhere, including protected folders.",
    icon: <HardDriveIcon className={LUCIDE_ICON_CLASS} aria-hidden="true" />,
  },
};

/** Panes macOS never prompts for; the user flips a switch or drags the app in. */
const SETTINGS_PANE_PERMISSIONS = new Set<MacPermissionId>([
  "screen-recording",
  "accessibility",
  "full-disk-access",
]);

const openListeners = new Set<() => void>();

/** Whether this client can show the macOS permissions onboarding at all. */
export function canShowMacPermissionsOnboarding(): boolean {
  const bridge = typeof window === "undefined" ? undefined : window.desktopBridge;
  return Boolean(bridge?.getMacPermissions) && bridge?.getClientPlatform?.() === "darwin";
}

/** Reopens the onboarding from Settings or the command palette. */
export function openMacPermissionsOnboarding(): void {
  for (const listener of openListeners) listener();
}

/**
 * Fork-only, macOS desktop: asks for every privacy permission up front. Opens
 * once after first launch, again (once per app version) if a permission it
 * last saw granted is gone, and on demand.
 */
export function MacPermissionsOnboardingHost() {
  const hydrated = useClientSettingsHydrated();
  const onboarding = useClientSettings((settings) => settings.macPermissionsOnboarding);
  const pathname = useLocation({ select: (location) => location.pathname });
  const [open, setOpen] = useState<{ reason: OpenReason; statuses: MacPermissionStatuses } | null>(
    null,
  );
  const autoChecked = useRef(false);

  const openWith = useEffectEvent(async (reason: OpenReason | "auto") => {
    const statuses = await window.desktopBridge?.getMacPermissions?.().catch(() => null);
    if (!statuses) return;
    if (reason !== "auto") {
      setOpen({ reason, statuses });
      return;
    }
    const autoReason = macPermissionsAutoOpenReason({
      onboarding,
      statuses,
      appVersion: APP_VERSION,
    });
    if (autoReason) setOpen({ reason: autoReason, statuses });
  });

  useEffect(() => {
    if (!canShowMacPermissionsOnboarding()) return;
    const listener = () => void openWith("manual");
    openListeners.add(listener);
    return () => {
      openListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || autoChecked.current || pathname === "/welcome") return;
    if (!canShowMacPermissionsOnboarding()) return;
    autoChecked.current = true;
    void openWith("auto");
  }, [hydrated, pathname]);

  if (!open) return null;
  return (
    <MacPermissionsOnboardingDialog
      reason={open.reason}
      initialStatuses={open.statuses}
      onClose={() => setOpen(null)}
    />
  );
}

function MacPermissionsOnboardingDialog({
  reason,
  initialStatuses,
  onClose,
}: {
  readonly reason: OpenReason;
  readonly initialStatuses: MacPermissionStatuses;
  readonly onClose: () => void;
}) {
  const t = useTranslate();
  const notificationMode = useClientSettings((settings) => settings.notificationMode);
  const permission = usePermissionStatus(async () => {
    const statuses = await window.desktopBridge?.getMacPermissions?.();
    if (!statuses) throw new Error("Permission status unavailable");
    return statuses;
  }, initialStatuses);
  const statuses = permission.status;
  // Notifications cannot be read back, so remember the test was sent.
  const [notificationSent, setNotificationSent] = useState(false);
  const shownStatuses: MacPermissionStatuses = notificationSent
    ? { ...statuses, notifications: "granted" }
    : statuses;
  const [walk, setWalk] = useState<{
    current: MacPermissionId | null;
    asked: ReadonlySet<MacPermissionId>;
  } | null>(null);
  const [busy, setBusy] = useState<MacPermissionId | null>(null);
  const advancing = useRef(false);

  const sendTestNotification = async () => {
    if (typeof Notification === "undefined") return;
    // The first notification triggers macOS's own Allow prompt.
    if ((await Notification.requestPermission()) !== "granted") return;
    const notification = new Notification(t("T3 Code notifications are on"), {
      body: t("You'll get an alert like this when a turn finishes."),
      silent: true,
    });
    notification.addEventListener("click", () => window.focus());
    setNotificationSent(true);
    if (notificationMode === "off")
      void updateClientSettings({ notificationMode: "notifications" });
  };

  const request = async (id: MacPermissionId) => {
    setBusy(id);
    try {
      if (id === "notifications" && !notificationSent) await sendTestNotification();
      else await window.desktopBridge?.requestMacPermission?.(id);
    } catch {
      // The row stays actionable; the user can try again.
    } finally {
      setBusy(null);
    }
  };

  // "Allow all": ask for each missing permission in order. System prompts
  // resolve on their own; Settings panes wait for the grant or "Next".
  const advance = useEffectEvent(async (asked: ReadonlySet<MacPermissionId>) => {
    if (advancing.current) return;
    advancing.current = true;
    try {
      await advanceFrom(asked);
    } finally {
      advancing.current = false;
    }
  });
  const advanceFrom = async (asked: ReadonlySet<MacPermissionId>): Promise<void> => {
    const fresh = (await window.desktopBridge?.getMacPermissions?.().catch(() => null)) ?? statuses;
    const current = nextMacPermissionToRequest(
      notificationSent ? { ...fresh, notifications: "granted" } : fresh,
      asked,
    );
    if (!current) {
      setWalk(null);
      return;
    }
    const nextAsked = new Set(asked).add(current);
    setWalk({ current, asked: nextAsked });
    await request(current);
    if (!SETTINGS_PANE_PERMISSIONS.has(current)) await advanceFrom(nextAsked);
  };

  useEffect(() => {
    if (walk?.current && statuses[walk.current] === "granted") void advance(walk.asked);
  }, [statuses, walk]);

  const close = () => {
    void persistClientSettingsUpdate((current) => ({
      ...current,
      macPermissionsOnboarding: completedMacPermissionsOnboarding({
        previous: current.macPermissionsOnboarding,
        statuses,
        appVersion: APP_VERSION,
        reason,
        now: new Date().toISOString(),
      }),
    })).catch(() => undefined);
    onClose();
  };

  const allGranted = MAC_PERMISSION_ORDER.every((id) => shownStatuses[id] === "granted");
  const waitingOn =
    walk?.current && SETTINGS_PANE_PERMISSIONS.has(walk.current) ? walk.current : null;

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) close();
      }}
    >
      <WizardPopup>
        <WizardHeader
          title={t("Allow T3 Code permissions")}
          description={t(
            reason === "lost"
              ? "Some permissions were turned off, often after an app update. Allow them again to keep everything working."
              : "Allow these now so agents and capture don't stop to ask later. You can change them anytime in System Settings.",
          )}
        />
        <WizardPanel>
          <div className="space-y-2 text-sm">
            {MAC_PERMISSION_ORDER.map((id) => {
              const copy = PERMISSION_COPY[id];
              const status = shownStatuses[id];
              return (
                <div key={id} className="flex items-center gap-3 rounded-lg border px-3 py-2">
                  {copy.icon}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{t(copy.title)}</p>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        waitingOn === id
                          ? "Drag T3 Code into the list in System Settings, or turn on its switch."
                          : copy.description,
                      )}
                    </p>
                  </div>
                  {status === "granted" ? (
                    id === "notifications" ? (
                      <Button size="xs" variant="ghost" onClick={() => void request(id)}>
                        {t("Open settings")}
                      </Button>
                    ) : (
                      <span role="status" className="flex items-center gap-1 text-xs text-success">
                        <CircleCheckIcon className="size-4" aria-hidden="true" />
                        {t("Allowed")}
                      </span>
                    )
                  ) : (
                    <Button
                      size="xs"
                      variant="outline"
                      disabled={busy !== null}
                      onClick={() => void request(id)}
                    >
                      {t(status === "denied" ? "Open settings" : "Allow")}
                    </Button>
                  )}
                </div>
              );
            })}
            {permission.error ? (
              <p role="status" className="text-xs text-muted-foreground">
                {t(permission.error)}
              </p>
            ) : null}
          </div>
        </WizardPanel>
        <WizardFooter
          leading={
            allGranted ? null : (
              <Button variant="ghost" onClick={close}>
                {t("Later")}
              </Button>
            )
          }
        >
          {allGranted ? (
            <Button onClick={close}>{t("Done")}</Button>
          ) : waitingOn ? (
            <Button onClick={() => walk && void advance(walk.asked)}>{t("Next")}</Button>
          ) : (
            <Button disabled={busy !== null} onClick={() => void advance(new Set())}>
              {t("Allow all")}
            </Button>
          )}
        </WizardFooter>
      </WizardPopup>
    </Dialog>
  );
}
