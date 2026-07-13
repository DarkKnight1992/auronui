import type { VariantProps } from "../../utils";

import { tv } from "tailwind-variants";

export const sidebarVariants = tv({
  slots: {
    base: "sidebar",
    search: "sidebar__search",
    content: "sidebar__content",
    section: "sidebar__section",
    sectionHeading: "sidebar__section-heading",
    sectionList: "sidebar__section-list",
    item: "sidebar__item",
    itemIcon: "sidebar__item-icon",
    itemLabel: "sidebar__item-label",
    itemBadge: "sidebar__item-badge",
    empty: "sidebar__empty",
  },
});

export type SidebarVariants = VariantProps<typeof sidebarVariants>;
