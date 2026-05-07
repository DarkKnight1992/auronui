import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const menuSectionVariants = tv({
  slots: {
    base: "menu-section",
    label: "menu-section__label",
    separator: "menu-section__separator",
  },
  
});

export type MenuSectionVariants = VariantProps<typeof menuSectionVariants>;
