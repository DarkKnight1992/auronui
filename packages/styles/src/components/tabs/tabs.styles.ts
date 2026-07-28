import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const tabsVariants = tv({
  defaultVariants: {
    variant: "primary",
    color: "primary",
    fullWidth: true,
    trackFullWidth: false,
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
    // Default true to preserve the existing look for everyone already using
    // Tabs. Only horizontal tabs stretch evenly today (vertical tabs already
    // fill the sidebar width on purpose, unrelated to this) — the CSS scopes
    // the false case to [data-orientation="horizontal"] so this is a no-op
    // for vertical tabs regardless of the value passed here.
    fullWidth: {
      true: {},
      false: { tabList: "tabs__list--auto-width" },
    },
    // Only meaningful combined with fullWidth={false}: keeps the track — the
    // pill background on the primary variant, the bottom border on the
    // secondary variant — spanning the full width, while the tabs inside it
    // still shrink to their own text. Both variants' "track" is literally
    // the .tabs__list element's own background/border, so one modifier
    // class covers both looks; no per-variant prop needed. A no-op when
    // fullWidth is true, since the track is already full width there.
    trackFullWidth: {
      true: { tabList: "tabs__list--track-full-width" },
      false: {},
    },
  },
});

// Render props that should be excluded from TabsVariants (framework-specific)
type TabsRenderPropsKeys = "selectedKey";

export type TabsVariants = Omit<VariantProps<typeof tabsVariants>, TabsRenderPropsKeys>;
