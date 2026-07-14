import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const radioVariants = tv({
  defaultVariants: {
    color: "primary",
  },
  slots: {
    base: "radio",
    content: "radio__content",
    control: "radio__control",
    indicator: "radio__indicator",
  },
  variants: {
    color: {
      default: {
        base: "radio--color-default",
      },
      primary: {
        base: "radio--color-primary",
      },
      secondary: {
        base: "radio--color-secondary",
      },
      accent: {
        base: "radio--color-accent",
      },
      success: {
        base: "radio--color-success",
      },
      warning: {
        base: "radio--color-warning",
      },
      danger: {
        base: "radio--color-danger",
      },
    },
  },
});

export type RadioVariants = VariantProps<typeof radioVariants>;
