import { sortProjectsByGroupOrder } from "@t3tools/client-runtime/state/project-grouping";
import { useMemo } from "react";
import { ScrollView } from "react-native";
import { useTranslate } from "../../i18n/translate";
import type { ControlPillMenuProps } from "../../components/ControlPillMenu.types";
import { ListFilterMenu } from "../workspace/ListFilterMenu";
import { useProjects, useThreadShells } from "../../state/entities";
import { useMobileProjectGroupingSettings } from "../../state/project-grouping";
import { buildHomeProjectScopes, sortHomeProjectScopes } from "../home/homeThreadList";
import { DEFAULT_PR_LIST_CONTROLS, type PullRequestListControls } from "./pullRequestList";
import { pullRequestStateLabel } from "./pullRequestStatus";

const STATES = { open: "Open", closed: "Closed", merged: "Merged", all: "All states" } as const;
const INVOLVEMENT = { all: "All PRs", reviewing: "Your review", authored: "By you" } as const;
const DRAFTS = { all: "All drafts", only: "Drafts only", hide: "Hide drafts" } as const;
const REVIEWS = {
  all: "All reviews",
  approved: "Approved",
  "changes-requested": "Changes requested",
  "review-required": "Review required",
  none: "No reviews",
} as const;
const CHECKS = { all: "All checks", passing: "Passing", failing: "Failing" } as const;
const SORTS = {
  updated: "Recently updated",
  created: "Newest created",
  oldest: "Oldest updated",
} as const;
const id = (field: string, value: string) => JSON.stringify([field, value]);
function translated<Options extends Readonly<Record<string, string>>>(
  options: Options,
  t: (source: string) => string,
) {
  return Object.fromEntries(
    Object.entries(options).map(([value, title]) => [value, t(title)]),
  ) as Record<keyof Options, string>;
}
function choices(field: string, options: Readonly<Record<string, string>>, selected: string) {
  return Object.entries(options).map(([value, title]) => ({
    id: id(field, value),
    title,
    state: value === selected ? ("on" as const) : ("off" as const),
  }));
}

/** The project list's own order, which is the order its sidebar and new-task picker show. */
function useProjectsInSidebarOrder<Project extends { id: string; environmentId: string }>(
  projects: readonly Project[],
) {
  const allProjects = useProjects();
  const threads = useThreadShells();
  const { sidebarProjectGroupingMode } = useMobileProjectGroupingSettings();
  const scopes = useMemo(
    () =>
      sortHomeProjectScopes({
        scopes: buildHomeProjectScopes({
          projects: allProjects,
          environmentId: null,
          projectGroupingMode: sidebarProjectGroupingMode,
        }),
        threads,
        pendingTasks: [],
        projectSortOrder: "updated_at",
      }).map((scope) => ({ memberProjectRefs: scope.projectRefs })),
    [allProjects, sidebarProjectGroupingMode, threads],
  );
  return useMemo(() => sortProjectsByGroupOrder(projects, scopes), [projects, scopes]);
}

