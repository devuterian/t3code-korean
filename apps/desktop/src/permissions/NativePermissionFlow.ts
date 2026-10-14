// @effect-diagnostics nodeBuiltinImport:off -- Launches the bundled Swift PermissionFlow helper.
// @effect-diagnostics globalTimers:off -- Poll TCC only while the native permission helper is open.
import * as NodeChildProcess from "node:child_process";
import * as Electron from "electron";

import type { MacPermission } from "./MacPermission.ts";
import { macAppBundlePath } from "./MacPermissionHelper.ts";

/**
 * Fork-only: runs `resources/permission-flow/t3-permission-flow`, which shows
 * PermissionFlow's floating "drag T3 Code into the list" panel over System
 * Settings. The helper is our child, so TCC grants land on the app itself.
 * One helper at a time; closing kills it.
 */
export class NativePermissionFlow {
  private child: NodeChildProcess.ChildProcess | undefined;
  private timer: ReturnType<typeof setInterval> | undefined;

  private readonly executable: string;

  constructor(executable: string) {
    this.executable = executable;
  }

  close() {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    this.child?.kill();
    this.child = undefined;
  }

  async show(
    permission: MacPermission,
    owner: Electron.BrowserWindow | null,
    isGranted: () => boolean | Promise<boolean>,
  ) {
    this.close();
    if (await isGranted()) return;
    const bundle = macAppBundlePath(Electron.app.getPath("exe"));
    if (!bundle) return;
    // stdin stays open as a lifeline: the helper exits on EOF if we die.
    const child = NodeChildProcess.spawn(
      this.executable,
      ["authorize", "--pane", permission, "--app", bundle],
      { stdio: ["pipe", "ignore", "ignore"] },
    );
    this.child = child;
    let granted = false;
    let checking = false;
    const timer = setInterval(async () => {
      if (checking) return;
      checking = true;
      try {
        if (await isGranted()) {
          granted = true;
          child.kill();
        }
      } catch {
        // An unavailable probe is not evidence of a grant.
      } finally {
        checking = false;
      }
    }, 1_000);
    this.timer = timer;
    const onOwnerClosed = () => child.kill();
    owner?.once("closed", onOwnerClosed);
    const cleanup = () => {
      clearInterval(timer);
      owner?.removeListener("closed", onOwnerClosed);
      if (this.child === child) {
        this.child = undefined;
        this.timer = undefined;
      }
    };
    child.once("error", cleanup);
    child.once("exit", (code) => {
      cleanup();
      if ((granted || code === 0) && owner && !owner.isDestroyed()) {
        owner.show();
        owner.focus();
      }
    });
  }
}
