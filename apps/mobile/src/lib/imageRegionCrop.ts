import { imageRegionPixels, type ImageRegion } from "@t3tools/client-runtime/image-region-citation";
import { PROVIDER_SEND_TURN_MAX_IMAGE_BYTES } from "@t3tools/contracts";
import type { ImageRef } from "expo-image-manipulator";

import { translate } from "../i18n/translate";
import { estimateBase64ByteSize } from "./base64";
import type { DraftComposerImageAttachment } from "./composerImages";
import { uuidv4 } from "./uuid";

/** Matches the web crop limit: providers downscale larger images before the model sees them. */
const MAX_CROP_EDGE_PX = 2048;

/**
 * Crops a cited region from a local or data URI into a draft image attachment. The native
 * image manipulator cannot draw, so the crop is exactly the marked pixels rather than the web
 * client's padded crop with an outline.
 */
export async function cropImageRegionAttachment(input: {
  readonly uri: string;
  readonly region: ImageRegion;
  readonly name: string;
}): Promise<DraftComposerImageAttachment> {
  const { ImageManipulator } = await import("expo-image-manipulator");
  const source = await ImageManipulator.manipulate(input.uri).renderAsync();
  const crop = await (async () => {
    try {
      const rect = imageRegionPixels(input.region, { width: source.width, height: source.height });
      let context = ImageManipulator.manipulate(source).crop({
        originX: rect.x,
        originY: rect.y,
        width: rect.width,
        height: rect.height,
      });
      if (Math.max(rect.width, rect.height) > MAX_CROP_EDGE_PX) {
        context = context.resize(
          rect.width >= rect.height ? { width: MAX_CROP_EDGE_PX } : { height: MAX_CROP_EDGE_PX },
        );
      }
      return await context.renderAsync();
    } finally {
      source.release();
    }
  })();
  return savePngAttachment(
    crop,
    input.name,
    translate("The region is too large to attach. Select a smaller region."),
  );
}

/**
 * The whole image for a marked point, downscaled like a crop. The native manipulator cannot draw a
 * marker, so the point travels as the percentages that lead the comment.
 */
export async function imagePointAttachment(input: {
  readonly uri: string;
  readonly name: string;
}): Promise<DraftComposerImageAttachment> {
  const { ImageManipulator } = await import("expo-image-manipulator");
  const source = await ImageManipulator.manipulate(input.uri).renderAsync();
  const image = await (async () => {
    try {
      let context = ImageManipulator.manipulate(source);
      if (Math.max(source.width, source.height) > MAX_CROP_EDGE_PX) {
        context = context.resize(
          source.width >= source.height
            ? { width: MAX_CROP_EDGE_PX }
            : { height: MAX_CROP_EDGE_PX },
        );
      }
      return await context.renderAsync();
    } finally {
      source.release();
    }
  })();
  return savePngAttachment(
    image,
    input.name,
    translate("The image is too large to attach. Select a region instead."),
  );
}

async function savePngAttachment(
  image: ImageRef,
  name: string,
  tooLargeMessage: string,
): Promise<DraftComposerImageAttachment> {
  const { SaveFormat } = await import("expo-image-manipulator");
  try {
    const saved = await image.saveAsync({ format: SaveFormat.PNG, base64: true });
    if (!saved.base64) throw new Error(translate("The cropped region has no bytes."));
    const sizeBytes = estimateBase64ByteSize(saved.base64);
    if (sizeBytes <= 0 || sizeBytes > PROVIDER_SEND_TURN_MAX_IMAGE_BYTES) {
      throw new Error(tooLargeMessage);
    }
    return {
      id: uuidv4(),
      type: "image",
      name,
      mimeType: "image/png",
      sizeBytes,
      dataUrl: `data:image/png;base64,${saved.base64}`,
      previewUri: saved.uri,
    };
  } finally {
    image.release();
  }
}
