import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const collapsibleGroupVariants = tv({
  defaultVariants: {},
  slots: {
    base: "collapsible-group",
  },
  variants: {},
});

export type CollapsibleGroupVariants = VariantProps<typeof collapsibleGroupVariants>;
