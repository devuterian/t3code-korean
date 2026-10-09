import type { MediaActionsSource } from "../lib/mediaActionsSource";
import { useNavigation } from "@react-navigation/native";
import type { MediaActionId } from "@t3tools/client-runtime/media-actions";
import {
  AuthFilesystemReadScope,
  type EnvironmentId,
  sessionGrantsScope,
  type SessionGrantInput,
} from "@t3tools/contracts";
import { normalizeNativeMarkdownUrl } from "@t3tools/mobile-markdown-text/links";
import * as Option from "effect/Option";
import { AsyncResult } from "effect/reactivity";
import { createContext, use, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

import { translate, useTranslate } from "../i18n/translate";
import { useRefreshAssetUrl } from "./assets";
import { appAtomRegistry } from "./atom-registry";
import { useEnvironmentQuery } from "./query";
import { environmentSession } from "./session";
import { downloadAndShareAttachment, shareLocalAttachment } from "../lib/attachmentDownload";
import { copyTextWithHaptic } from "../lib/copyTextWithHaptic";
import { loadLocalAttachmentPreview } from "../lib/localAttachmentPreview";

/** An explicit action may ask the server while its grant is still unresolved. */
function allowsHostMedia(session: SessionGrantInput | null) {
  return session === null || sessionGrantsScope(session, AuthFilesystemReadScope);
}

function canReadHostMedia(environmentId: EnvironmentId | null): boolean {
  if (environmentId === null) return true;
  const result = appAtomRegistry.get(environmentSession.sessionStateAtom(environmentId));
  return result._tag !== "Failure" && allowsHostMedia(Option.getOrNull(AsyncResult.value(result)));
}

/**
 * Opens region selection for an image and cites it into the thread that owns the surface.
 * Null outside a thread, where no composer can receive the crop.
 */
export const ImageCiteContext = createContext<((source: MediaActionsSource) => void) | null>(null);

/** Images the native cropper can decode. An SVG has no pixels until something renders it. */
function isCitableImageMimeType(mimeType: string): boolean {
  const type = mimeType.split(";", 1)[0]?.trim().toLowerCase() ?? "";
  return type.startsWith("image/") && type !== "image/svg+xml";
}

/** `onLeavePreview` closes the preview that hosts the menu before an action opens another view. */
export function useMediaActions(
  source: MediaActionsSource | undefined,
  onLeavePreview?: () => void,
) {
  const t = useTranslate();
  const navigation = useNavigation();
  const citeImage = use(ImageCiteContext);
  const hostEnvironmentId =
    source &&
    "resource" in source &&
    (source.resource._tag === "workspace-file" || source.resource._tag === "media-file")
      ? source.environmentId
      : null;
  const fileSession = useEnvironmentQuery(
    hostEnvironmentId === null ? null : environmentSession.sessionStateAtom(hostEnvironmentId),
  );
  const canReadMedia =
    hostEnvironmentId === null ||
    (fileSession.error === null && fileSession.data !== null && allowsHostMedia(fileSession.data));
  const refresh = useRefreshAssetUrl(
    source && "environmentId" in source ? source.environmentId : null,
    source && "resource" in source ? source.resource : null,
  );
  const controller = useRef<AbortController | null>(null);
  const [sharing, setSharing] = useState(false);
  useEffect(() => () => controller.current?.abort(), []);

  const share = () => {
    if (!source || controller.current || !canReadHostMedia(hostEnvironmentId)) return;
    const request = new AbortController();
    controller.current = request;
    setSharing(true);
    return (async () => {
      if ("attachment" in source) {
        const preview = await loadLocalAttachmentPreview(source.attachment, request.signal);
        if (!preview) return;
        try {
          await preview.share(request.signal, source.sourceIdentifier);
        } finally {
          preview.dispose();
        }
        return;
      }
      const uri = "uri" in source ? normalizeNativeMarkdownUrl(source.uri) : await refresh();
      if (request.signal.aborted || !canReadHostMedia(hostEnvironmentId)) return;
      if (uri === null)
        throw new Error(translate("The file could not be loaded. Reconnect and try again."));
      const input = {
        attachment: { name: source.name, mimeType: source.mimeType },
        signal: request.signal,
        sourceIdentifier: source.sourceIdentifier,
      };
      if (/^(file|content):/i.test(uri)) await shareLocalAttachment({ ...input, uri });
      else await downloadAndShareAttachment({ ...input, url: uri });
    })()
      .catch((error: unknown) => {
        if (!request.signal.aborted) {
          Alert.alert(
            translate("Could not share file"),
            error instanceof Error ? error.message : translate("Try again."),
          );
        }
      })
      .finally(() => {
        if (controller.current === request) {
          controller.current = null;
          if (!request.signal.aborted) setSharing(false);
        }
      });
  };

  const reference = source?.reference;
  const relativePath = reference?.kind === "file" ? reference.relativePath : undefined;
  const threadId = source && "threadId" in source ? source.threadId : undefined;
  const actions: { id: MediaActionId; title: string; run: () => void; disabled?: boolean }[] =
    source
      ? [
          ...(citeImage && isCitableImageMimeType(source.mimeType)
            ? [
                {
                  id: "cite-region" as const,
                  title: t("Cite region"),
                  run: () => {
                    onLeavePreview?.();
                    citeImage(source);
                  },
                },
              ]
            : []),
          ...(reference?.kind === "file"
            ? [
                {
                  id: "copy-full-path" as const,
                  title: t("Copy full path"),
                  run: () => copyTextWithHaptic(reference.path),
                },
              ]
            : []),
          ...(relativePath
            ? [
                {
                  id: "copy-relative-path" as const,
                  title: t("Copy relative path"),
                  run: () => copyTextWithHaptic(relativePath),
                },
              ]
            : []),
          ...(reference?.kind === "url"
            ? [
                {
                  id: "copy-url" as const,
                  title: t("Copy URL"),
                  run: () => copyTextWithHaptic(reference.url),
                },
              ]
            : []),
          ...(relativePath && "environmentId" in source && threadId !== undefined
            ? [
                {
                  id: "open-file" as const,
                  title: t("Open in file viewer"),
                  disabled: !canReadMedia,
                  run: () => {
                    if (!canReadHostMedia(hostEnvironmentId)) return;
                    onLeavePreview?.();
                    navigation.navigate("ThreadFile", {
                      environmentId: String(source.environmentId),
                      threadId: String(threadId),
                      path: relativePath.split("/"),
                    });
                  },
                },
              ]
            : []),
          {
            id: "save" as const,
            title: sharing ? t("Opening share sheet…") : t("Save or share"),
            run: share,
            disabled: sharing || !canReadMedia,
          },
        ]
      : [];
  return {
    title: reference?.kind === "file" ? reference.path : reference?.url,
    actions,
    sharing,
    share,
  };
}
