import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const colorPickerInputVariants = tv({
  slots: {
    base: "color-picker-input",
    trigger: "color-picker-input__trigger",
    swatch: "color-picker-input__swatch",
    popover: "color-picker-input__popover",
  },
});

export type ColorPickerInputVariants = VariantProps<typeof colorPickerInputVariants>;
