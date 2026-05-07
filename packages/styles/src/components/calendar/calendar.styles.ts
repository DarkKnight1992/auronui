import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const calendarVariants = tv({
  defaultVariants: {},
  slots: {
    /** Root calendar container */
    base: "calendar",
    /** Calendar cell (td) */
    cell: "calendar__cell",
    /** Inner cell trigger button (full-cell hit target over the TD's circle) */
    cellButton: "calendar__cell-button",
    /** Cell indicator (small dot at bottom of cell) */
    cellIndicator: "calendar__cell-indicator",
    /** Calendar grid (table) */
    grid: "calendar__grid",
    /** Grid body (tbody) */
    gridBody: "calendar__grid-body",
    /** Grid header (thead) */
    gridHeader: "calendar__grid-header",
    /** Grid row (tr) */
    gridRow: "calendar__grid-row",
    /** Calendar header containing heading and navigation */
    header: "calendar__header",
    /** Header cell (th - day names) */
    headerCell: "calendar__header-cell",
    /** Month/year heading text */
    heading: "calendar__heading",
    /** Clickable heading button that cycles date/month/year views */
    headingButton: "calendar__heading-button px-4 py-2",
    /** Month-view grid (3 cols x 4 rows of month cells) */
    monthGrid: "calendar__month-grid",
    /** Month-view grid body (tbody) */
    monthGridBody: "calendar__month-grid-body",
    /** Month-view grid row (tr) */
    monthGridRow: "calendar__month-grid-row",
    /** Month cell (button per month) */
    monthCell: "calendar__month-cell px-4 py-2",
    /** Month cell label */
    monthCellLabel: "calendar__month-cell-label",
    /** Year-view grid (3 cols x 4 rows of year cells) */
    yearGrid: "calendar__year-grid",
    /** Year-view grid body (tbody) */
    yearGridBody: "calendar__year-grid-body",
    /** Year-view grid row (tr) */
    yearGridRow: "calendar__year-grid-row",
    /** Year cell (button per year) */
    yearCell: "calendar__year-cell px-4 py-2",
    /** Year cell label */
    yearCellLabel: "calendar__year-cell-label",
    /** Previous/Next navigation button */
    navButton: "calendar__nav-button",
    /** Navigation button icon */
    navButtonIcon: "calendar__nav-button-icon",
  },
  variants: {},
});

export type CalendarVariants = VariantProps<typeof calendarVariants>;
