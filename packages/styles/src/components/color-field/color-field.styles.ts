import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const colorFieldVariants = tv({
  base: "color-field",
  defaultVariants: {
    fullWidth: false,
  },
  variants: {
    fullWidth: {
      false: "",
      true: "color-field--full-width",
    },
  },
});

export type ColorFieldVariants = VariantProps<typeof colorFieldVariants>;
