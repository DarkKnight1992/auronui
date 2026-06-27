import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const dateTimePickerVariants = tv({
  slots: {
    base: "date-time-picker",
    popover: "date-time-picker__popover",
    trigger: "date-time-picker__trigger",
    triggerIndicator: "date-time-picker__trigger-indicator",
    panel: "date-time-picker__panel",
    divider: "date-time-picker__divider",
    scrollerWrap: "date-time-picker__scroller-wrap",
    scrollerColumn: "date-time-picker__scroller-column",
    scrollerItem: "date-time-picker__scroller-item",
    tzSearch: "date-time-picker__tz-search",
    tzList: "date-time-picker__tz-list",
    tzItem: "date-time-picker__tz-item",
  },
  defaultVariants: {
    isInvalid: false,
    isDisabled: false,
    fullWidth: false,
  },
  variants: {
    isInvalid: {
      true: {base: "date-time-picker--invalid"},
      false: {},
    },
    isDisabled: {
      true: {base: "date-time-picker--disabled"},
      false: {},
    },
    fullWidth: {
      true: {base: "date-time-picker--full-width"},
      false: {},
    },
  },
});

export type DateTimePickerVariants = VariantProps<typeof dateTimePickerVariants>;
