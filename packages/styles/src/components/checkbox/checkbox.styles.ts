import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const checkboxVariants = tv({
  defaultVariants: {
    variant: "primary",
    color: "primary",
  },
  slots: {
    base: "checkbox",
    content: "checkbox__content",
    control: "checkbox__control",
    indicator: "checkbox__indicator",
  },
  variants: {
    variant: {
      primary: {
        base: "checkbox--primary",
      },
      secondary: {
        base: "checkbox--secondary",
      },
    },
    // Named `checkbox--color-*` (not `checkbox--*`) to avoid colliding with the
    // `variant` axis above, whose own values happen to also be "primary"/"secondary"
    // (a pre-existing, unrelated style-variant axis, not a color).
    color: {
      default: {
        base: "checkbox--color-default",
      },
      primary: {
        base: "checkbox--color-primary",
      },
      secondary: {
        base: "checkbox--color-secondary",
      },
      accent: {
        base: "checkbox--color-accent",
      },
      success: {
        base: "checkbox--color-success",
      },
      warning: {
        base: "checkbox--color-warning",
      },
      danger: {
        base: "checkbox--color-danger",
      },
    },
  },
});

export type CheckboxVariants = VariantProps<typeof checkboxVariants>;
