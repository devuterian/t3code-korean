import { act, useEffect, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";

import {
  FIT_TABLES_STORAGE_KEY,
  threadWidthStyle,
  useFitTables,
  THREAD_WIDTH_STORAGE_KEY,
  useThreadWidth,
} from "./useThreadWidth";

it("drives the shared chat-width variable used by rows, composer, and minimap measurement", () => {
  // 0% leaves the Appearance Chat width setting in charge.
  expect(threadWidthStyle(0)).toBeUndefined();
  expect(threadWidthStyle(50)).toEqual({
    "--chat-content-max-width": "calc(var(--chat-content-base-width) * 0.5 + 100% * 0.5)",
  });
  expect(threadWidthStyle(100)).toEqual({
    "--chat-content-max-width": "calc(var(--chat-content-base-width) * 0 + 100% * 1)",
  });
});

let root: Root | undefined;
let current: ReturnType<typeof useThreadWidth>;
let other: ReturnType<typeof useThreadWidth>;

function Reader({ secondary = false }: { secondary?: boolean }) {
  const value = useThreadWidth();
  useEffect(() => {
    if (secondary) other = value;
    else current = value;
  }, [secondary, value]);
  return null;
}

beforeEach(() => {
  window.localStorage.clear();
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
});

afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

function mount(node: ReactNode) {
  root = createRoot(document.createElement("div"));
  root.render(node);
}

function storageChanged(key: string) {
  window.dispatchEvent(new StorageEvent("storage", { key }));
}
it("starts at the original width and shares changes between the toolbar and conversation", async () => {
  await act(() => {
    mount(
      <>
        <Reader />
        <Reader secondary />
      </>,
    );
  });
  expect(current[0]).toBe(0);
  await act(() => current[1](5));
  expect(other[0]).toBe(5);
  expect(window.localStorage.getItem(THREAD_WIDTH_STORAGE_KEY)).toBe("5");
  await act(() => other[1](100));
  expect(current[0]).toBe(100);
  await act(() => current[1](0));
  expect(other[0]).toBe(0);
});

it("retains the preference when navigating or restarting the client", async () => {
  await act(() => {
    mount(<Reader />);
  });
  await act(() => current[1](65));
  await act(() => root!.unmount());
  await act(() => {
    mount(<Reader />);
  });
  expect(current[0]).toBe(65);
});

it("follows a preference changed by another window", async () => {
  await act(() => {
    mount(<Reader />);
  });
  window.localStorage.setItem(THREAD_WIDTH_STORAGE_KEY, "85");
  await act(() => {
    storageChanged(THREAD_WIDTH_STORAGE_KEY);
  });
  expect(current[0]).toBe(85);
});

it.each([
  { value: -20, expected: 0 },
  { value: 123, expected: 100 },
  { value: 32, expected: 30 },
  { value: null, expected: 0 },
  { value: "wide", expected: 0 },
  { value: {}, expected: 0 },
])(
  "keeps invalid stored width $value usable and accepts a subsequent adjustment",
  async ({ value, expected }) => {
    window.localStorage.setItem(THREAD_WIDTH_STORAGE_KEY, JSON.stringify(value));
    await act(() => {
      mount(<Reader />);
    });
    expect(current[0]).toBe(expected);
    await act(() => current[1](55));
    expect(current[0]).toBe(55);
    expect(window.localStorage.getItem(THREAD_WIDTH_STORAGE_KEY)).toBe("55");
  },
);

it("clamps controls at the endpoints and quantizes every adjustment to five percent", async () => {
  await act(() => {
    mount(<Reader />);
  });
  for (const [input, expected] of [
    [-5, 0],
    [105, 100],
    [27, 25],
    [28, 30],
    [95, 95],
  ]) {
    await act(() => current[1](input!));
    expect(current[0]).toBe(expected);
  }
});

let fit: ReturnType<typeof useFitTables>;
let otherFit: ReturnType<typeof useFitTables>;
function FitReader({ secondary = false }: { secondary?: boolean }) {
  const value = useFitTables();
  useEffect(() => {
    if (secondary) otherFit = value;
    else fit = value;
  }, [secondary, value]);
  return null;
}
it("preserves existing table behavior by default and synchronizes opt-in across consumers", async () => {
  await act(() => {
    mount(
      <>
        <FitReader />
        <FitReader secondary />
        <Reader />
      </>,
    );
  });
  expect(fit[0]).toBe(false);
  await act(() => fit[1](true));
  expect(otherFit[0]).toBe(true);
  expect(window.localStorage.getItem(FIT_TABLES_STORAGE_KEY)).toBe("true");
  expect(current[0]).toBe(0);
  await act(() => otherFit[1](false));
  expect(fit[0]).toBe(false);
});
it.each([true, false])(
  "preserves an explicit Fit tables %s choice across navigation and restart",
  async (enabled) => {
    window.localStorage.setItem(FIT_TABLES_STORAGE_KEY, JSON.stringify(enabled));
    await act(() => {
      mount(<FitReader />);
    });
    expect(fit[0]).toBe(enabled);
    await act(() => fit[1](!enabled));
    await act(() => root!.unmount());
    await act(() => {
      mount(<FitReader />);
    });
    expect(fit[0]).toBe(!enabled);
  },
);
it("updates tables when another window changes the fit preference", async () => {
  await act(() => {
    mount(<FitReader />);
  });
  window.localStorage.setItem(FIT_TABLES_STORAGE_KEY, "true");
  await act(() => {
    storageChanged(FIT_TABLES_STORAGE_KEY);
  });
  expect(fit[0]).toBe(true);
});
it.each(["{}", "null", '"false"'])(
  "defaults safely with invalid Fit tables storage %s",
  async (value) => {
    window.localStorage.setItem(FIT_TABLES_STORAGE_KEY, value);
    await act(() => {
      mount(<FitReader />);
    });
    expect(fit[0]).toBe(false);
    await act(() => fit[1](true));
    expect(fit[0]).toBe(true);
  },
);
