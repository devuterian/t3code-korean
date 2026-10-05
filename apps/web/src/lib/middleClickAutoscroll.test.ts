import { describe, expect, it } from "vite-plus/test";

import { AUTOSCROLL_DEAD_ZONE_PX, autoscrollSpeed } from "./middleClickAutoscroll";

describe("autoscrollSpeed", () => {
  it("stays still inside the dead zone", () => {
    expect(autoscrollSpeed(0)).toBe(0);
    expect(autoscrollSpeed(AUTOSCROLL_DEAD_ZONE_PX)).toBe(0);
    expect(autoscrollSpeed(-AUTOSCROLL_DEAD_ZONE_PX)).toBe(0);
  });

  it("scrolls toward the pointer, faster the further it moves", () => {
    const near = autoscrollSpeed(40);
    const far = autoscrollSpeed(300);
    expect(near).toBeGreaterThan(0);
    expect(far).toBeGreaterThan(near);
    expect(autoscrollSpeed(-300)).toBe(-far);
  });

  it("caps the speed for very large offsets", () => {
    expect(autoscrollSpeed(5000)).toBe(autoscrollSpeed(50000));
  });
});
