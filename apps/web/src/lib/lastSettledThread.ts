interface SettleableThread {
  readonly environmentId: string;
  readonly archivedAt: string | null;
  readonly settledOverride: "settled" | "active" | null;
  readonly settledAt: string | null;
}

/**
 * The thread the user most recently settled by hand, so one shortcut can undo
 * an accidental settle without hunting through the Settled section.
 */
export function findLastSettledThread<T extends SettleableThread>(
  threads: ReadonlyArray<T>,
  supportsSettlement: (environmentId: T["environmentId"]) => boolean,
): T | null {
  let latest: T | null = null;
  let latestMs = -Infinity;
  for (const thread of threads) {
    if (thread.archivedAt !== null || thread.settledOverride !== "settled") continue;
    const settledMs = thread.settledAt === null ? NaN : Date.parse(thread.settledAt);
    if (!Number.isFinite(settledMs) || settledMs <= latestMs) continue;
    if (!supportsSettlement(thread.environmentId)) continue;
    latest = thread;
    latestMs = settledMs;
  }
  return latest;
}
