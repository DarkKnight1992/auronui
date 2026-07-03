import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const timePickerVariants = tv({
  slots: {
    base: "time-picker",
    popover: "time-picker__popover",
    trigger: "time-picker__trigger",
    triggerIndicator: "time-picker__trigger-indicator",
    panel: "time-picker__panel",
    timeDone: "time-picker__time-done",
  },
  defaultVariants: {
    isInvalid: false,
    isDisabled: false,
    fullWidth: false,
  },
  variants: {
    isInvalid: {
      true: {base: "time-picker--invalid"},
      false: {},
    },
    isDisabled: {
      true: {base: "time-picker--disabled"},
      false: {},
    },
    fullWidth: {
      true: {base: "time-picker--full-width"},
      false: {},
    },
  },
});

export type TimePickerVariants = VariantProps<typeof timePickerVariants>;
