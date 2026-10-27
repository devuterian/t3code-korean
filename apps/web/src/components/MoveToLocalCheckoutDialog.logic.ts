import type {
  ThreadMoveToLocalCheckoutFileChange,
  ThreadMoveToLocalCheckoutPreview,
} from "@t3tools/contracts";

import { translate } from "../i18n/translate";

/** Translates a source string, then fills its `{name}` placeholders. */
function fill(source: string, values: Readonly<Record<string, string | number>>): string {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, () => String(value)),
    translate(source),
  );
}

const plural = (count: number, one: string, many: string) =>
  fill(count === 1 ? one : many, { count });

/** "2 staged, 1 unstaged, 3 new files", or null when nothing comes along. */
export function describeChanges(
  changes: ThreadMoveToLocalCheckoutPreview["changes"],
): string | null {
  const parts = [
    changes.staged > 0 ? fill("{count} staged", { count: changes.staged }) : null,
    changes.unstaged > 0 ? fill("{count} unstaged", { count: changes.unstaged }) : null,
    changes.untracked > 0
      ? plural(changes.untracked, "{count} new file", "{count} new files")
      : null,
  ].filter((part) => part !== null);
  return parts.length === 0 ? null : parts.join(", ");
}

/** How the thread's branch relates to the commit the checkout is on now. */
export function describeBranchDistance(
  preview: Pick<
    ThreadMoveToLocalCheckoutPreview,
    "commitsAhead" | "commitsBehind" | "currentLocalBranch"
  >,
): string | null {
  const { commitsAhead: ahead, commitsBehind: behind } = preview;
  if (ahead === null || behind === null) return null;
  const base = preview.currentLocalBranch ?? translate("the current commit");
  const commits = (count: number) => plural(count, "{count} commit", "{count} commits");
  if (ahead === 0 && behind === 0) return fill("Same commit as {base}", { base });
  if (behind === 0) return fill("{commits} ahead of {base}", { commits: commits(ahead), base });
  if (ahead === 0) return fill("{commits} behind {base}", { commits: commits(behind), base });
  return fill("{commits} ahead of {base}, {behind} behind", {
    commits: commits(ahead),
    base,
    behind,
  });
}

export const FILE_CHANGE_LABEL: Record<ThreadMoveToLocalCheckoutFileChange["change"], string> = {
  staged: "Staged",
  unstaged: "Unstaged",
  staged_and_unstaged: "Staged + unstaged",
  untracked: "New",
};

/** The success toast's description: where the thread is now and what came with it. */
export function describeMoveResult(result: {
  readonly branch: string;
  readonly carriedChanges: boolean;
  readonly previousWorktreeKept: boolean;
}): string {
  return [
    fill("Now on {branch}.", { branch: result.branch }),
    result.carriedChanges ? translate("Your uncommitted changes came along.") : null,
    result.previousWorktreeKept ? translate("The old worktree folder keeps its own copy.") : null,
  ]
    .filter((line) => line !== null)
    .join(" ");
}

/** Readable text for a failed request, including an older server that lacks the move. */
export function moveErrorMessage(error: unknown, fallback: string): string {
  if (String(error).includes("Unknown request tag")) {
    return translate("This T3 Code server can't move threads yet. Update it, then try again.");
  }
  return error instanceof Error && error.message.length > 0 ? error.message : translate(fallback);
}
