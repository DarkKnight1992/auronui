import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const monthRangePickerVariants = tv({
  defaultVariants: {},
  slots: {
    /** Root month range picker container */
    base: "month-range-picker",
    /** Header containing heading and navigation */
    header: "month-range-picker__header",
    /** Previous/Next navigation button */
    navButton: "month-range-picker__nav-button",
    /** Navigation button icon */
    navButtonIcon: "month-range-picker__nav-button-icon",
    /** Heading text */
    heading: "month-range-picker__heading",
    /** Grid (table) */
    grid: "month-range-picker__grid",
    /** Grid body (tbody) */
    gridBody: "month-range-picker__grid-body",
    /** Grid row (tr) */
    gridRow: "month-range-picker__grid-row",
    /** Month cell (button per month) */
    cell: "month-range-picker__cell",
  },
  variants: {},
});

export type MonthRangePickerVariants = VariantProps<typeof monthRangePickerVariants>;
