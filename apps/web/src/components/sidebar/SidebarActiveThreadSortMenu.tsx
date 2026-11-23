import type { ActiveThreadSortOrder } from "@t3tools/contracts/settings";
import { ACTIVE_THREAD_SORT_OPTIONS } from "@t3tools/client-runtime/state/shared-settings";
import { ArrowUpDownIcon } from "lucide-react";
import { msg, useGT, useMessages } from "gt-react";

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

const SORT_LABEL: Record<ActiveThreadSortOrder, string> = {
  manual: msg("Configured order"),
  last_message: msg("Last message"),
};

/** Header menu for the shared active-thread sort preference. Disabled while no
    connected server can persist it; pinned, snoozed, and settled keep their order. */
export function SidebarActiveThreadSortMenu(props: {
  readonly order: ActiveThreadSortOrder;
  readonly available: boolean;
  readonly onOrderChange: (order: ActiveThreadSortOrder) => void;
}) {
  const gt = useGT();
  const m = useMessages();
  return (
    <Menu>
      <MenuTrigger
        disabled={!props.available}
        render={<SidebarHeaderIconButton label={gt("Sort threads")} />}
      >
        <ArrowUpDownIcon />
      </MenuTrigger>
      <MenuPopup align="end" side="bottom" className="min-w-48">
        <MenuGroup>
          <MenuGroupLabel>{gt("Sort active threads")}</MenuGroupLabel>
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
                {m(SORT_LABEL[option.value])}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  );
}
