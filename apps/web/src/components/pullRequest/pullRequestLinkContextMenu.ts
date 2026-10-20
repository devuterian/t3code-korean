import type { ContextMenuItem } from "@t3tools/contracts";
import {
  type SourceControlClientDefinition,
  UNKNOWN_SOURCE_CONTROL_CLIENT,
} from "@t3tools/client-runtime/source-control-clients";

import { writeTextToClipboard } from "~/hooks/useCopyToClipboard";
import { translate } from "~/i18n/translate";
import { readLocalApi } from "~/localApi";

import { toastManager } from "../ui/toast";

export type PullRequestLinkContextMenuAction = "copy-link" | "open-external";

export const openOnHostLabel = (host: SourceControlClientDefinition): string =>
  host === UNKNOWN_SOURCE_CONTROL_CLIENT
    ? translate("Open on host")
    : translate(`Open on ${host.label}`);

function pullRequestLinkContextMenuItems(
  openLabel: string,
): readonly ContextMenuItem<PullRequestLinkContextMenuAction>[] {
  return [
    { id: "copy-link", label: translate("Copy link"), icon: "copy" },
    { id: "open-external", label: openLabel },
  ];
}

export async function showPullRequestLinkContextMenu({
  url,
  openLabel,
  position,
}: {
  readonly url: string;
  readonly openLabel: string;
  readonly position: { readonly x: number; readonly y: number };
}): Promise<void> {
  const api = readLocalApi();
  if (!api) return;
  let action: PullRequestLinkContextMenuAction | null = null;
  try {
    action = await api.contextMenu.show(pullRequestLinkContextMenuItems(openLabel), position);
  } catch {
    return;
  }
  try {
    if (action === "copy-link") await writeTextToClipboard(url, "link");
    else if (action === "open-external") await api.shell.openExternal(url);
  } catch {
    toastManager.add({
      type: "error",
      title:
        action === "copy-link"
          ? translate("Could not copy the link")
          : translate("Could not open the link"),
    });
  }
}
