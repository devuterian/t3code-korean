import { ACTIVE_THREAD_SORT_OPTIONS } from "@t3tools/client-runtime/state/shared-settings";
import type { ActiveThreadSortOrder } from "@t3tools/contracts/settings";
import type { EnvironmentId } from "@t3tools/contracts";
import { translate } from "../../i18n/translate";

import type { AppBarMenuItem } from "../../components/ui/AppBar.types";

export interface HomeListFilterMenuEnvironment {
  readonly environmentId: EnvironmentId;
  readonly label: string;
}

export interface HomeListFilterMenuProject {
  readonly key: string;
  readonly label: string;
}

/** Shared sorting is offered only when a connected environment can persist the preference. */
export function buildHomeListFilterMenuItems(props: {
  readonly environments: ReadonlyArray<HomeListFilterMenuEnvironment>;
  readonly projects: ReadonlyArray<HomeListFilterMenuProject>;
  readonly selectedEnvironmentId: EnvironmentId | null;
  readonly selectedProjectKey: string | null;
  readonly onEnvironmentChange: (environmentId: EnvironmentId | null) => void;
  readonly onProjectChange: (projectKey: string | null) => void;
  readonly activeThreadSort?: {
    order: ActiveThreadSortOrder;
    onChange: (order: ActiveThreadSortOrder) => void;
  };
  /** Language-bound translator from useTranslate, so memoized menus follow language changes. */
  readonly t?: (source: string) => string;
}): AppBarMenuItem[] {
  const t = props.t ?? ((source: string) => translate(source));
  const items: AppBarMenuItem[] = [
    {
      id: "environment",
      title: t("Environment"),
      items: [
        {
          id: "environment:all",
          title: t("All environments"),
          subtitle: t("Show threads from every environment"),
          selected: props.selectedEnvironmentId === null,
          onPress: () => props.onEnvironmentChange(null),
        },
        ...props.environments.map((environment) => ({
          id: `environment:${environment.environmentId}`,
          title: environment.label,
          selected: props.selectedEnvironmentId === environment.environmentId,
          onPress: () => props.onEnvironmentChange(environment.environmentId),
        })),
      ],
    },
  ];

  if (props.projects.length > 0) {
    items.push({
      id: "project",
      title: t("Project"),
      items: [
        {
          id: "project:all",
          title: t("All projects"),
          subtitle: t("Show threads from every project"),
          selected: props.selectedProjectKey === null,
          onPress: () => props.onProjectChange(null),
        },
        ...props.projects.map((project) => ({
          id: `project:${project.key}`,
          title: project.label,
          selected: props.selectedProjectKey === project.key,
          onPress: () => props.onProjectChange(project.key),
        })),
      ],
    });
  }

  if (props.activeThreadSort) {
    const sort = props.activeThreadSort;
    items.push({
      id: "active-sort",
      title: t("Sort active threads"),
      items: ACTIVE_THREAD_SORT_OPTIONS.map((option) => ({
        id: `active-sort:${option.value}`,
        title: t(option.label),
        selected: sort.order === option.value,
        onPress: () => sort.onChange(option.value),
      })),
    });
  }

  return items;
}
