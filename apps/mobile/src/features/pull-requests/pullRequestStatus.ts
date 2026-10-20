import type {
  PullRequestActivity,
  PullRequestCheck,
  PullRequestChecksState,
  PullRequestDetail,
  PullRequestListEntry,
  PullRequestMergeability,
} from "@t3tools/contracts";
import type { AppSymbolName } from "../../components/ui/AppSymbol";
import { translate } from "../../i18n/translate";
import { PullRequestGlyph } from "./pullRequestGlyphs";

const STATES = {
  open: {
    label: "Open",
    icon: PullRequestGlyph.pullRequest,
    tint: "accent-adaptive-emerald-600-400",
    text: "text-adaptive-emerald-600-400",
    background: "bg-adaptive-emerald-500-a12-a16",
  },
  merged: {
    label: "Merged",
    icon: PullRequestGlyph.merged,
    tint: "accent-adaptive-violet-600-400",
    text: "text-adaptive-violet-600-400",
    background: "bg-adaptive-violet-500-a12-a16",
  },
  closed: {
    label: "Closed",
    icon: PullRequestGlyph.closed,
    tint: "accent-danger-foreground",
    text: "text-danger-foreground",
    background: "bg-danger",
  },
  draft: {
    label: "Draft",
    icon: PullRequestGlyph.draft,
    tint: "accent-icon-muted",
    text: "text-foreground-muted",
    background: "bg-grouped-card",
  },
} satisfies Record<
  string,
  { label: string; icon: AppSymbolName; tint: string; text: string; background: string }
>;

/** "Open" is also a verb elsewhere, so the open state translates from the lowercase key. */
export function pullRequestStateLabel(label: string) {
  if (label !== "Open") return translate(label);
  const state = translate("open");
  return state === "open" ? label : state;
}

export function pullRequestStatus(pr: Pick<PullRequestListEntry, "state" | "isDraft">) {
  const state = STATES[pr.isDraft && pr.state === "open" ? "draft" : pr.state];
  return { ...state, label: pullRequestStateLabel(state.label) };
}

export function pullRequestConflict(pr: {
  readonly state: PullRequestListEntry["state"];
  readonly isDraft: boolean;
  readonly mergeability?: PullRequestMergeability | undefined;
  readonly baseBranch?: string | undefined;
}) {
  if (pr.state !== "open" || pr.isDraft || pr.mergeability !== "conflicting") return null;
  return {
    label: pr.baseBranch
      ? translate("Conflicts with {branch}", { branch: pr.baseBranch })
      : translate("Has conflicts"),
  };
}

export function checkStatus(check: PullRequestCheck) {
  switch (check.status) {
    case "success":
      return {
        label: translate("Passed"),
        icon: "checkmark.circle",
        tint: "accent-adaptive-emerald-600-400",
      } as const;
    case "failure":
      return {
        label: translate("Failed"),
        icon: "exclamationmark.circle",
        tint: "accent-danger-foreground",
      } as const;
    case "action-required":
      return {
        label: translate("Action required"),
        icon: "exclamationmark.circle",
        tint: "accent-warning-foreground",
      } as const;
    case "pending":
      return {
        label: translate("Pending"),
        icon: "clock",
        tint: "accent-warning-foreground",
      } as const;
    case "cancelled":
      return { label: translate("Cancelled"), icon: "minus", tint: "accent-icon-muted" } as const;
    case "skipped":
      return {
        label: translate("Skipped"),
        icon: "slash.circle",
        tint: "accent-icon-muted",
      } as const;
    case "neutral":
      return { label: translate("Neutral"), icon: "minus", tint: "accent-icon-muted" } as const;
  }
}

export function pullRequestChecksSummary(pr: Pick<PullRequestDetail, "checks">) {
  const failed = pr.checks.filter((check) => check.status === "failure").length;
  const required = pr.checks.filter((check) => check.status === "action-required").length;
  const pending = pr.checks.filter((check) => check.status === "pending").length;
  const passed = pr.checks.filter((check) => check.status === "success").length;
  const count = pr.checks.length
    ? translate("{passed} of {total}", { passed, total: pr.checks.length })
    : undefined;
  if (failed)
    return {
      label: translate(failed === 1 ? "{count} check failing" : "{count} checks failing", {
        count: failed,
      }),
      title: translate(failed === 1 ? "{count} check failing" : "{count} checks failing", {
        count: failed,
      }),
      count,
      icon: "exclamationmark.circle",
      tint: "accent-danger-foreground",
    } as const;
  if (required)
    return {
      label: translate("{count} need attention", { count: required }),
      title: translate("Checks need attention"),
      count: translate("{count} awaiting action", { count: required }),
      icon: "exclamationmark.circle",
      tint: "accent-warning-foreground",
    } as const;
  if (pending)
    return {
      label: translate("{count} pending", { count: pending }),
      title: translate("Checks running"),
      count: translate("{count} pending", { count: pending }),
      icon: "clock",
      tint: "accent-warning-foreground",
    } as const;
  if (passed)
    return {
      label: translate("{passed} of {total} passed", { passed, total: pr.checks.length }),
      title: translate(passed === pr.checks.length ? "All checks passed" : "Checks completed"),
      count,
      icon: "checkmark.circle",
      tint: "accent-adaptive-emerald-600-400",
    } as const;
  return {
    label: pr.checks.length
      ? translate("{count} completed", { count: pr.checks.length })
      : translate("No checks reported"),
    title: translate(pr.checks.length ? "Checks completed" : "No checks reported"),
    count,
    icon: "minus",
    tint: "accent-icon-muted",
  } as const;
}

