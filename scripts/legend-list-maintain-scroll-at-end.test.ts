// @effect-diagnostics nodeBuiltinImport:off - reads the installed web JS bundle for synchronous VM tests.
import * as NodeFS from "node:fs";
import * as NodeVM from "node:vm";
import { describe, expect, it, vi } from "vite-plus/test";

function createList(bundle: string) {
  const source = NodeFS.readFileSync(
    new URL(`../apps/web/node_modules/@legendapp/list/${bundle}`, import.meta.url),
    "utf8",
  );
  const slice = (start: string, end: string) =>
    source.slice(source.indexOf(start), source.indexOf(end));
  const maintain = slice("function doMaintainScrollAtEnd(", "// src/core/finishScrollTo.ts");
  const layout = slice("// src/core/handleLayout.ts", "// src/core/onScroll.ts");
  const frames: Array<() => void> = [];
  let within = true;
  let layoutLeavesWithinThreshold = true;
  let nativeScroll = 2000;
  const scrollToEnd = vi.fn(() => {
    nativeScroll = 2200;
  });
  const state = {
    props: {
      data: [],
      maintainScrollAtEnd: { animated: true, onLayout: true, onDataChange: true } as
        | { animated: boolean; onLayout: boolean; onDataChange: boolean }
        | undefined,
    },
    didContainersLayout: true,
    didFinishInitialScroll: true,
    pendingNativeMVCPAdjust: undefined,
    refScroller: { current: { scrollToEnd, getCurrentScrollOffset: () => nativeScroll } },
    maintainingScrollAtEnd: undefined as string | undefined,
    pendingMaintainScrollAtEnd: false,
    scheduledWork: { frame: (run: () => void) => frames.push(run) },
    scroll: 2000,
    scrollLength: 800,
    otherAxisSize: 600,
    lastLayout: { x: 0, y: 0, width: 600, height: 800 },
  };
  // Like doScrollTo, an instant scrollToEnd writes the landed offset to state.scroll itself.
  const ctx = {
    state,
    interruptUserScroll: vi.fn(),
    scrollToEnd: ({ animated }: { animated: boolean }) => {
      state.refScroller.current.scrollToEnd({ animated } as never);
      if (!animated) state.scroll = nativeScroll;
    },
  };
  const api = NodeVM.runInNewContext(
    `${maintain}\n${layout}\n({ doMaintainScrollAtEnd, handleLayout })`,
    {
      Platform: { OS: "web" },
      invalidateHorizontalRTLScrollType: vi.fn(),
      getWindowSize: () => ({ width: 600, height: 800 }),
      scrollToIndex: vi.fn(),
      finishMaintainScrollAtEnd: () => {
        state.maintainingScrollAtEnd = undefined;
        state.pendingMaintainScrollAtEnd = false;
      },
      getObservedScrollOffset: () => nativeScroll,
      isWebScrollAwayFromEnd: () => false,
      getScrollRequestTracker: () => ({
        runNowIfIdle: (run: () => void) => Promise.resolve().then(run),
      }),
      clampScrollOffset: (_ctx: unknown, offset: number) => offset,
      areKnownOrFixedItemSizesAvailable: () => true,
      isEndOfContentTarget: () => false,
      peek$: (_ctx: unknown, key: string) =>
        key === "isWithinMaintainScrollAtEndThreshold" && within,
      set$: vi.fn(),
      getContentSize: () => 3000,
      updateContentMetricsState: vi.fn(),
      doInitialAllocateContainers: vi.fn(),
      calculateItemsInView: vi.fn(),
      checkThresholds: () => {
        within = layoutLeavesWithinThreshold;
      },
      IS_DEV: false,
    },
  ) as {
    doMaintainScrollAtEnd: (context: typeof ctx) => boolean;
    handleLayout: (context: typeof ctx, layout: object, setCanRender: () => void) => void;
  };
  return {
    scrollToEnd,
    state,
    dataChange: () => api.doMaintainScrollAtEnd(ctx),
    /** The shrink leaves the end further away than the new, smaller viewport. */
    layoutLeavesEndBeyondThreshold() {
      layoutLeavesWithinThreshold = false;
    },
    /** A scroll event moves the list without a pin, such as a smooth scroll in flight. */
    scrolled(offset: number) {
      nativeScroll = offset;
      state.scroll = offset;
    },
    /** The app passes maintainScrollAtEnd={false} once the reader scrolls away. */
    releaseFollow() {
      state.props.maintainScrollAtEnd = undefined;
    },
    /** A pin that lands at the end brings the threshold back. */
    reachEnd() {
      within = true;
      layoutLeavesWithinThreshold = true;
    },
    // Browser order per frame: rAF callbacks, then ResizeObserver layout, then microtasks.
    async frame(viewportHeight?: number) {
      for (const callback of frames.splice(0)) callback();
      if (viewportHeight !== undefined) {
        api.handleLayout(ctx, { x: 0, y: 0, width: 600, height: viewportHeight }, () => {});
      }
      await Promise.resolve();
      await Promise.resolve();
    },
  };
}

describe.each(["react.mjs", "react.js"])("maintainScrollAtEnd while animated (%s)", (bundle) => {
  it("pins every frame of a continuous viewport resize instantly", async () => {
    const list = createList(bundle);
    for (let index = 1; index <= 12; index++) await list.frame(800 - index * 20);
    await list.frame();
    expect(list.scrollToEnd.mock.calls).toEqual(
      Array.from({ length: 12 }, () => [{ animated: false }]),
    );
  });

  it("keeps a content-growth pin smooth and pins the following resize instantly", async () => {
    const list = createList(bundle);
    list.dataChange();
    for (let index = 1; index <= 6; index++) await list.frame(800 - index * 20);
    await list.frame();
    expect(list.scrollToEnd.mock.calls).toEqual([
      [{ animated: true }],
      ...Array.from({ length: 6 }, () => [{ animated: false }]),
    ]);
  });

  it("pins a shrink that leaves the end beyond one viewport while a smooth scroll is in flight", async () => {
    const list = createList(bundle);
    list.dataChange();
    await list.frame();
    list.layoutLeavesEndBeyondThreshold();
    await list.frame(468);
    list.scrolled(2030);
    await list.frame();
    expect(list.scrollToEnd.mock.calls).toEqual([[{ animated: true }], [{ animated: false }]]);
    // A later MVCP adjustment rebases on this offset, so it must be the pinned one.
    expect(list.state.scroll).toBe(2200);
    list.reachEnd();
    for (let index = 0; index < 32; index++) await list.frame();
    list.dataChange();
    await list.frame();
    expect(list.scrollToEnd.mock.calls.at(-1)).toEqual([{ animated: true }]);
  });

  it("drops a queued resize pin once the reader scrolls away", async () => {
    const list = createList(bundle);
    await list.frame(700);
    list.releaseFollow();
    await list.frame();
    expect(list.scrollToEnd).not.toHaveBeenCalled();
  });
});
