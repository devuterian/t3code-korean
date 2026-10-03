import type { ExecutionEnvironmentPlatformOs, FileManagerRevealKind } from "@t3tools/contracts";

import { translate } from "~/i18n/translate";

export function revealInFileExplorerLabel(platform: string): string {
  const normalized = platform.toLowerCase();
  if (normalized.includes("mac")) return translate("Reveal in Finder");
  if (normalized.includes("win")) return translate("Reveal in File Explorer");
  return translate("Reveal in Files");
}

/** Same wording keyed by an environment's reported OS rather than a
    navigator platform string, for actions that reveal on the server machine. */
export function revealInFileExplorerLabelForOs(os: ExecutionEnvironmentPlatformOs): string {
  if (os === "darwin") return translate("Reveal in Finder");
  if (os === "windows") return translate("Reveal in File Explorer");
  return translate("Reveal in Files");
}

/** Server-selected wording, including Windows File Explorer reached from WSL. */
export function revealInFileExplorerLabelForKind(kind: FileManagerRevealKind): string {
  if (kind === "finder") return translate("Reveal in Finder");
  if (kind === "file-explorer") return translate("Reveal in File Explorer");
  return translate("Reveal in Files");
}
