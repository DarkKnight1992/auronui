import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const meterVariants = tv({
  defaultVariants: {
    color: "primary",
    size: "md",
  },
  slots: {
    base: "meter",
    fill: "meter__fill",
    label: "meter__label",
    output: "meter__output",
    track: "meter__track",
  },
  variants: {
    color: {
      primary: {
        base: "meter--primary",
      },
      secondary: {
        base: "meter--secondary",
      },
      accent: {
        base: "meter--accent",
      },
      danger: {
        base: "meter--danger",
      },
      default: {
        base: "meter--default",
      },
      success: {
        base: "meter--success",
      },
      warning: {
        base: "meter--warning",
      },
    },
    size: {
      lg: {
        base: "meter--lg",
      },
      md: {
        base: "meter--md",
      },
      sm: {
        base: "meter--sm",
      },
    },
  },
});

export type MeterVariants = VariantProps<typeof meterVariants>;
