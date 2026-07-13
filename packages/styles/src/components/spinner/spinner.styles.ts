import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const spinnerVariants = tv({
  base: "spinner",
  defaultVariants: {
    color: "primary",
    size: "md",
  },
  variants: {
    color: {
      default: "spinner--default",
      primary: "spinner--primary",
      secondary: "spinner--secondary",
      accent: "spinner--accent",
      current: "spinner--current",
      danger: "spinner--danger",
      success: "spinner--success",
      warning: "spinner--warning",
    },
    size: {
      lg: "spinner--lg",
      md: "spinner--md",
      sm: "spinner--sm",
      xl: "spinner--xl",
    },
  },
});

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;
