import type { ReactElement } from "react";
import { AppSheet } from "../../components/AppSheet";
import { useTranslate } from "../../i18n/translate";

export interface WorktreeSetupSheetProps {
  children: ReactElement;
  height: number;
  onClose: () => void;
}

export function WorktreeSetupSheet({ children, onClose }: WorktreeSetupSheetProps) {
  const t = useTranslate();
  return (
    <AppSheet title={t("Worktree setup")} onClose={onClose}>
      {children}
    </AppSheet>
  );
}
