import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const yearRangePickerVariants = tv({
  defaultVariants: {},
  slots: {
    /** Root year range picker container */
    base: "year-range-picker",
    /** Header containing heading and navigation */
    header: "year-range-picker__header",
    /** Previous/Next navigation button */
    navButton: "year-range-picker__nav-button",
    /** Navigation button icon */
    navButtonIcon: "year-range-picker__nav-button-icon",
    /** Heading text */
    heading: "year-range-picker__heading",
    /** Grid (table) */
    grid: "year-range-picker__grid",
    /** Grid body (tbody) */
    gridBody: "year-range-picker__grid-body",
    /** Grid row (tr) */
    gridRow: "year-range-picker__grid-row",
    /** Year cell (button per year) */
    cell: "year-range-picker__cell",
  },
  variants: {},
});

export type YearRangePickerVariants = VariantProps<typeof yearRangePickerVariants>;
