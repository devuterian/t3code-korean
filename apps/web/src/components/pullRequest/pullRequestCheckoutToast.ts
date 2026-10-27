import type { ChangeRequestTerminology } from "@t3tools/client-runtime/source-control-clients";

import { translate } from "~/i18n/translate";

export function offHeadPullRequestCheckoutToast(terminology: ChangeRequestTerminology) {
  return {
    type: "warning",
    title: translate("Checked out, but not confirmed on the latest commit"),
    description: translate(
      `This checkout could not be confirmed at the ${terminology.singular}'s latest commit, so its code may differ. Local commits or uncommitted work keep a checkout where it is.`,
    ),
  } as const;
}
