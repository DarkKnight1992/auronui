import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const colorFieldVariants = tv({
  slots: {
    base: "color-field",
    label: "color-field__label",
    inputWrapper: "color-field__input-wrapper",
    input: "color-field__input",
    endContent: "color-field__end-content",
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
