/**
 * Windows-style middle-click autoscroll: click the middle button over a
 * scrollable area, then move the pointer away from the anchor to scroll in
 * that direction, faster the further it moves.
 */

/** Pointer travel (px) around the anchor that does not scroll. */
export const AUTOSCROLL_DEAD_ZONE_PX = 12;
/** Pointer travel (px) after which a held middle button means "drag mode". */
export const AUTOSCROLL_DRAG_THRESHOLD_PX = 8;
/** Holding the middle button this long (ms) also means "drag mode". */
export const AUTOSCROLL_HOLD_THRESHOLD_MS = 300;
const MAX_SPEED_PX_PER_MS = 6;

/**
 * Scroll velocity (px/ms) along one axis for a pointer `offset` px from the
 * anchor. Zero inside the dead zone, then grows faster than linear so small
 * moves read comfortably and large moves cover long transcripts quickly.
 */
export function autoscrollSpeed(offset: number): number {
  const distance = Math.abs(offset) - AUTOSCROLL_DEAD_ZONE_PX;
  if (distance <= 0) return 0;
  const speed = Math.min(MAX_SPEED_PX_PER_MS, (distance / 100) ** 1.6 * 0.9 + distance * 0.004);
  return Math.sign(offset) * speed;
}

export interface AutoscrollAxes {
  readonly vertical: boolean;
  readonly horizontal: boolean;
}

const SCROLLABLE_OVERFLOW = new Set(["auto", "scroll", "overlay"]);

function scrollableAxes(element: Element): AutoscrollAxes {
  const style = getComputedStyle(element);
  return {
    vertical:
      SCROLLABLE_OVERFLOW.has(style.overflowY) && element.scrollHeight > element.clientHeight + 1,
    horizontal:
      SCROLLABLE_OVERFLOW.has(style.overflowX) && element.scrollWidth > element.clientWidth + 1,
  };
}

/**
 * Targets that keep their own middle-click meaning: links open elsewhere,
 * editable fields and terminals may paste, and embedded pages scroll
 * themselves.
 */
const EXCLUDED_TARGET_SELECTOR = [
  "a[href]",
  "input",
  "textarea",
  "select",
  "[contenteditable]:not([contenteditable='false'])",
  "[data-terminal-owner]",
  "webview",
  "iframe",
  "[data-no-autoscroll]",
].join(",");

export function isAutoscrollExcludedTarget(target: Element): boolean {
  return target.closest(EXCLUDED_TARGET_SELECTOR) !== null;
}

/** Nearest ancestor (or self) of `target` that can actually scroll. */
export function findAutoscrollContainer(
  target: Element,
): { readonly element: Element; readonly axes: AutoscrollAxes } | null {
  for (let element: Element | null = target; element; element = element.parentElement) {
    const axes = scrollableAxes(element);
    if (axes.vertical || axes.horizontal) return { element, axes };
  }
  const root = document.scrollingElement;
  if (root && root.scrollHeight > root.clientHeight + 1) {
    return { element: root, axes: { vertical: true, horizontal: false } };
  }
  return null;
}