export function pullRequestReviewSummary(
  pr: Pick<PullRequestDetail, "reviewers">,
  activity: Pick<PullRequestActivity, "comments" | "commits"> | null,
) {
  const latest = new Map<string, PullRequestActivity["comments"][number]>();
  const comments = new Map<string, PullRequestActivity["comments"][number]>();
  for (const review of activity?.comments ?? []) {
    if (review.kind !== "review" || !review.reviewState) continue;
    const state = review.reviewState.toUpperCase().replaceAll("-", "_");
    const key = review.author?.login ?? review.id;
    if (state === "COMMENTED") {
      const previous = comments.get(key);
      if (!previous || Date.parse(review.createdAt) >= Date.parse(previous.createdAt))
        comments.set(key, { ...review, reviewState: state });
      continue;
    }
    if (!["APPROVED", "CHANGES_REQUESTED", "DISMISSED"].includes(state)) continue;
    const previous = latest.get(key);
    if (!previous || Date.parse(review.createdAt) >= Date.parse(previous.createdAt))
      latest.set(key, { ...review, reviewState: state });
  }
  const reviews = [
    ...[...latest.values()].filter((review) => review.reviewState !== "DISMISSED"),
    ...[...comments.entries()].filter(([key]) => !latest.has(key)).map(([, review]) => review),
  ];
  const requested = reviews.filter((review) => review.reviewState === "CHANGES_REQUESTED");
  const newestCommit = Math.max(
    0,
    ...(activity?.commits.map((commit) => Date.parse(commit.committedDate)) ?? []),
  );
  const approved = reviews.filter(
    (review) => review.reviewState === "APPROVED" && Date.parse(review.createdAt) >= newestCommit,
  );
  if (requested.length)
    return {
      title: translate("Changes requested"),
      count: translate(requested.length === 1 ? "{count} reviewer" : "{count} reviewers", {
        count: requested.length,
      }),
      icon: "xmark.circle.fill",
      tint: "accent-danger-foreground",
      reviews,
    } as const;
  if (approved.length)
    return {
      title:
        approved.length === 1 && approved[0]?.author
          ? translate("Approved by {login}", { login: approved[0].author.login })
          : translate("Reviews approved"),
      count: translate("{count} approved", { count: approved.length }),
      icon: "checkmark.circle",
      tint: "accent-adaptive-emerald-600-400",
      reviews,
    } as const;
  const commented = reviews.filter((review) => review.reviewState === "COMMENTED");
  if (commented.length && !pr.reviewers.length)
    return {
      title: translate("Reviews"),
      count: translate("{count} commented", { count: commented.length }),
      icon: "bubble.left",
      tint: "accent-icon-muted",
      reviews,
    } as const;
  return {
    title: translate(pr.reviewers.length ? "Awaiting review" : "Request a review"),
    count: pr.reviewers.length
      ? translate("{count} requested", { count: pr.reviewers.length })
      : translate("None assigned"),
    icon: "person.2",
    tint: "accent-icon-muted",
    reviews,
  } as const;
}

export function pullRequestBranchSummary(
  pr: Pick<PullRequestDetail, "mergeability" | "baseComparison" | "behindBy" | "baseBranch">,
) {
  if (pr.mergeability === "conflicting") return translate("Has conflicts");
  if (pr.baseComparison === "behind")
    return translate("{count} behind {branch}", {
      count: pr.behindBy ?? "",
      branch: pr.baseBranch,
    }).trim();
  if (pr.baseComparison === "up-to-date") return translate("Up to date");
  return translate(pr.mergeability === "mergeable" ? "No conflicts" : "Not reported");
}

export function pullRequestChecksStatus(state: PullRequestChecksState) {
  if (state === "passing")
    return { icon: "checkmark.circle", tint: "accent-adaptive-emerald-600-400" } as const;
  if (state === "failing")
    return { icon: "xmark.circle.fill", tint: "accent-danger-foreground" } as const;
  return { icon: "clock", tint: "accent-warning-foreground" } as const;
}
