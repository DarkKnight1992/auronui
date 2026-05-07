import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const dateRangePickerVariants = tv({
  slots: {
    base: "date-range-picker",
    popover: "date-range-picker__popover",
    trigger: "date-range-picker__trigger",
    triggerIndicator: "date-range-picker__trigger-indicator",
  },
});

export type DateRangePickerVariants = VariantProps<typeof dateRangePickerVariants>;
