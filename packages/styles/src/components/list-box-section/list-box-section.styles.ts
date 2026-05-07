import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const listboxSectionVariants = tv({
  base: "list-box-section",
  slots: {
    label: "list-box-section__label",
    separator: "list-box-section__separator"
  }
});

export type ListBoxSectionVariants = VariantProps<typeof listboxSectionVariants>;
