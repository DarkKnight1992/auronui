import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const checkboxGroupVariants = tv({
  slots: {
    base: "checkbox-group",
    label: "checkbox-group__label",
    wrapper: "checkbox-group__wrapper",
    description: "checkbox-group__description",
    errorMessage: "checkbox-group__error-message",
  },
  defaultVariants: {
    variant: "primary",
  },
  variants: {
    variant: {
      primary: {
        base: "checkbox-group--primary",
      },
      secondary: {
        base: "checkbox-group--secondary",
      },
    },
  },
});

export type CheckboxGroupVariants = VariantProps<typeof checkboxGroupVariants>;
