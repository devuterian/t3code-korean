import { Spinner } from "~/components/ui/spinner";
import { useTranslate } from "~/i18n/translate";

import { threadSyncLabel, type ThreadSyncPhase } from "../../threadSync";
import { ComposerBanner } from "./ComposerBanner";

export function ComposerActivityRow({ phase }: { readonly phase: ThreadSyncPhase }) {
  const t = useTranslate();
  return (
    <ComposerBanner.Row>
      <ComposerBanner.Icon>
        <Spinner />
      </ComposerBanner.Icon>
      <ComposerBanner.Content>
        <span
          className="shrink-0 whitespace-nowrap text-muted-foreground"
          data-composer-sync-status={phase}
          role="status"
        >
          {t(threadSyncLabel(phase))}
        </span>
      </ComposerBanner.Content>
    </ComposerBanner.Row>
  );
}
