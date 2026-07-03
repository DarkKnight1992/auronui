import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const colorFieldVariants = tv({
  slots: {
    base: "color-field",
    label: "color-field__label",
    input: "color-field__input",
    description: "color-field__description",
    errorMessage: "color-field__error-message",
  },
  defaultVariants: {
    fullWidth: false,
  },
  variants: {
    fullWidth: {
      false: {},
      true: {
        base: "color-field--full-width",
      },
    },
  },
});

export type ColorFieldVariants = VariantProps<typeof colorFieldVariants>;
