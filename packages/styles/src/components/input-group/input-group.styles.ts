import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const inputGroupVariants = tv({
  defaultVariants: {
    size: "md",
    fullWidth: false,
  },
  slots: {
    base: "input-group",
    addon: "input-group__addon",
    input: "input-group__input",
  },
  variants: {
    size: {
      sm: "input-group--sm",
      md: "input-group--md",
      lg: "input-group--lg",
    },
    fullWidth: {
      false: {},
      true: {
        base: "input-group--full-width",
      },
    },
  },
});

export type InputGroupVariants = VariantProps<typeof inputGroupVariants>;