export function PullRequestListFilters(props: {
  readonly environments: readonly { id: string; label: string }[];
  readonly environmentId: string | null;
  readonly onEnvironmentChange: (id: string | null) => void;
  readonly value: PullRequestListControls;
  readonly onChange: (value: PullRequestListControls) => void;
  readonly authors: readonly string[];
  readonly labels: readonly string[];
  readonly projects: readonly { id: string; title: string; environmentId: string }[];
}) {
  const { value } = props;
  const t = useTranslate();
  const states = translated(STATES, pullRequestStateLabel);
  const involvement = translated(INVOLVEMENT, t);
  const drafts = translated(DRAFTS, t);
  const reviews = translated(REVIEWS, t);
  const checks = translated(CHECKS, t);
  const sorts = translated(SORTS, t);
  const projects = useProjectsInSidebarOrder(props.projects);
  const selectedLabels = value.filters.labels?.flat() ?? [];
  const selectedLabelSet = new Set(selectedLabels);
  const author = value.filters.author;
  const select = (event: string) => {
    let selection: unknown;
    try {
      selection = JSON.parse(event);
    } catch {
      return;
    }
    if (
      !Array.isArray(selection) ||
      selection.length !== 2 ||
      typeof selection[0] !== "string" ||
      typeof selection[1] !== "string"
    )
      return;
    const [field, next] = selection;
    switch (field) {
      case "environment":
        if (next === "") props.onEnvironmentChange(null);
        else if (props.environments.some((environment) => environment.id === next))
          props.onEnvironmentChange(next);
        break;
      case "reset":
        props.onChange(DEFAULT_PR_LIST_CONTROLS);
        break;
      case "state":
        props.onChange({ ...value, state: next as PullRequestListControls["state"] });
        break;
      case "involvement":
        props.onChange({ ...value, involvement: next as PullRequestListControls["involvement"] });
        break;
      case "sort":
        props.onChange({ ...value, sort: next as PullRequestListControls["sort"] });
        break;
      case "project": {
        const project = projects.find(
          (project) => JSON.stringify([project.environmentId, project.id]) === next,
        );
        props.onChange({
          ...value,
          projectId: project?.id,
          projectEnvironmentId: project?.environmentId,
        });
        break;
      }
      case "label": {
        const labels = selectedLabels.includes(next)
          ? selectedLabels.filter((label) => label !== next)
          : [...selectedLabels, next].slice(0, 10);
        props.onChange({
          ...value,
          filters: {
            ...value.filters,
            labels: labels.length ? labels.map((label) => [label]) : undefined,
          },
        });
        break;
      }
      case "labels":
        props.onChange({ ...value, filters: { ...value.filters, labels: undefined } });
        break;
      case "author":
        props.onChange({ ...value, filters: { ...value.filters, author: next || undefined } });
        break;
      case "draft":
        props.onChange({
          ...value,
          filters: {
            ...value.filters,
            draft: next === "all" ? undefined : (next as "only" | "hide"),
          },
        });
        break;
      case "review":
        props.onChange({
          ...value,
          filters: {
            ...value.filters,
            review:
              next === "all"
                ? undefined
                : (next as NonNullable<PullRequestListControls["filters"]["review"]>),
          },
        });
        break;
      case "checks":
        props.onChange({
          ...value,
          filters: {
            ...value.filters,
            checks: next === "all" ? undefined : (next as "passing" | "failing"),
          },
        });
        break;
    }
  };
  const count =
    Number(value.state !== "open") +
    Number(value.involvement !== "all") +
    Number(Boolean(author)) +
    selectedLabels.length +
    Number(Boolean(value.filters.draft)) +
    Number(Boolean(value.filters.review)) +
    Number(Boolean(value.filters.checks)) +
    Number(Boolean(value.projectId));
  const more: ControlPillMenuProps["actions"] = [
    {
      id: "drafts",
      title: value.filters.draft ? drafts[value.filters.draft] : t("Drafts"),
      subactions: choices("draft", drafts, value.filters.draft ?? "all"),
    },
    {
      id: "reviews",
      title: value.filters.review ? reviews[value.filters.review] : t("Reviews"),
      subactions: choices("review", reviews, value.filters.review ?? "all"),
    },
    {
      id: "checks",
      title: value.filters.checks
        ? t("{value} checks", { value: checks[value.filters.checks] })
        : t("Checks"),
      subactions: choices("checks", checks, value.filters.checks ?? "all"),
    },
    {
      id: "projects",
      title:
        projects.find(
          (project) =>
            project.id === value.projectId && project.environmentId === value.projectEnvironmentId,
        )?.title ?? t("Project"),
      subactions: choices(
        "project",
        Object.fromEntries([
          ["", t("All projects")],
          ...projects.map((project) => [
            JSON.stringify([project.environmentId, project.id]),
            project.title,
          ]),
        ]),
        value.projectId ? JSON.stringify([value.projectEnvironmentId, value.projectId]) : "",
      ),
    },
    { id: "sort", title: sorts[value.sort], subactions: choices("sort", sorts, value.sort) },
    {
      id: id("reset", ""),
      title: t("Reset filters"),
      attributes: { disabled: count === 0 && value.sort === "updated" },
    },
  ];
  const labels = [...new Set([...selectedLabels, ...props.labels])].slice(0, 60);
  const authors = [
    ...new Set([...(author && author !== "me" ? [author] : []), ...props.authors]),
  ].slice(0, 60);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 2, paddingBottom: 10, gap: 8 }}
    >
      <ListFilterMenu
        label={count ? String(count) : t("Filters")}
        icon
        active={count > 0}
        accessibilityLabel={count ? t("Filters, {count} active", { count }) : t("More filters")}
        actions={more}
        onSelect={select}
      />
      {props.environments.length > 1 ? (
        <ListFilterMenu
          label={
            props.environments.find((environment) => environment.id === props.environmentId)
              ?.label ?? t("All environments")
          }
          accessibilityLabel={t("Choose pull request environment")}
          actions={choices(
            "environment",
            Object.fromEntries([
              ["", t("All environments")],
              ...props.environments.map((environment) => [environment.id, environment.label]),
            ]),
            props.environmentId ?? "",
          )}
          onSelect={select}
        />
      ) : null}
      <ListFilterMenu
        label={states[value.state]}
        active={value.state !== "open"}
        accessibilityLabel={t("Filter by state")}
        actions={choices("state", states, value.state)}
        onSelect={select}
      />
      <ListFilterMenu
        label={involvement[value.involvement]}
        active={value.involvement !== "all"}
        accessibilityLabel={t("Filter by involvement")}
        actions={choices("involvement", involvement, value.involvement)}
        onSelect={select}
      />
      <ListFilterMenu
        label={
          selectedLabels.length
            ? t("Labels {count}", { count: selectedLabels.length })
            : t("Labels")
        }
        active={selectedLabels.length > 0}
        accessibilityLabel={t("Filter by label")}
        actions={[
          {
            id: id("labels", ""),
            title: t("All labels"),
            state: selectedLabels.length ? "off" : "on",
          },
          ...labels.map((label) => ({
            id: id("label", label),
            title: label,
            state: selectedLabelSet.has(label) ? ("on" as const) : ("off" as const),
          })),
        ]}
        onSelect={select}
      />
      <ListFilterMenu
        label={author === "me" ? t("By you") : (author ?? t("Author"))}
        active={Boolean(author)}
        accessibilityLabel={t("Filter by author")}
        actions={choices(
          "author",
          Object.fromEntries([
            ["", t("All authors")],
            ["me", t("Me")],
            ...authors.map((login) => [login, login]),
          ]),
          author ?? "",
        )}
        onSelect={select}
      />
    </ScrollView>
  );
}
