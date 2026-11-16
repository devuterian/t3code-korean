import { translate } from "../../i18n/translate";
import { isWorkspaceCatalogPending, type WorkspaceState } from "../../state/workspaceModel";

export interface HomeEmptyState {
  readonly title: string;
  readonly detail: string;
  readonly loading: boolean;
  readonly showsAddEnvironment: boolean;
}

export function deriveHomeEmptyState(
  catalogState: WorkspaceState,
  projectCount: number,
): HomeEmptyState {
  const emptyState = deriveEmptyState(catalogState, projectCount);
  return {
    ...emptyState,
    showsAddEnvironment: !emptyState.loading && !catalogState.hasReadyEnvironment,
  };
}

function deriveEmptyState(
  catalogState: WorkspaceState,
  projectCount: number,
): Omit<HomeEmptyState, "showsAddEnvironment"> {
  if (catalogState.isLoadingConnections) {
    return {
      title: translate("Loading environments"),
      detail: translate("Checking saved environments on this device."),
      loading: true,
    };
  }

  if (!catalogState.hasConnections) {
    return {
      title: translate("No environments connected"),
      detail: translate("Add an environment to load projects and start coding sessions."),
      loading: false,
    };
  }

  if (
    (catalogState.connectionState === "available" ||
      catalogState.connectionState === "offline" ||
      catalogState.connectionState === "error" ||
      catalogState.connectionState === "unsupported") &&
    !catalogState.hasLoadedShellSnapshot
  ) {
    return {
      title:
        catalogState.connectionState === "unsupported"
          ? translate("Client not supported")
          : translate("Environment unavailable"),
      detail:
        catalogState.connectionError ??
        translate(
          "The saved environment is offline. Check the URL or start the environment, then retry.",
        ),
      loading: false,
    };
  }

  if (isWorkspaceCatalogPending(catalogState)) {
    return {
      title: catalogState.hasReadyEnvironment
        ? translate("Loading threads")
        : translate("Connecting to environment"),
      detail: translate("Loading projects and threads from the saved environment."),
      loading: true,
    };
  }

  if (projectCount === 0 && catalogState.hasLoadedShellSnapshot) {
    return {
      title: translate("No projects found"),
      detail: translate("The connected environment did not report any projects."),
      loading: false,
    };
  }

  return {
    title: translate("No threads yet"),
    detail: translate(
      "Create a task to start a new coding runtime in one of your connected projects.",
    ),
    loading: false,
  };
}
