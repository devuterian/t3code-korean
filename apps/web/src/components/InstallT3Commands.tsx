import { cn } from "~/lib/utils";

import { CommandBlock } from "./CommandBlock";
import { useTranslate } from "~/i18n/translate";

/**
 * Setup steps for another computer: install `t3`, then run `command`. Both installers are shown
 * because the browser showing this is often not the computer being set up.
 */
export function InstallT3Commands({
  command,
  className,
}: {
  readonly command: string;
  readonly className?: string;
}) {
  const t = useTranslate();
  // `{t3}` marks where the inline <code>t3</code> element goes.
  const [skipBefore, skipMiddle, skipAfter] = t(
    "Skip the install if you already have {t3}. If {t3} is not found after installing, add the folder the installer names to your PATH.",
  ).split("{t3}");
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs text-muted-foreground">macOS, Linux</p>
      <CommandBlock command="curl -fsSL https://t3.codes/install.sh | sh" />
      <p className="text-xs text-muted-foreground">Windows (PowerShell)</p>
      <CommandBlock command="irm https://t3.codes/install.ps1 | iex" />
      <p className="text-xs text-muted-foreground">{t("Then")}</p>
      <CommandBlock command={command} />
      <p className="text-xs text-muted-foreground">
        {skipBefore}
        <code className="font-mono">t3</code>
        {skipMiddle}
        <code className="font-mono">t3</code>
        {skipAfter}
      </p>
    </div>
  );
}
