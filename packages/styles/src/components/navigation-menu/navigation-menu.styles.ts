import type { VariantProps } from "../../utils";

import { tv } from "tailwind-variants";

export const navigationMenuVariants = tv({
  slots: {
    root: "navigation-menu",
    list: "navigation-menu__list",
    trigger: "navigation-menu__trigger",
    chevron: "navigation-menu__chevron",
    content: "navigation-menu__content",
    viewportWrapper: "navigation-menu__viewport-wrapper",
    viewport: "navigation-menu__viewport",
    indicator: "navigation-menu__indicator",
    indicatorArrow: "navigation-menu__indicator-arrow",
  },
});

export type NavigationMenuVariants = VariantProps<typeof navigationMenuVariants>;
