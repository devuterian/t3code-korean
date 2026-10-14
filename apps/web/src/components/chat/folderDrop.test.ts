import { describe, expect, it } from "@effect/vitest";
import { EnvironmentId } from "@t3tools/contracts";
import {
  droppedFileExceedsAttachmentLimit,
  folderDropTarget,
  resolveDroppedFolderPath,
} from "./folderDrop";

const environmentId = EnvironmentId.make("environment-1");

describe("folderDropTarget", () => {
  it("targets local when the thread is on the primary environment", () => {
    expect(
      folderDropTarget({
        localEnvironmentDisabled: false,
        environmentId,
        primaryEnvironmentId: environmentId,
      }),
    ).toBe("local");
  });

  it("targets remote when Electron has no local environment", () => {
    expect(
      folderDropTarget({
        localEnvironmentDisabled: true,
        environmentId,
        primaryEnvironmentId: environmentId,
      }),
    ).toBe("remote");
  });

  it("targets remote when the thread lives on another environment", () => {
    expect(
      folderDropTarget({
        localEnvironmentDisabled: false,
        environmentId: EnvironmentId.make("environment-2"),
        primaryEnvironmentId: environmentId,
      }),
    ).toBe("remote");
  });

  it("targets remote when no primary environment is known", () => {
    expect(
      folderDropTarget({
        localEnvironmentDisabled: false,
        environmentId,
        primaryEnvironmentId: null,
      }),
    ).toBe("remote");
  });
});

describe("resolveDroppedFolderPath", () => {
  it("returns the native path when the bridge provides it", () => {
    const folder = new File([], "contracts");
    expect(resolveDroppedFolderPath(folder, () => "/tmp/project/contracts")).toBe(
      "/tmp/project/contracts",
    );
  });

  it("returns null for an outside-folder drop even when the folder name matches a project directory", () => {
    const folder = new File([], "contracts");
    expect(resolveDroppedFolderPath(folder, undefined)).toBeNull();
  });

  it("returns null when the bridge returns an empty path", () => {
    const folder = new File([], "contracts");
    expect(resolveDroppedFolderPath(folder, () => "")).toBeNull();
  });
});

describe("droppedFileExceedsAttachmentLimit", () => {
  const limit = 50 * 1024 * 1024;

  it("references files over the staging limit by path", () => {
    expect(
      droppedFileExceedsAttachmentLimit({
        kind: "file",
        sizeBytes: limit + 1,
        fileStagingLimit: limit,
      }),
    ).toBe(true);
    expect(
      droppedFileExceedsAttachmentLimit({
        kind: "file",
        sizeBytes: limit,
        fileStagingLimit: limit,
      }),
    ).toBe(false);
  });

  it("keeps the existing rejection when the server takes no files", () => {
    expect(
      droppedFileExceedsAttachmentLimit({
        kind: "file",
        sizeBytes: limit + 1,
        fileStagingLimit: null,
      }),
    ).toBe(false);
  });

  it("references images too large to compress by path", () => {
    expect(
      droppedFileExceedsAttachmentLimit({
        kind: "image",
        sizeBytes: limit + 1,
        fileStagingLimit: null,
      }),
    ).toBe(true);
    expect(
      droppedFileExceedsAttachmentLimit({
        kind: "image",
        sizeBytes: 20 * 1024 * 1024,
        fileStagingLimit: limit,
      }),
    ).toBe(false);
  });
});
