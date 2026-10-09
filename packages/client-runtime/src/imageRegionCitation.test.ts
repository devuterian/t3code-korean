import { describe, expect, it } from "vite-plus/test";

import {
  formatImagePoint,
  formatVideoTimestamp,
  imagePointCitationName,
  imagePointFromClient,
  imagePointMarkup,
  imagePointRegion,
  imageRegionBetween,
  imageRegionCitationName,
  imageRegionCrop,
  imageRegionPixels,
  isCitableImageRegion,
  isImagePointRegion,
  videoFrameCitationName,
} from "./imageRegionCitation.ts";

describe("image region selection", () => {
  const bounds = { left: 100, top: 50, width: 400, height: 200 };

  it("spans the same region whichever way the drag went, clamped to the image", () => {
    const start = imagePointFromClient({ x: 150, y: 100 }, bounds);
    const end = imagePointFromClient({ x: 50, y: 300 }, bounds);
    const expected = { x: 0, y: 0.25, width: 0.125, height: 0.75 };

    expect(imageRegionBetween(start, end)).toEqual(expected);
    expect(imageRegionBetween(end, start)).toEqual(expected);
  });

  it("measures stray clicks at the zoom the region was drawn", () => {
    const sliver = { x: 0.5, y: 0.25, width: 0.01, height: 0.5 };

    expect(isCitableImageRegion(sliver, bounds)).toBe(false);
    expect(isCitableImageRegion(sliver, { ...bounds, width: 800, height: 400 })).toBe(true);
  });
});

describe("imageRegionPixels", () => {
  it("covers exactly the marked pixels without floating-point growth", () => {
    expect(
      imageRegionPixels({ x: 0.4, y: 0.5, width: 0.2, height: 0.1 }, { width: 1000, height: 800 }),
    ).toEqual({ x: 400, y: 400, width: 200, height: 80 });
  });

  it("keeps at least one pixel for a region on the far edge", () => {
    expect(
      imageRegionPixels({ x: 1, y: 1, width: 0, height: 0 }, { width: 1000, height: 800 }),
    ).toEqual({ x: 999, y: 799, width: 1, height: 1 });
  });
});

describe("imageRegionCrop", () => {
  it("pads the region by a quarter of its longer side", () => {
    const crop = imageRegionCrop(
      { x: 0.4, y: 0.5, width: 0.2, height: 0.1 },
      { width: 1000, height: 800 },
    );

    expect(crop.source).toEqual({ x: 350, y: 350, width: 300, height: 180 });
    expect(crop).toMatchObject({ width: 300, height: 180, lineWidth: 2 });
    expect(crop.region).toEqual({ x: 50, y: 50, width: 200, height: 80 });
  });

  it("clamps the padding at the image edges", () => {
    const crop = imageRegionCrop(
      { x: 0, y: 0, width: 0.1, height: 0.1 },
      { width: 1000, height: 800 },
    );

    expect(crop.source).toEqual({ x: 0, y: 0, width: 125, height: 105 });
    expect(crop.region).toEqual({ x: 0, y: 0, width: 100, height: 80 });
  });

  it("keeps some surroundings around a tiny region in a large image", () => {
    const crop = imageRegionCrop(
      { x: 0.5, y: 0.5, width: 0.01, height: 0.01 },
      { width: 4000, height: 3000 },
    );

    expect(crop.source).toEqual({ x: 1920, y: 1420, width: 200, height: 190 });
    expect(crop.region).toEqual({ x: 80, y: 80, width: 40, height: 30 });
  });

  it("downscales large crops and maps the region into the smaller crop", () => {
    const crop = imageRegionCrop(
      { x: 0.1, y: 0.1, width: 0.8, height: 0.8 },
      { width: 8000, height: 6000 },
    );

    expect(crop.source).toEqual({ x: 0, y: 0, width: 8000, height: 6000 });
    expect(crop).toMatchObject({ width: 2048, height: 1536, lineWidth: 5 });
    expect(crop.region.x).toBeCloseTo(204.8);
    expect(crop.region.y).toBeCloseTo(153.6);
    expect(crop.region.width).toBeCloseTo(1638.4);
    expect(crop.region.height).toBeCloseTo(1228.8);
  });
});

describe("imageRegionCitationName", () => {
  it("names the crop after the source file", () => {
    expect(imageRegionCitationName("docs/shots/settings.png")).toBe("settings region.png");
    expect(imageRegionCitationName("C:\\Users\\me\\shot.JPEG")).toBe("shot region.png");
    expect(imageRegionCitationName("Settings page")).toBe("Settings page region.png");
  });

  it("falls back when the source has no usable name", () => {
    expect(imageRegionCitationName("")).toBe("image region.png");
    expect(imageRegionCitationName(".png")).toBe("image region.png");
  });
});

describe("video frame citations", () => {
  it("formats positions like video controls", () => {
    expect(formatVideoTimestamp(12.9)).toBe("0:12");
    expect(formatVideoTimestamp(72)).toBe("1:12");
    expect(formatVideoTimestamp(3725)).toBe("1:02:05");
    expect(formatVideoTimestamp(-3)).toBe("0:00");
  });

  it("names the frame after its source and position", () => {
    expect(videoFrameCitationName("clips/demo.mp4", 72.4)).toBe("demo at 1:12 region.png");
    expect(videoFrameCitationName("", 5)).toBe("video at 0:05 region.png");
  });
});

describe("image point marks", () => {
  it("stores a point as a region with no size, clamped to the image", () => {
    const region = imagePointRegion({ x: 1.2, y: 0.25 });
    expect(region).toEqual({ x: 1, y: 0.25, width: 0, height: 0 });
    expect(isImagePointRegion(region)).toBe(true);
    expect(isImagePointRegion({ x: 0, y: 0, width: 0.1, height: 0.1 })).toBe(false);
  });

  it("formats a point in whole percentages", () => {
    expect(formatImagePoint({ x: 0.344, y: 0.5251 })).toBe("x 34%, y 53%");
  });

  it("marks the point on the whole image, downscaled like a crop", () => {
    expect(imagePointMarkup({ x: 0.5, y: 0.25 }, { width: 4096, height: 2048 })).toEqual({
      width: 2048,
      height: 1024,
      x: 1024,
      y: 256,
      radius: 34,
      lineWidth: 5,
    });
  });

  it("names the marked copy after the source file", () => {
    expect(imagePointCitationName("/tmp/screen shot.png")).toBe("screen shot point.png");
  });
});
