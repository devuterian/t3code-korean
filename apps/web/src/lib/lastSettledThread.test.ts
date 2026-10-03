import { describe, expect, it } from "vite-plus/test";

import { findLastSettledThread } from "./lastSettledThread";

function thread(
  id: string,
  overrides: Partial<{
    environmentId: string;
    archivedAt: string | null;
    settledOverride: "settled" | "active" | null;
    settledAt: string | null;
  }> = {},
) {
  return {
    id,
    environmentId: "env-1",
    archivedAt: null,
    settledOverride: "settled" as const,
    settledAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("findLastSettledThread", () => {
  it("picks the most recently settled thread", () => {
    const threads = [
      thread("a", { settledAt: "2026-01-01T00:00:00.000Z" }),
      thread("b", { settledAt: "2026-01-03T00:00:00.000Z" }),
      thread("c", { settledAt: "2026-01-02T00:00:00.000Z" }),
    ];
    expect(findLastSettledThread(threads, () => true)?.id).toBe("b");
  });

  it("skips archived, unsettled, undated, and unsupported threads", () => {
    const threads = [
      thread("archived", {
        archivedAt: "2026-02-01T00:00:00.000Z",
        settledAt: "2026-02-01T00:00:00.000Z",
      }),
      thread("active", { settledOverride: "active", settledAt: "2026-02-01T00:00:00.000Z" }),
      thread("undated", { settledAt: null }),
      thread("invalid", { settledAt: "not a date" }),
      thread("old-server", { environmentId: "env-old", settledAt: "2026-02-01T00:00:00.000Z" }),
      thread("ok"),
    ];
    expect(findLastSettledThread(threads, (environmentId) => environmentId !== "env-old")?.id).toBe(
      "ok",
    );
  });

  it("returns null when nothing is settled", () => {
    expect(findLastSettledThread([thread("a", { settledOverride: null })], () => true)).toBeNull();
  });
});
