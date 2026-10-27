import { useAtomValue } from "@effect/atom-react";
import { useState } from "react";

import {
  threadUndoLabel,
  undoLatestThreadAction,
  useThreadUndoNotice,
} from "../../hooks/showThreadUndoNotice";
import { useTranslate } from "../../i18n/translate";
import { cn } from "../../lib/utils";
import { primaryServerKeybindingsAtom } from "../../state/server";
import { InlineButton } from "../ui/button";

export function SidebarThreadUndoNotice({ className }: { className?: string }) {
  const t = useTranslate();
  const notice = useThreadUndoNotice((state) => state.notice);
  const keybindings = useAtomValue(primaryServerKeybindingsAtom);
  const summary = notice
    ? t(
        `${notice.action} {count} ${notice.action === "Discarded" ? "draft" : "thread"}${notice.count === 1 ? "" : "s"}`,
      ).replace("{count}", () => String(notice.count))
    : null;

  // Keeps the last text on screen while it fades out, then unmounts on transitionend.
  const [shownSummary, setShownSummary] = useState(summary);
  if (summary && summary !== shownSummary) setShownSummary(summary);
  const text = summary ?? shownSummary;
  if (!text) return null;

  return (
    <div
      role="group"
      aria-hidden={!summary}
      inert={!summary}
      onTransitionEnd={(event) => {
        if (!summary && event.target === event.currentTarget) setShownSummary(null);
      }}
      className={cn(
        "flex gap-1 px-2 text-2xs leading-6 text-sidebar-muted-foreground transition-opacity duration-200 ease-out starting:opacity-0",
        !summary && "opacity-0",
        className,
      )}
    >
      <span className="min-w-0 truncate">{text},</span>
      <InlineButton onClick={undoLatestThreadAction}>
        {t(threadUndoLabel(keybindings))}
      </InlineButton>
    </div>
  );
}
