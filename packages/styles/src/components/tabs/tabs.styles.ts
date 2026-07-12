import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const tabsVariants = tv({
  defaultVariants: {
    variant: "primary",
    color: "primary",
  },
  slots: {
    base: "tabs",
    separator: "tabs__separator",
    tab: "tabs__tab",
    tabIndicator: "tabs__indicator",
    tabList: "tabs__list",
    tabListContainer: "tabs__list-container",
    tabPanel: "tabs__panel",
    scrollWrapper: "tabs__scroll-wrapper",
    more: "tabs__more",
    moreBtn: "tabs__more-btn",
    overflowMenu: "tabs__overflow-menu",
    overflowItem: "tabs__overflow-item",
  },
  variants: {
    variant: {
      primary: {},
      secondary: {
        base: "tabs--secondary",
      },
    },
    color: {
      primary: { base: "tabs--color-primary" },
      secondary: { base: "tabs--color-secondary" },
      accent: { base: "tabs--color-accent" },
      success: { base: "tabs--color-success" },
      warning: { base: "tabs--color-warning" },
      danger: { base: "tabs--color-danger" },
    },
  },
});

// Render props that should be excluded from TabsVariants (framework-specific)
type TabsRenderPropsKeys = "selectedKey";

export type TabsVariants = Omit<VariantProps<typeof tabsVariants>, TabsRenderPropsKeys>;
