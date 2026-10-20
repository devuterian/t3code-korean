import type { ReactElement } from "react";
import { Sheet } from "../../components/ui/Sheet";
import { useTranslate } from "../../i18n/translate";

export interface WorktreeSetupSheetProps {
  children: ReactElement;
  height: number;
  onClose: () => void;
}

export function WorktreeSetupSheet({ children, onClose }: WorktreeSetupSheetProps) {
  const t = useTranslate();
  return (
    <Sheet title={t("Worktree setup")} onClose={onClose}>
      {children}
    </Sheet>
  );
}
