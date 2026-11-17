import type { EnvironmentId } from "@t3tools/contracts";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";

/** Korean fork: tailnet auto-connect. */

export interface TailnetDismissalStorage {
  readonly read: Effect.Effect<ReadonlyArray<EnvironmentId>>;
  readonly write: (ids: ReadonlyArray<EnvironmentId>) => Effect.Effect<void>;
}

export interface TailnetDismissalsService {
  readonly list: Effect.Effect<ReadonlySet<EnvironmentId>>;
  readonly add: (environmentId: EnvironmentId) => Effect.Effect<void>;
  readonly forget: (environmentId: EnvironmentId) => Effect.Effect<void>;
}

/** Environments the user removed, so tailnet auto-connect does not add them back. */
export function makeTailnetDismissals(storage: TailnetDismissalStorage): TailnetDismissalsService {
  const change = Effect.fn("TailnetDismissals.change")(function* (
    environmentId: EnvironmentId,
    present: boolean,
  ) {
    const current = yield* storage.read;
    if (current.includes(environmentId) === present) return;
    yield* storage.write(
      present ? [...current, environmentId] : current.filter((id) => id !== environmentId),
    );
  });
  return {
    list: storage.read.pipe(Effect.map((ids) => new Set(ids) as ReadonlySet<EnvironmentId>)),
    add: (environmentId) => change(environmentId, true),
    forget: (environmentId) => change(environmentId, false),
  };
}

export class TailnetDismissals extends Context.Reference<TailnetDismissalsService>(
  "@t3tools/client-runtime/connection/TailnetDismissals",
  {
    defaultValue: () => {
      let ids: ReadonlyArray<EnvironmentId> = [];
      return makeTailnetDismissals({
        read: Effect.sync(() => ids),
        write: (next) =>
          Effect.sync(() => {
            ids = next;
          }),
      });
    },
  },
) {}
