import {
  imagePointMarkup,
  imageRegionCrop,
  type ImagePoint,
  type ImageRegion,
  type PixelRect,
} from "@t3tools/client-runtime/image-region-citation";

import { translate } from "~/i18n/translate";

/** Resolves web references without inheriting the desktop renderer's custom app scheme. */
export function resolveProtocolRelativeMediaUrl(src: string): string {
  if (!src.startsWith("//")) return src;
  const protocol =
    typeof window !== "undefined" && window.location.protocol === "http:" ? "http:" : "https:";
  return `${protocol}${src}`;
}

// Data URL escapes are raw bytes, not UTF-8, so `%89` must stay one byte.
function decodePercentBytes(payload: string) {
  const encoder = new TextEncoder();
  return Uint8Array.from(
    payload
      .split(/(%[0-9a-f]{2})/i)
      .flatMap((part) =>
        /^%[0-9a-f]{2}$/i.test(part)
          ? [Number.parseInt(part.slice(1), 16)]
          : [...encoder.encode(part)],
      ),
  );
}

/** Decodes inline media locally; desktop connect-src omits `data:`, so fetch() cannot read it. */
function readDataUrlBlob(src: string): Blob {
  // A fragment is never part of the payload; a literal `#` in data must be escaped as `%23`.
  const url = src.split("#", 1)[0] ?? src;
  const comma = url.indexOf(",");
  const [mimeType = "", ...parameters] = url.slice("data:".length, comma).split(";");
  const payload = url.slice(comma + 1);
  try {
    if (comma < 0) throw new Error("Missing data URL payload.");
    const isBase64 = parameters.some((parameter) => parameter.trim().toLowerCase() === "base64");
    // Base64 text is ASCII, so any escape that is not valid UTF-8 is malformed anyway.
    const bytes = isBase64
      ? Uint8Array.from(atob(decodeURIComponent(payload)), (char) => char.charCodeAt(0))
      : decodePercentBytes(payload);
    return new Blob([bytes], { type: mimeType || "text/plain" });
  } catch (cause) {
    throw new Error(translate("This inline media could not be decoded."), { cause });
  }
}

async function fetchMediaBlob(src: string): Promise<Blob> {
  const response = await fetch(src).catch(() => null);
  if (response?.ok) return response.blob();
  // An <img> can show media that fetch() may not read (CORS, CSP, cookies); desktop reads it natively.
  const desktop = typeof window === "undefined" ? undefined : window.desktopBridge;
  const native =
    desktop && /^https?:/i.test(src) ? await desktop.readMedia(src).catch(() => null) : null;
  if (native && native.status >= 200 && native.status < 300) {
    return new Blob([new Uint8Array(native.data)], { type: native.mimeType });
  }
  const status = native?.status ?? response?.status;
  if (status !== undefined) {
    throw new Error(
      translate("The file could not be fetched (HTTP {status}).").replace("{status}", () =>
        String(status),
      ),
    );
  }
  throw new Error(
    translate(
      desktop
        ? "The file could not be fetched. Check the connection and try again."
        : "The file could not be fetched. The host may block browser access (CORS), or the connection may be unavailable.",
    ),
  );
}

async function readMediaBlob(src: string): Promise<Blob> {
  if (/^data:/i.test(src)) return readDataUrlBlob(src);
  const blob = await fetchMediaBlob(src);
  if (blob.type.split(";", 1)[0] === "text/html") {
    throw new Error(
      translate("This link returned a web page instead of media. Open the original URL."),
    );
  }
  return blob;
}

export async function downloadMedia(src: string, name: string): Promise<void> {
  const url = URL.createObjectURL(await readMediaBlob(src));
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    anchor.click();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  }
}

/** Decodes browser-readable images, including SVG, and releases the decoded source afterwards. */
async function withDecodedImage<T>(
  blob: Blob,
  errors: { readonly decode: string; readonly size: string },
  use: (image: HTMLImageElement) => Promise<T>,
): Promise<T> {
  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.src = url;
  try {
    try {
      await image.decode();
    } catch (cause) {
      throw new Error(errors.decode, { cause });
    }
    const { naturalWidth: width, naturalHeight: height } = image;
    if (width <= 0 || height <= 0 || width * height > 64_000_000) {
      throw new Error(errors.size);
    }
    return await use(image);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (png) =>
        png
          ? resolve(png)
          : reject(new Error(translate("The image could not be converted to PNG."))),
      "image/png",
    );
  });
}

/** A video frame is only an intermediate for the crop; JPEG encodes several times faster. */
function canvasToStill(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (still) =>
        still ? resolve(still) : reject(new Error(translate("The video frame could not be read."))),
      "image/jpeg",
      0.95,
    );
  });
}

/** Converts browser-decodable images, including SVG, into the clipboard's portable PNG format. */
export async function readMediaPng(src: string): Promise<Blob> {
  const blob = await readMediaBlob(src);
  if (blob.type.split(";", 1)[0] === "image/png") return blob;

  return withDecodedImage(
    blob,
    {
      decode: translate(
        "The browser could not decode this image for copying. Try saving it instead.",
      ),
      size: translate(
        "This image is too large or has no usable dimensions. Try saving it instead.",
      ),
    },
    async (image) => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error(translate("Image copying is unavailable in this browser."));
      context.drawImage(image, 0, 0);
      return canvasToPng(canvas);
    },
  );
}

const VIDEO_FRAME_TIMEOUT_MS = 15_000;

