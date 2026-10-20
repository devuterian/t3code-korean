import {
  formatFilePathForClipboard,
  type MediaActionId,
} from "@t3tools/client-runtime/media-actions";
import {
  mediaReferenceFileName,
  type MediaReference,
} from "@t3tools/client-runtime/media-reference";
import { resolveAssetUrl } from "@t3tools/client-runtime/state/assets";
import { settlePromise, squashAtomCommandFailure } from "@t3tools/client-runtime/state/runtime";
import {
  AuthFilesystemReadScope,
  type AssetResource,
  type ContextMenuItem,
  type EnvironmentId,
  sessionGrantsScope,
  type SessionGrantInput,
} from "@t3tools/contracts";
import * as Option from "effect/Option";
import { AsyncResult } from "effect/reactivity";
import { useRef, useState, type ReactElement } from "react";

import { useComposerHandleContext } from "../../composerHandleContext";
import { writeTextToClipboard } from "../../hooks/useCopyToClipboard";
import { translate } from "~/i18n/translate";
import { readLocalApi } from "../../localApi";
import { appAtomRegistry } from "../../rpc/atomRegistry";
import { assetEnvironment } from "../../state/assets";
import { useEnvironmentQuery } from "../../state/query";
import { environmentSession, readPreparedConnection } from "../../state/session";
import { useAtomQueryRunner } from "../../state/use-atom-query-runner";
import { stackedThreadToast, toastManager } from "../ui/toast";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
import { downloadMedia, readMediaPng, readVideoFrame } from "./mediaContent";

export interface MediaActionSource {
  readonly kind: "image" | "video";
  readonly name: string;
  readonly src: string | null;
  readonly reference?: MediaReference;
  readonly asset?: { readonly environmentId: EnvironmentId; readonly resource: AssetResource };
  readonly onOpenFile?: () => void;
  /** Receives a still of the paused frame, as a data URL, to cite a region from. */
  readonly onCiteFrame?: (still: { readonly src: string; readonly seconds: number }) => void;
}

function mediaFileName(source: MediaActionSource): string {
  return (
    (source.reference && mediaReferenceFileName(source.reference)) || source.name || source.kind
  );
}

function allowsHostMedia(session: SessionGrantInput | null) {
  return session === null || sessionGrantsScope(session, AuthFilesystemReadScope);
}

function canReadHostMedia(environmentId: EnvironmentId | null): boolean {
  if (environmentId === null) return true;
  const result = appAtomRegistry.get(environmentSession.sessionStateAtom(environmentId));
  return result._tag !== "Failure" && allowsHostMedia(Option.getOrNull(AsyncResult.value(result)));
}

/** Explicit byte operations get fresh capabilities without replacing a player's active source. */
export function useMediaActionUrl(source: MediaActionSource): () => Promise<string> {
  return useMediaActions(source).actionUrl;
}

export function useMediaActions(source: MediaActionSource) {
  const hostEnvironmentId =
    source.asset &&
    (source.asset.resource._tag === "workspace-file" || source.asset.resource._tag === "media-file")
      ? source.asset.environmentId
      : null;
  const fileSession = useEnvironmentQuery(
    hostEnvironmentId === null ? null : environmentSession.sessionStateAtom(hostEnvironmentId),
  );
  const canReadMedia =
    hostEnvironmentId === null ||
    (fileSession.error === null && fileSession.data !== null && allowsHostMedia(fileSession.data));
  const assertCanReadMedia = () => {
    if (!canReadHostMedia(hostEnvironmentId)) {
      throw new Error(translate("This connection cannot read host files."));
    }
  };
  const createAssetUrl = useAtomQueryRunner(assetEnvironment.createUrl, {
    reportFailure: false,
    refresh: true,
  });
  const actionUrl = async () => {
    assertCanReadMedia();
    if (!source.asset) {
      if (!source.src) {
        throw new Error(translate("This media is unavailable. Try reopening the preview."));
      }
      return source.src;
    }
    const { environmentId, resource } = source.asset;
    const connection = readPreparedConnection(environmentId);
    if (!connection) throw new Error(translate("Reconnect to this environment and try again."));
    const result = await createAssetUrl({ environmentId, input: { resource } });
    if (result._tag === "Failure") throw squashAtomCommandFailure(result);
    assertCanReadMedia();
    const url = resolveAssetUrl(connection.httpBaseUrl, result.value.relativeUrl);
    if (!url) throw new Error(translate("The environment returned an invalid media URL."));
    return url;
  };
  const save = async () => {
    await downloadMedia(await actionUrl(), mediaFileName(source));
  };
  const copyImage = async () => {
    assertCanReadMedia();
    if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
      throw new Error(
        translate(
          "Image copying is unavailable. Use a secure browser connection or save the image.",
        ),
      );
    }
    // Start the clipboard write in the user gesture; fetching/decoding may finish later.
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": actionUrl().then(readMediaPng) }),
    ]);
  };
  return { save, copyImage, actionUrl, canReadMedia, assertCanReadMedia };
}

