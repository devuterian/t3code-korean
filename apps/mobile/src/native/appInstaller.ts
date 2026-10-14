import { requireOptionalNativeModule } from "expo";

/** Android-only bridge to modules/t3-app-installer. Null on iOS and in builds without it. */
export const AppInstaller = requireOptionalNativeModule<{
  getAppVersion(): { readonly versionName: string; readonly versionCode: number };
  canRequestPackageInstalls(): boolean;
  openInstallPermissionSettings(): void;
  /** `fileUri` must point into `cacheDir/app-updates/`. */
  installApk(fileUri: string): void;
  /** Lowercase hex SHA-256 of a file in `cacheDir/app-updates/`, hashed off the JS thread. */
  sha256File?(fileUri: string): Promise<string>;
}>("T3AppInstaller");
