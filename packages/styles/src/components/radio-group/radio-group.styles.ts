import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const radioGroupVariants = tv({
  slots: {
    base: "radio-group",
    label: "radio-group__label",
    wrapper: "radio-group__wrapper",
    description: "radio-group__description",
    errorMessage: "radio-group__error-message",
  },
  defaultVariants: {
    variant: "primary",
  },
  variants: {
    variant: {
      primary: {
        base: "radio-group--primary",
      },
      secondary: {
        base: "radio-group--secondary",
      },
    },
  },
});

export type RadioGroupVariants = VariantProps<typeof radioGroupVariants>;
