import { getLocalTimeZone, isSameDay, type DateValue } from "@internationalized/date";

/**
 * Shared date-grid math for the "drill-up" grid views (month picker, year picker,
 * and their range variants). Day-grid math for the primary calendar view is handled
 * by react-aria-components' `Calendar`/`RangeCalendar` (which already implements the
 * WAI-ARIA grid pattern over `@internationalized/date`), so this module only covers
 * the 3x4 month/year grids that react-aria-components does not ship a primitive for.
 */

/** Splits a flat array into `cols`-wide rows, e.g. for a 3x4 grid. */
export function chunkRows<T>(items: T[], cols: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += cols) {
    rows.push(items.slice(i, i + cols));
  }
  return rows;
}

/** The 12 months of the year containing `anchor`, as the first day of each month. */
export function getMonthsOfYear(anchor: DateValue): DateValue[] {
  const yearStart = anchor.set({ month: 1, day: 1 });
  return Array.from({ length: 12 }, (_, i) => yearStart.add({ months: i }));
}

/**
 * A page of `yearsPerPage` years containing `anchor`, as the first day of January
 * of each year. Pages are aligned to `yearsPerPage`-sized buckets starting at year 1
 * (e.g. with the default of 12: ...2013-2024, 2025-2036...).
 */
export function getYearsPage(anchor: DateValue, yearsPerPage: number): DateValue[] {
  const pageStart = Math.floor((anchor.year - 1) / yearsPerPage) * yearsPerPage + 1;
  const start = anchor.set({ month: 1, day: 1, year: pageStart });
  return Array.from({ length: yearsPerPage }, (_, i) => start.add({ years: i }));
}

/** Same page-alignment logic as {@link getYearsPage}, but returns just the start year. */
export function getYearsPageStart(anchor: DateValue, yearsPerPage: number): number {
  return Math.floor((anchor.year - 1) / yearsPerPage) * yearsPerPage + 1;
}

export function formatMonthYear(date: DateValue, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    date.toDate(getLocalTimeZone()),
  );
}

export function formatMonthLabel(date: DateValue, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(date.toDate(getLocalTimeZone()));
}

export function formatYear(date: DateValue, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { year: "numeric" }).format(date.toDate(getLocalTimeZone()));
}

export function formatYearRange(years: DateValue[], locale = "en-US"): string {
  if (years.length === 0) return "";
  const first = formatYear(years[0] as DateValue, locale);
  const last = formatYear(years[years.length - 1] as DateValue, locale);
  return `${first} - ${last}`;
}

export function isSameMonthAs(a: DateValue, b: DateValue): boolean {
  return a.year === b.year && a.month === b.month;
}

export function isSameYearAs(a: DateValue, b: DateValue): boolean {
  return a.year === b.year;
}

export { isSameDay };
