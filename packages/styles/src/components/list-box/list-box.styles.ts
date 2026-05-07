import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const listboxVariants = tv({
  base: "list-box",
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      danger: "list-box--danger",
      default: "list-box--default",
    },
  },
});

export type ListBoxVariants = VariantProps<typeof listboxVariants>;
