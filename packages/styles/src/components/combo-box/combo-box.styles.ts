import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const comboBoxVariants = tv({
  defaultVariants: {
    fullWidth: false,
  },
  slots: {
    base: "combo-box",
    inputGroup: "combo-box__input-group",
    popover: "combo-box__popover",
    trigger: "combo-box__trigger",
    input: "combo-box__input",
    clearButton: "combo-box__clear-button",
  },
  variants: {
    fullWidth: {
      false: {},
      true: {
        base: "combo-box--full-width",
        inputGroup: "combo-box__input-group--full-width",
      },
    },
  },
});

export type ComboBoxVariants = VariantProps<typeof comboBoxVariants>;
