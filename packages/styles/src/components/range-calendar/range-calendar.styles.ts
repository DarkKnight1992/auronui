import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const rangeCalendarVariants = tv({
  defaultVariants: {},
  slots: {
    /** Root range calendar container */
    base: "range-calendar",
    /** Calendar cell (td) */
    cell: "range-calendar__cell",
    /** Inner cell trigger button (renders the day number, hover + cap circle) */
    cellButton: "range-calendar__cell-button",
    /** Cell indicator (small dot at bottom of cell) */
    cellIndicator: "range-calendar__cell-indicator",
    /** Calendar grid (table) */
    grid: "range-calendar__grid",
    /** Grid body (tbody) */
    gridBody: "range-calendar__grid-body",
    /** Grid header (thead) */
    gridHeader: "range-calendar__grid-header",
    /** Grid row (tr) */
    gridRow: "range-calendar__grid-row",
    /** Calendar header containing heading and navigation */
    header: "range-calendar__header",
    /** Header cell (th - day names) */
    headerCell: "range-calendar__header-cell",
    /** Month/year heading text */
    heading: "range-calendar__heading",
    /** Clickable heading button that cycles date/month/year views */
    headingButton: "range-calendar__heading-button px-4 py-2",
    /** Month-view grid (3 cols x 4 rows of month cells) */
    monthGrid: "range-calendar__month-grid",
    /** Month-view grid body (tbody) */
    monthGridBody: "range-calendar__month-grid-body",
    /** Month-view grid row (tr) */
    monthGridRow: "range-calendar__month-grid-row",
    /** Month cell (button per month) */
    monthCell: "range-calendar__month-cell px-4 py-2",
    /** Month cell label */
    monthCellLabel: "range-calendar__month-cell-label",
    /** Year-view grid (3 cols x 4 rows of year cells) */
    yearGrid: "range-calendar__year-grid",
    /** Year-view grid body (tbody) */
    yearGridBody: "range-calendar__year-grid-body",
    /** Year-view grid row (tr) */
    yearGridRow: "range-calendar__year-grid-row",
    /** Year cell (button per year) */
    yearCell: "range-calendar__year-cell px-4 py-2",
    /** Year cell label */
    yearCellLabel: "range-calendar__year-cell-label",
    /** Previous/Next navigation button */
    navButton: "range-calendar__nav-button",
    /** Navigation button icon */
    navButtonIcon: "range-calendar__nav-button-icon",
  },
  variants: {},
});

export type RangeCalendarVariants = VariantProps<typeof rangeCalendarVariants>;
