import type { ActiveThreadSortOrder } from "@t3tools/contracts/settings";
import { ACTIVE_THREAD_SORT_OPTIONS } from "@t3tools/client-runtime/state/shared-settings";
import { ArrowUpDownIcon } from "lucide-react";

import { useTranslate } from "../../i18n/translate";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "../ui/menu";
import { SidebarHeaderIconButton } from "./SidebarThreadHeader";

/** Header menu for the shared active-thread sort preference. Disabled while no
    connected server can persist it; pinned, snoozed, and settled keep their order. */
export function SidebarActiveThreadSortMenu(props: {
  readonly order: ActiveThreadSortOrder;
  readonly available: boolean;
  readonly onOrderChange: (order: ActiveThreadSortOrder) => void;
}) {
  const t = useTranslate();
  return (
    <Menu>
      <MenuTrigger
        disabled={!props.available}
        render={<SidebarHeaderIconButton label={t("Sort threads")} />}
      >
        <ArrowUpDownIcon />
      </MenuTrigger>
      <MenuPopup align="end" side="bottom" className="min-w-48">
        <MenuGroup>
          <MenuGroupLabel>{t("Sort active threads")}</MenuGroupLabel>
          <MenuRadioGroup
            value={props.order}
            onValueChange={(value) => {
              const option = ACTIVE_THREAD_SORT_OPTIONS.find(
                (candidate) => candidate.value === value,
              );
              if (option !== undefined && option.value !== props.order) {
                props.onOrderChange(option.value);
              }
            }}
          >
            {ACTIVE_THREAD_SORT_OPTIONS.map((option) => (
              <MenuRadioItem key={option.value} value={option.value}>
                {t(option.label)}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  );
}
