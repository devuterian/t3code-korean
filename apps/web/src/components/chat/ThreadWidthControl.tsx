import { ArrowLeftRightIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useId, type CSSProperties } from "react";

import { THREAD_WIDTH_STEP, useFitTables, useThreadWidth } from "~/hooks/useThreadWidth";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { useTranslate } from "../../i18n/translate";
import { Popover, PopoverPopup, PopoverTitle, PopoverTrigger } from "../ui/popover";

/** Adjust conversation width and optional table wrapping without leaving the thread. */
export function ThreadWidthControl() {
  const t = useTranslate();
  const [expansion, setExpansion] = useThreadWidth();
  const sliderId = useId();
  const fitId = useId();
  const [fitTables, setFitTables] = useFitTables();
  const sliderStyle = {
    "--settings-slider-progress": `${expansion}%`,
    "--settings-slider-fill-offset": `${0.5 - expansion / 100}rem`,
  } as CSSProperties;

  return (
    <Popover>
      <PopoverTrigger
        data-toolbar-control
        render={
          <Button size="xs" variant="outline" aria-label={`${t("Thread width")}: ${expansion}%`} />
        }
      >
        <ArrowLeftRightIcon aria-hidden="true" className="size-3.5" />
        <span className="hidden @3xl/header-actions:inline">{t("Width")}</span>
        <span className="tabular-nums">{expansion}%</span>
      </PopoverTrigger>
      <PopoverPopup align="end" width="sm">
        <div className="space-y-3">
          <PopoverTitle>{t("Thread width")}</PopoverTitle>
          <div className="flex items-center justify-between gap-3">
            <Button
              aria-label={t("Decrease thread width")}
              size="icon-xs"
              variant="outline"
              disabled={expansion === 0}
              onClick={() => setExpansion(expansion - THREAD_WIDTH_STEP)}
            >
              <MinusIcon aria-hidden="true" />
            </Button>
            <output htmlFor={sliderId} className="text-sm tabular-nums">
              {expansion}%
            </output>
            <Button
              aria-label={t("Increase thread width")}
              size="icon-xs"
              variant="outline"
              disabled={expansion === 100}
              onClick={() => setExpansion(expansion + THREAD_WIDTH_STEP)}
            >
              <PlusIcon aria-hidden="true" />
            </Button>
          </div>
          <div>
            <input
              id={sliderId}
              aria-label={t("Thread width")}
              className="settings-slider block w-full"
              type="range"
              min={0}
              max={100}
              step={THREAD_WIDTH_STEP}
              value={expansion}
              style={sliderStyle}
              onChange={(event) => setExpansion(Number(event.currentTarget.value))}
            />
            <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          <label
            htmlFor={fitId}
            className="flex cursor-pointer items-center justify-between gap-3 border-t border-border pt-3 text-sm"
          >
            {t("Fit tables")}
            <Switch id={fitId} size="sm" checked={fitTables} onCheckedChange={setFitTables} />
          </label>
        </div>
      </PopoverPopup>
    </Popover>
  );
}