export function MediaActions({
  source,
  children,
}: {
  source: MediaActionSource;
  children: ReactElement;
}) {
  const { save, copyImage, actionUrl, canReadMedia, assertCanReadMedia } = useMediaActions(source);
  const composerRef = useComposerHandleContext();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const menuOpen = useRef(false);
  const reference = source.reference;
  const tooltip = reference?.kind === "file" ? reference.path : (reference?.url ?? source.name);

  const showMenu = async (position: { x: number; y: number }, video: HTMLVideoElement | null) => {
    const api = readLocalApi();
    if (!api || menuOpen.current) return;
    menuOpen.current = true;
    setTooltipOpen(false);
    let failureTitle = translate("Could not open media menu");
    let progressToast: ReturnType<typeof toastManager.add> | undefined;
    const result = await settlePromise(async () => {
      const isImage = source.kind === "image";
      const unavailable = !canReadMedia || (source.src === null && source.asset === undefined);
      const canCopyImage =
        typeof navigator !== "undefined" &&
        Boolean(navigator.clipboard?.write) &&
        typeof ClipboardItem !== "undefined";
      const items: ContextMenuItem<MediaActionId>[] = [];
      if (reference?.kind === "file") {
        items.push({ id: "copy-full-path", label: translate("Copy full path") });
        if (reference.relativePath)
          items.push({ id: "copy-relative-path", label: translate("Copy relative path") });
      } else if (reference?.kind === "url") {
        items.push({ id: "copy-url", label: translate("Copy URL") });
      }
      // A frame is only worth capturing when a mounted composer can take the citation.
      if (source.kind === "video" && source.onCiteFrame && video && composerRef?.current) {
        items.push({ id: "cite-region", label: translate("Cite frame"), disabled: !canReadMedia });
      }
      if (source.onOpenFile)
        items.push({
          id: "open-file",
          label: translate("Open in file viewer"),
          disabled: !canReadMedia,
        });
      items.push({
        id: "save",
        label: isImage ? translate("Save image") : translate("Save video"),
        disabled: unavailable,
      });
      if (source.kind === "image") {
        items.push({
          id: "copy-image",
          label: translate("Copy image"),
          disabled: unavailable || !canCopyImage,
        });
      }

      const action = await api.contextMenu.show(items, position);
      if (!action) return;
      const failureTitles: Record<MediaActionId, string> = {
        "copy-full-path": "Could not copy full path",
        "copy-relative-path": "Could not copy relative path",
        "copy-url": "Could not copy URL",
        "open-file": "Could not open in file viewer",
        save: isImage ? "Could not save image" : "Could not save video",
        "copy-image": "Could not copy image",
        "cite-region": "Could not cite frame",
      };
      failureTitle = translate(failureTitles[action]);
      const text =
        action === "copy-full-path" && reference?.kind === "file"
          ? reference.path
          : action === "copy-relative-path" && reference?.kind === "file"
            ? reference.relativePath
            : action === "copy-url" && reference?.kind === "url"
              ? reference.url
              : undefined;
      if (text !== undefined) {
        const clipboardText =
          reference?.kind === "file" ? formatFilePathForClipboard(text, reference.path) : text;
        await writeTextToClipboard(clipboardText, reference?.kind === "file" ? "file path" : "URL");
        toastManager.add({
          type: "success",
          title: action === "copy-url" ? translate("URL copied") : translate("Path copied"),
        });
      } else if (action === "open-file") {
        assertCanReadMedia();
        source.onOpenFile?.();
      } else if (action === "cite-region" && video && source.onCiteFrame) {
        video.pause();
        const seconds = video.currentTime;
        progressToast = toastManager.add({ type: "loading", title: translate("Capturing frame…") });
        const still = await readVideoFrame(actionUrl, seconds, video);
        toastManager.close(progressToast);
        progressToast = undefined;
        source.onCiteFrame({ src: still, seconds });
      } else if (action === "save" || action === "copy-image") {
        progressToast = toastManager.add({
          type: "loading",
          title:
            action === "save"
              ? isImage
                ? translate("Preparing image download…")
                : translate("Preparing video download…")
              : translate("Copying image…"),
        });
        await (action === "save" ? save() : copyImage());
        toastManager.update(progressToast, {
          type: "success",
          title: action === "save" ? translate("Download started") : translate("Image copied"),
        });
      }
    });
    if (AsyncResult.isFailure(result)) {
      const error = squashAtomCommandFailure(result);
      const toast = stackedThreadToast({
        type: "error",
        title: failureTitle,
        description: error instanceof Error ? error.message : translate("The media action failed."),
      });
      if (progressToast) toastManager.update(progressToast, toast);
      else toastManager.add(toast);
    }
    menuOpen.current = false;
  };

  return (
    <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
      <TooltipTrigger
        render={children}
        tabIndex={0}
        onContextMenu={(event) => {
          if (event.defaultPrevented) return;
          event.preventDefault();
          event.stopPropagation();
          const bounds = event.currentTarget.getBoundingClientRect();
          void showMenu(
            event.clientX === 0 && event.clientY === 0
              ? { x: bounds.left, y: bounds.bottom }
              : { x: event.clientX, y: event.clientY },
            event.currentTarget.querySelector("video"),
          );
        }}
        onKeyDown={(event) => {
          if (
            event.defaultPrevented ||
            !(event.key === "ContextMenu" || (event.shiftKey && event.key === "F10"))
          )
            return;
          event.preventDefault();
          event.stopPropagation();
          const bounds = event.currentTarget.getBoundingClientRect();
          void showMenu(
            { x: bounds.left, y: bounds.bottom },
            event.currentTarget.querySelector("video"),
          );
        }}
      />
      <TooltipPopup variant="code">{tooltip}</TooltipPopup>
    </Tooltip>
  );
}
