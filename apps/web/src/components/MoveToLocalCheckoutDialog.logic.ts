import type {
  ThreadMoveToLocalCheckoutFileChange,
  ThreadMoveToLocalCheckoutPreview,
} from "@t3tools/contracts";

import { msg } from "gt-react";

import { m, type MessageResolver } from "../i18n/messages";

/** "2 staged, 1 unstaged, 3 new files", or null when nothing comes along. */
export function describeChanges(
  changes: ThreadMoveToLocalCheckoutPreview["changes"],
  resolve: MessageResolver = m,
): string | null {
  const parts = [
    changes.staged > 0 ? resolve(msg("{count} staged", { count: changes.staged })) : null,
    changes.unstaged > 0 ? resolve(msg("{count} unstaged", { count: changes.unstaged })) : null,
    changes.untracked > 0
      ? resolve(
          msg("{count, plural, one {{count} new file} other {{count} new files}}", {
            count: changes.untracked,
          }),
        )
      : null,
  ].filter((part) => part !== null);
  return parts.length === 0 ? null : parts.join(", ");
}

const commitsLabel = (count: number, resolve: MessageResolver) =>
  resolve(msg("{count, plural, one {{count} commit} other {{count} commits}}", { count }));

/** How the thread's branch relates to the commit the checkout is on now. */
export function describeBranchDistance(
  preview: Pick<
    ThreadMoveToLocalCheckoutPreview,
    "commitsAhead" | "commitsBehind" | "currentLocalBranch"
  >,
  resolve: MessageResolver = m,
): string | null {
  const { commitsAhead: ahead, commitsBehind: behind } = preview;
  if (ahead === null || behind === null) return null;
  const base = preview.currentLocalBranch ?? resolve(msg("the current commit"));
  if (ahead === 0 && behind === 0) return resolve(msg("Same commit as {base}", { base }));
  if (behind === 0) {
    return resolve(
      msg("{commits} ahead of {base}", { commits: commitsLabel(ahead, resolve), base }),
    );
  }
  if (ahead === 0) {
    return resolve(
      msg("{commits} behind {base}", { commits: commitsLabel(behind, resolve), base }),
    );
  }
  return resolve(
    msg("{commits} ahead of {base}, {behind} behind", {
      commits: commitsLabel(ahead, resolve),
      base,
      behind,
    }),
  );
}

/** Labels are `msg()` strings; components resolve them with `useMessages()`. */
export const FILE_CHANGE_LABEL: Record<ThreadMoveToLocalCheckoutFileChange["change"], string> = {
  staged: msg("Staged"),
  unstaged: msg("Unstaged"),
  staged_and_unstaged: msg("Staged + unstaged"),
  untracked: msg("New", { $context: "label for an untracked file in a git change list" }),
};

/** The success toast's description: where the thread is now and what came with it. */
export function describeMoveResult(
  result: {
    readonly branch: string;
    readonly carriedChanges: boolean;
    readonly previousWorktreeKept: boolean;
  },
  resolve: MessageResolver = m,
): string {
  return [
    resolve(msg("Now on {branch}.", { branch: result.branch })),
    result.carriedChanges ? resolve(msg("Your uncommitted changes came along.")) : null,
    result.previousWorktreeKept
      ? resolve(msg("The old worktree folder keeps its own copy."))
      : null,
  ]
    .filter((line) => line !== null)
    .join(" ");
}

/** Readable text for a failed request, including an older server that lacks the move. */
export function moveErrorMessage(
  error: unknown,
  fallback: string,
  resolve: MessageResolver = m,
): string {
  if (String(error).includes("Unknown request tag")) {
    return resolve(msg("This T3 Code server can't move threads yet. Update it, then try again."));
  }
  return error instanceof Error && error.message.length > 0 ? error.message : resolve(fallback);
}