function drawVideoFrame(video: HTMLVideoElement): Promise<Blob> {
  const { videoWidth: width, videoHeight: height } = video;
  if (width <= 0 || height <= 0) throw new Error(translate("The video has no frame to cite."));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error(translate("Video citing is unavailable in this browser."));
  context.drawImage(video, 0, 0, width, height);
  return canvasToStill(canvas);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)), { once: true });
    reader.addEventListener(
      "error",
      () => reject(new Error(translate("The video frame could not be read."))),
      {
        once: true,
      },
    );
    reader.readAsDataURL(blob);
  });
}

/**
 * Captures the frame at `seconds` as a data URL, which needs no revoking wherever the still ends
 * up. The paused player on screen is exact and fast when the page may read its pixels; otherwise
 * a separate CORS request loads the same moment from `source`, which needs a same-origin URL or a
 * host that allows CORS.
 */
export async function readVideoFrame(
  source: () => Promise<string>,
  seconds: number,
  shown?: HTMLVideoElement | null,
): Promise<string> {
  if (shown && shown.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    try {
      return await blobToDataUrl(await drawVideoFrame(shown));
    } catch {
      // A cross-origin player taints the canvas; load a CORS copy of the moment instead.
    }
  }
  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  const next = (event: "loadeddata" | "seeked") =>
    new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        cleanup();
        reject(new Error(translate("The video frame took too long to load. Try again.")));
      }, VIDEO_FRAME_TIMEOUT_MS);
      const done = () => {
        cleanup();
        resolve();
      };
      const fail = () => {
        cleanup();
        reject(
          new Error(
            translate(
              "The video could not be loaded for citing. The host may block browser access (CORS).",
            ),
          ),
        );
      };
      const cleanup = () => {
        window.clearTimeout(timer);
        video.removeEventListener(event, done);
        video.removeEventListener("error", fail);
      };
      video.addEventListener(event, done);
      video.addEventListener("error", fail);
    });
  try {
    const src = await source();
    const loaded = next("loadeddata");
    video.src = src;
    await loaded;
    if (video.currentTime !== seconds) {
      const seeked = next("seeked");
      video.currentTime = seconds;
      await seeked;
    }
    try {
      return await blobToDataUrl(await drawVideoFrame(video));
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "SecurityError") {
        throw new Error(translate("The video's host blocks reading its frames."), { cause });
      }
      throw cause;
    }
  } finally {
    video.removeAttribute("src");
    video.load();
  }
}

/** Strokes outside `rect`, so the pixels inside stay exactly as the source had them. */
function strokeOutside(context: CanvasRenderingContext2D, rect: PixelRect, lineWidth: number) {
  context.lineWidth = lineWidth;
  context.strokeRect(
    rect.x - lineWidth / 2,
    rect.y - lineWidth / 2,
    rect.width + lineWidth,
    rect.height + lineWidth,
  );
}

/**
 * Crops a cited region with its surroundings and outlines it in the color the viewer drew it,
 * so the agent sees the part the user marked.
 */
export async function readMediaImageRegion(
  src: string,
  region: ImageRegion,
  options: { readonly name: string; readonly outlineColor: string },
): Promise<File> {
  const blob = await readMediaBlob(src);
  const png = await withDecodedImage(
    blob,
    {
      decode: translate("The browser could not decode this image for citing."),
      size: translate("This image is too large or has no usable dimensions."),
    },
    async (image) => {
      const crop = imageRegionCrop(region, {
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error(translate("Image citing is unavailable in this browser."));
      context.imageSmoothingQuality = "high";
      context.drawImage(
        image,
        crop.source.x,
        crop.source.y,
        crop.source.width,
        crop.source.height,
        0,
        0,
        crop.width,
        crop.height,
      );
      // A dark band outside the colored line keeps the outline visible on light images.
      context.strokeStyle = "rgb(0 0 0 / 0.45)";
      strokeOutside(context, crop.region, crop.lineWidth * 2);
      context.strokeStyle = options.outlineColor;
      strokeOutside(context, crop.region, crop.lineWidth);
      return canvasToPng(canvas);
    },
  );
  return new File([png], options.name, { type: "image/png" });
}

/**
 * The whole image with a pin on a marked point, for citing a spot rather than a region. The pin is
 * a ring with a dark halo so it reads on light and dark images alike.
 */
export async function readMediaImagePoint(
  src: string,
  point: ImagePoint,
  options: { readonly name: string; readonly markerColor: string },
): Promise<File> {
  const blob = await readMediaBlob(src);
  const png = await withDecodedImage(
    blob,
    {
      decode: translate("The browser could not decode this image for citing."),
      size: translate("This image is too large or has no usable dimensions."),
    },
    async (image) => {
      const markup = imagePointMarkup(point, {
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      const canvas = document.createElement("canvas");
      canvas.width = markup.width;
      canvas.height = markup.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error(translate("Image citing is unavailable in this browser."));
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 0, 0, markup.width, markup.height);
      const ring = (radius: number, lineWidth: number, color: string) => {
        context.beginPath();
        context.arc(markup.x, markup.y, radius, 0, Math.PI * 2);
        context.lineWidth = lineWidth;
        context.strokeStyle = color;
        context.stroke();
      };
      ring(markup.radius, markup.lineWidth * 3, "rgb(0 0 0 / 0.45)");
      ring(markup.radius, markup.lineWidth, options.markerColor);
      context.beginPath();
      context.arc(markup.x, markup.y, Math.max(2, markup.lineWidth), 0, Math.PI * 2);
      context.fillStyle = options.markerColor;
      context.fill();
      return canvasToPng(canvas);
    },
  );
  return new File([png], options.name, { type: "image/png" });
}
