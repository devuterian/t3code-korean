import { useEffect } from "react";
import { expect, it } from "vite-plus/test";

import { act, render } from "../../test/render";
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

/** Starts from empty storage and leaves it empty, so one test's width never reaches the next. */
function emptyStorage() {
  window.localStorage.clear();
  return { [Symbol.dispose]: () => window.localStorage.clear() };
}

function storageChanged(key: string) {
  window.dispatchEvent(new StorageEvent("storage", { key }));
}

it("starts at the original width and shares changes between the toolbar and conversation", async () => {
  using _storage = emptyStorage();
  await using _screen = await render(
    <>
      <Reader />
      <Reader secondary />
    </>,
    { router: false },
  );
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
  using _storage = emptyStorage();
  await using first = await render(<Reader />, { router: false });
  await act(() => current[1](65));
  await first.unmount();
  await using _second = await render(<Reader />, { router: false });
  expect(current[0]).toBe(65);
});

it("follows a preference changed by another window", async () => {
  using _storage = emptyStorage();
  await using _screen = await render(<Reader />, { router: false });
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
    using _storage = emptyStorage();
    window.localStorage.setItem(THREAD_WIDTH_STORAGE_KEY, JSON.stringify(value));
    await using _screen = await render(<Reader />, { router: false });
    expect(current[0]).toBe(expected);
    await act(() => current[1](55));
    expect(current[0]).toBe(55);
    expect(window.localStorage.getItem(THREAD_WIDTH_STORAGE_KEY)).toBe("55");
  },
);

it("clamps controls at the endpoints and quantizes every adjustment to five percent", async () => {
  using _storage = emptyStorage();
  await using _screen = await render(<Reader />, { router: false });
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
  using _storage = emptyStorage();
  await using _screen = await render(
    <>
      <FitReader />
      <FitReader secondary />
      <Reader />
    </>,
    { router: false },
  );
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
    using _storage = emptyStorage();
    window.localStorage.setItem(FIT_TABLES_STORAGE_KEY, JSON.stringify(enabled));
    await using first = await render(<FitReader />, { router: false });
    expect(fit[0]).toBe(enabled);
    await act(() => fit[1](!enabled));
    await first.unmount();
    await using _second = await render(<FitReader />, { router: false });
    expect(fit[0]).toBe(!enabled);
  },
);

it("updates tables when another window changes the fit preference", async () => {
  using _storage = emptyStorage();
  await using _screen = await render(<FitReader />, { router: false });
  window.localStorage.setItem(FIT_TABLES_STORAGE_KEY, "true");
  await act(() => {
    storageChanged(FIT_TABLES_STORAGE_KEY);
  });
  expect(fit[0]).toBe(true);
});

it.each(["{}", "null", '"false"'])(
  "defaults safely with invalid Fit tables storage %s",
  async (value) => {
    using _storage = emptyStorage();
    window.localStorage.setItem(FIT_TABLES_STORAGE_KEY, value);
    await using _screen = await render(<FitReader />, { router: false });
    expect(fit[0]).toBe(false);
    await act(() => fit[1](true));
    expect(fit[0]).toBe(true);
  },
);
