import { InfoIcon, RotateCwIcon } from "lucide-react";
import { useTranslate } from "~/i18n/translate";
import { Button } from "../ui/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";

export function DiffFileStatus({
  error,
  truncated,
  retry,
}: {
  error?: boolean | undefined;
  truncated?: boolean | undefined;
  retry: () => void;
}) {
  const t = useTranslate();
  if (!error && !truncated) return null;
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size="icon-micro"
            variant="ghost-muted"
            aria-label={t(error ? "Retry loading diff" : "Partial diff preview")}
            onClick={(event) => {
              event.stopPropagation();
              if (error) retry();
            }}
          />
        }
      >
        {error ? <RotateCwIcon className="size-3" /> : <InfoIcon className="size-3" />}
      </TooltipTrigger>
      <TooltipPopup>
        {t(
          error
            ? "Retry loading diff"
            : "This file is too large to show in full. Counts include all changes.",
        )}
      </TooltipPopup>
    </Tooltip>
  );
}
