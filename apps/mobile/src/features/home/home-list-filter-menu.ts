import { ACTIVE_THREAD_SORT_OPTIONS } from "@t3tools/client-runtime/state/shared-settings";
import type { ActiveThreadSortOrder } from "@t3tools/contracts/settings";
import type { EnvironmentId } from "@t3tools/contracts";
import { translate } from "../../i18n/translate";

export interface HomeListFilterMenuEnvironment {
  readonly environmentId: EnvironmentId;
  readonly label: string;
}

export interface HomeListFilterMenuProject {
  readonly key: string;
  readonly label: string;
}

type HomeListFilterMenuAction = {
  readonly type: "action";
  readonly title: string;
  readonly subtitle?: string;
  readonly state?: "on" | "off";
  readonly onPress: () => void;
};

type HomeListFilterMenuSubmenu = {
  readonly type: "submenu";
  readonly title: string;
  readonly items: HomeListFilterMenuAction[];
};

export interface HomeListFilterMenu {
  readonly title: string;
  readonly items: Array<HomeListFilterMenuAction | HomeListFilterMenuSubmenu>;
}

/** Builds the menu shared by native Home and sidebar headers. Shared sorting
 * is offered only when a connected environment can persist the preference. */
export function buildHomeListFilterMenu(props: {
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
}): HomeListFilterMenu {
  const t = props.t ?? ((source: string) => translate(source));
  const items: Array<HomeListFilterMenuAction | HomeListFilterMenuSubmenu> = [];

  items.push({
    type: "submenu",
    title: translate("Environment"),
    items: [
      {
        type: "action",
        title: translate("All environments"),
        subtitle: translate("Show threads from every environment"),
        state: props.selectedEnvironmentId === null ? "on" : "off",
        onPress: () => props.onEnvironmentChange(null),
      },
      ...props.environments.map((environment) => ({
        type: "action" as const,
        title: environment.label,
        state:
          props.selectedEnvironmentId === environment.environmentId
            ? ("on" as const)
            : ("off" as const),
        onPress: () => props.onEnvironmentChange(environment.environmentId),
      })),
    ],
  });

  if (props.projects.length > 0) {
    items.push({
      type: "submenu",
      title: translate("Project"),
      items: [
        {
          type: "action",
          title: translate("All projects"),
          subtitle: translate("Show threads from every project"),
          state: props.selectedProjectKey === null ? "on" : "off",
          onPress: () => props.onProjectChange(null),
        },
        ...props.projects.map((project) => ({
          type: "action" as const,
          title: project.label,
          state: props.selectedProjectKey === project.key ? ("on" as const) : ("off" as const),
          onPress: () => props.onProjectChange(project.key),
        })),
      ],
    });
  }

  if (props.activeThreadSort) {
    const sort = props.activeThreadSort;
    items.push({
      type: "submenu",
      title: t("Sort active threads"),
      items: ACTIVE_THREAD_SORT_OPTIONS.map((option) => ({
        type: "action",
        title: t(option.label),
        state: sort.order === option.value ? "on" : "off",
        onPress: () => sort.onChange(option.value),
      })),
    });
  }

  return {
    title: translate("Thread list options"),
    items,
  };
}
