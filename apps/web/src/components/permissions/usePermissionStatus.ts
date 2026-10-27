import { useState, useSyncExternalStore } from "react";

import { useStableCallback } from "~/hooks/useStableCallback";
import { getDocumentActivity, subscribeDocumentActivity } from "~/lib/documentActivity";

const POLL_INTERVAL_MS = 1500;
const CHECK_FAILED_MESSAGE = "Could not check permissions. We'll try again automatically.";

interface PermissionSnapshot<Id extends string, Value> {
  readonly status: Record<Id, Value>;
  readonly error: string | null;
}

/**
 * Holds the last permission check result and polls while subscribed: on
 * subscribe, every interval, and when the window regains focus or visibility.
 * Checks are skipped while the tab is hidden and never overlap.
 */
export function createPermissionPoller<Id extends string, Value = boolean>(
  check: () => Promise<Record<Id, Value>>,
  initialStatus: Record<Id, Value>,
) {
  let snapshot: PermissionSnapshot<Id, Value> = { status: initialStatus, error: null };
  return {
    getSnapshot: () => snapshot,
    subscribe(onChange: () => void): () => void {
      let disposed = false;
      let checking = false;
      const publish = (next: PermissionSnapshot<Id, Value>) => {
        if (disposed) return;
        snapshot = next;
        onChange();
      };
      const refresh = async () => {
        if (disposed || checking || !getDocumentActivity().visible) return;
        checking = true;
        try {
          publish({ status: await check(), error: null });
        } catch {
          publish({ status: snapshot.status, error: CHECK_FAILED_MESSAGE });
        }
        checking = false;
      };
      void refresh();
      const timer = setInterval(() => void refresh(), POLL_INTERVAL_MS);
      let previous = getDocumentActivity();
      const stopActivity = subscribeDocumentActivity(() => {
        const next = getDocumentActivity();
        const regained = (next.focused && !previous.focused) || next.visible !== previous.visible;
        previous = next;
        if (regained) void refresh();
      });
      return () => {
        disposed = true;
        clearInterval(timer);
        stopActivity();
      };
    },
  };
}

const noopSubscribe = () => () => {};

/**
 * Each check calls the latest `check`, since callers close over props. `initialStatus` is
 * read once, when the component mounts, and the subscription only restarts when `enabled` flips.
 */
export function usePermissionStatus<Id extends string, Value = boolean>(
  check: () => Promise<Record<Id, Value>>,
  initialStatus: Record<Id, Value>,
  enabled = true,
) {
  const checkLatest = useStableCallback(check);
  const [poller] = useState(() => createPermissionPoller(checkLatest, initialStatus));
  const { status, error } = useSyncExternalStore(
    enabled ? poller.subscribe : noopSubscribe,
    poller.getSnapshot,
  );
  return {
    status,
    error,
    isReady: (required: readonly Id[]) =>
      error === null && required.every((id) => status[id] === true),
  };
}
