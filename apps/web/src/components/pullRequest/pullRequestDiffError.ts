import { translate } from "~/i18n/translate";

/** Diff failures currently include transport wrappers, so recognize the reason inside them. */
export function describePullRequestDiffError(error: string, providerName: string) {
  if (/\brate limit\b|\brate[-_]limited\b|\btoo many requests\b/i.test(error)) {
    return {
      title: translate("{provider} rate limit reached").replace("{provider}", () => providerName),
      description: translate(
        "{provider} is temporarily limiting requests, so this diff couldn't be loaded. Try again after the limit resets, or view the changes on {provider}.",
      ).replaceAll("{provider}", () => providerName),
    };
  }

  return {
    title: translate("Couldn't load the changes"),
    description: translate(
      "The environment couldn't load this pull request's diff. Try again, or view the changes on {provider}.",
    ).replace("{provider}", () => providerName),
  };
}
