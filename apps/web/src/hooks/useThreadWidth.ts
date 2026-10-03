import * as Schema from "effect/Schema";
import { useCallback, type CSSProperties } from "react";

import { useLocalStorage } from "./useLocalStorage";

export const THREAD_WIDTH_STORAGE_KEY = "t3code:thread-width-expansion";
export const THREAD_WIDTH_STEP = 5;

/** Normalize stored input to a bounded expansion in five-percent steps. */
export function normalizeThreadWidth(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(100, Math.max(0, Math.round(value / THREAD_WIDTH_STEP) * THREAD_WIDTH_STEP))
    : 0;
}

/**
 * Interpolate the Chat width setting's cap toward the available chat pane.
 * Returns nothing at 0% so the Appearance setting applies unchanged.
 */
export function threadWidthStyle(expansion: number): CSSProperties | undefined {
  const ratio = normalizeThreadWidth(expansion) / 100;
  if (ratio === 0) return undefined;
  // --chat-content-base-width is resolved on :root from the Chat width
  // setting. Percentages resolve where the cap is used (the chat pane), so
  // the content adapts when a right panel takes space.
  return {
    "--chat-content-max-width": `calc(var(--chat-content-base-width) * ${1 - ratio} + 100% * ${ratio})`,
  } as CSSProperties;
}

/** Share a device-local width preference between the toolbar and chat layout. */
export function useThreadWidth() {
  const [stored, setStored] = useLocalStorage<unknown, unknown>(
    THREAD_WIDTH_STORAGE_KEY,
    0,
    Schema.Unknown,
  );
  const setExpansion = useCallback(
    (value: number) => setStored(normalizeThreadWidth(value)),
    [setStored],
  );
  return [normalizeThreadWidth(stored), setExpansion] as const;
}

export const FIT_TABLES_STORAGE_KEY = "t3code:fit-tables";

/** Opt into table wrapping while preserving existing table behavior. */
export function useFitTables() {
  const [stored, setStored] = useLocalStorage<unknown, unknown>(
    FIT_TABLES_STORAGE_KEY,
    false,
    Schema.Unknown,
  );
  const setFitTables = useCallback((value: boolean) => setStored(value), [setStored]);
  return [typeof stored === "boolean" ? stored : false, setFitTables] as const;
}
