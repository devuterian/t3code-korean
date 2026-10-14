import type { EnvironmentId } from "@t3tools/contracts";

import { MAX_COMPRESSIBLE_SOURCE_BYTES } from "../../lib/imageCompression";
import type { ComposerAttachmentFileKind } from "./composerAttachmentFiles";

export function folderDropTarget(input: {
  localEnvironmentDisabled: boolean;
  environmentId: EnvironmentId;
  primaryEnvironmentId: EnvironmentId | null;
}): "local" | "remote" {
  if (
    input.localEnvironmentDisabled ||
    input.primaryEnvironmentId === null ||
    input.environmentId !== input.primaryEnvironmentId
  ) {
    return "remote";
  }
  return "local";
}

export function resolveDroppedFolderPath(
  folder: File,
  getPathForFile: ((file: File) => string) | undefined,
): string | null {
  const path = getPathForFile?.(folder);
  return typeof path === "string" && path.length > 0 ? path : null;
}

/**
 * Whether a file dropped from the OS is too large to attach, so the composer
 * should reference it by its local path instead of uploading it.
 */
export function droppedFileExceedsAttachmentLimit(input: {
  kind: ComposerAttachmentFileKind;
  sizeBytes: number;
  fileStagingLimit: number | null;
}): boolean {
  if (input.kind === "image") return input.sizeBytes > MAX_COMPRESSIBLE_SOURCE_BYTES;
  if (input.kind === "file") {
    return input.fileStagingLimit !== null && input.sizeBytes > input.fileStagingLimit;
  }
  return false;
}
