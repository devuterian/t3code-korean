import { useEffect } from "react";

import { useClientSettings } from "../hooks/useSettings";
import {
  AUTOSCROLL_DEAD_ZONE_PX,
  AUTOSCROLL_DRAG_THRESHOLD_PX,
  AUTOSCROLL_HOLD_THRESHOLD_MS,
  autoscrollSpeed,
  findAutoscrollContainer,
  isAutoscrollExcludedTarget,
} from "../lib/middleClickAutoscroll";

const INDICATOR_SIZE_PX = 28;

function createIndicator(x: number, y: number, vertical: boolean, horizontal: boolean) {
  const indicator = document.createElement("div");
  indicator.setAttribute("aria-hidden", "true");
  indicator.style.cssText = [
    "position:fixed",
    `left:${x - INDICATOR_SIZE_PX / 2}px`,
    `top:${y - INDICATOR_SIZE_PX / 2}px`,
    `width:${INDICATOR_SIZE_PX}px`,
    `height:${INDICATOR_SIZE_PX}px`,
    "border-radius:9999px",
    "border:1px solid var(--border)",
    "background:var(--popover)",
    "color:var(--muted-foreground)",
    "box-shadow:0 2px 8px rgb(0 0 0 / 0.2)",
    "pointer-events:none",
    "z-index:2147483647",
  ].join(";");
  const arrows = [
    vertical ? '<path d="M14 5l-3.5 4h7z"/><path d="M14 23l-3.5-4h7z"/>' : "",
    horizontal ? '<path d="M5 14l4-3.5v7z"/><path d="M23 14l-4-3.5v7z"/>' : "",
  ].join("");
  indicator.innerHTML = `<svg width="${INDICATOR_SIZE_PX - 2}" height="${INDICATOR_SIZE_PX - 2}" viewBox="0 0 28 28" fill="currentColor"><circle cx="14" cy="14" r="2"/>${arrows}</svg>`;
  document.body.append(indicator);
  return indicator;
}

function cursorFor(dx: number, dy: number, vertical: boolean, horizontal: boolean): string {
  const north = vertical && dy < -AUTOSCROLL_DEAD_ZONE_PX;
  const south = vertical && dy > AUTOSCROLL_DEAD_ZONE_PX;
  const west = horizontal && dx < -AUTOSCROLL_DEAD_ZONE_PX;
  const east = horizontal && dx > AUTOSCROLL_DEAD_ZONE_PX;
  const direction = `${north ? "n" : south ? "s" : ""}${west ? "w" : east ? "e" : ""}`;
  if (direction) return `${direction}-resize`;
  return vertical && !horizontal
    ? "ns-resize"
    : horizontal && !vertical
      ? "ew-resize"
      : "all-scroll";
}

/**
 * Mounts window-level listeners for middle-click autoscroll while the client
 * setting is on. The frame loop runs only while a scroll session is active.
 */
export function MiddleClickAutoscroll() {
  const enabled = useClientSettings((settings) => settings.middleClickAutoscroll);

  useEffect(() => {
    if (!enabled) return;
    let stopActive: (() => void) | null = null;

    const start = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || isAutoscrollExcludedTarget(event.target)) return;
      const container = findAutoscrollContainer(event.target);
      if (!container) return;
      event.preventDefault();

      const { element, axes } = container;
      const originX = event.clientX;
      const originY = event.clientY;
      const startedAt = performance.now();
      let pointerX = originX;
      let pointerY = originY;
      let dragged = false;
      let lastFrame = startedAt;
      let frame = 0;
      const indicator = createIndicator(originX, originY, axes.vertical, axes.horizontal);
      const cursorStyle = document.createElement("style");
      document.head.append(cursorStyle);
      const setCursor = (cursor: string) => {
        cursorStyle.textContent = `*{cursor:${cursor}!important;user-select:none!important}`;
      };
      setCursor(cursorFor(0, 0, axes.vertical, axes.horizontal));

      const tick = (now: number) => {
        const elapsed = Math.min(now - lastFrame, 50);
        lastFrame = now;
        const left = axes.horizontal ? autoscrollSpeed(pointerX - originX) * elapsed : 0;
        const top = axes.vertical ? autoscrollSpeed(pointerY - originY) * elapsed : 0;
        if (left !== 0 || top !== 0) element.scrollBy({ left, top, behavior: "instant" });
        frame = requestAnimationFrame(tick);
      };

      const onMove = (moveEvent: MouseEvent) => {
        pointerX = moveEvent.clientX;
        pointerY = moveEvent.clientY;
        if (Math.hypot(pointerX - originX, pointerY - originY) > AUTOSCROLL_DRAG_THRESHOLD_PX) {
          dragged = true;
        }
        setCursor(
          cursorFor(pointerX - originX, pointerY - originY, axes.vertical, axes.horizontal),
        );
      };
      // Any click ends a click-to-toggle session and is swallowed so it does
      // not also activate whatever sits under the pointer.
      const onDown = (downEvent: MouseEvent) => {
        downEvent.preventDefault();
        downEvent.stopPropagation();
        stop(true);
      };
      // Releasing the middle button after dragging or holding ends a
      // press-and-hold session; a quick click keeps scrolling until the next
      // click.
      const onUp = (upEvent: MouseEvent) => {
        if (upEvent.button !== 1) return;
        if (dragged || performance.now() - startedAt > AUTOSCROLL_HOLD_THRESHOLD_MS) stop();
      };
      const suppress = (clickEvent: MouseEvent) => {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
      };
      const onKey = (keyEvent: KeyboardEvent) => {
        if (keyEvent.key === "Escape") {
          keyEvent.preventDefault();
          keyEvent.stopPropagation();
        }
        stop();
      };
      const stopNow = () => stop();

      const stop = (endedByPress = false) => {
        cancelAnimationFrame(frame);
        indicator.remove();
        cursorStyle.remove();
        window.removeEventListener("mousemove", onMove, true);
        window.removeEventListener("mousedown", onDown, true);
        window.removeEventListener("mouseup", onUp, true);
        window.removeEventListener("keydown", onKey, true);
        window.removeEventListener("wheel", stopNow, true);
        window.removeEventListener("blur", stopNow);
        document.removeEventListener("visibilitychange", stopNow);
        const releaseSuppression = () => {
          window.removeEventListener("click", suppress, true);
          window.removeEventListener("auxclick", suppress, true);
        };
        // A press that ended the session still owes a click, and a middle
        // release still owes an auxclick; swallow those before re-arming.
        if (endedByPress) {
          window.addEventListener("mouseup", () => setTimeout(releaseSuppression), {
            capture: true,
            once: true,
          });
        } else {
          setTimeout(releaseSuppression);
        }
        stopActive = null;
      };

      window.addEventListener("mousemove", onMove, true);
      window.addEventListener("mousedown", onDown, true);
      window.addEventListener("mouseup", onUp, true);
      window.addEventListener("click", suppress, true);
      window.addEventListener("auxclick", suppress, true);
      window.addEventListener("keydown", onKey, true);
      window.addEventListener("wheel", stopNow, { capture: true, passive: true });
      window.addEventListener("blur", stopNow);
      document.addEventListener("visibilitychange", stopNow);
      frame = requestAnimationFrame(tick);
      stopActive = stop;
    };

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 1 || stopActive || event.defaultPrevented) return;
      start(event);
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      stopActive?.();
    };
  }, [enabled]);

  return null;
}
