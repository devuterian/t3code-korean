import { translate } from "~/i18n/translate";

/** Getters translate when the toast is shown, not when this module loads. */
export const OFF_HEAD_PULL_REQUEST_CHECKOUT_TOAST = {
  type: "warning",
  get title() {
    return translate("Checked out, but not confirmed on the latest commit");
  },
  get description() {
    return translate(
      "This checkout could not be confirmed at the pull request's latest commit, so its code may differ. Local commits or uncommitted work keep a checkout where it is.",
    );
  },
} as const;
