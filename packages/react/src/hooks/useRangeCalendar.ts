import { useCallback, useState } from "react";
import type { DateValue } from "@internationalized/date";

export interface DateRange {
  start: DateValue;
  end: DateValue;
}

export interface UseRangeCalendarOptions {
  /** Initial selected date range for uncontrolled usage. */
  defaultValue?: DateRange | null;
  /** Minimum selectable date. */
  minValue?: DateValue;
  /** Maximum selectable date. */
  maxValue?: DateValue;
  /** Returns true for dates that should be disabled. */
  isDateDisabled?: (date: DateValue) => boolean;
  /** Returns true for dates that are unavailable. */
  isDateUnavailable?: (date: DateValue) => boolean;
}

export interface UseRangeCalendarReturn {
  /** Currently selected date range (null when no selection). */
  value: DateRange | null;
  /** Start date of the selected range. */
  start: DateValue | null;
  /** End date of the selected range. */
  end: DateValue | null;
  /** Whether a complete range (start and end) is selected. */
  isComplete: boolean;
  /** Set the selected date range. */
  setRange: (range: DateRange) => void;
  /** Clear the selected range. */
  clearRange: () => void;
  /** Returns true if the given date is disabled per the `isDateDisabled` option. */
  isDisabled: (date: DateValue) => boolean;
  /** Returns true if the given date is unavailable per the `isDateUnavailable` option. */
  isUnavailable: (date: DateValue) => boolean;
  /**
   * Pass as the `onValueChange` handler on the RangeCalendar component.
   * Keeps `value` in sync when the component changes selection internally.
   */
  onValueChange: (range: DateRange | null) => void;
}

/**
 * Manages selected date range state for the RangeCalendar component.
 *
 * @example
 * ```tsx
 * const range = useRangeCalendar()
 * ```
 * ```tsx
 * <RangeCalendar value={range.value} onValueChange={range.onValueChange} />
 * ```
 */
export function useRangeCalendar(options: UseRangeCalendarOptions = {}): UseRangeCalendarReturn {
  const [value, setValueState] = useState<DateRange | null>(options.defaultValue ?? null);

  const start = value?.start ?? null;
  const end = value?.end ?? null;

  const isComplete = value !== null && !!value?.start && !!value?.end;

  const setRange = useCallback((range: DateRange): void => setValueState(range), []);
  const clearRange = useCallback((): void => setValueState(null), []);

  const isDisabled = useCallback(
    (date: DateValue): boolean => {
      if (options.minValue && date.compare(options.minValue) < 0) return true;
      if (options.maxValue && date.compare(options.maxValue) > 0) return true;
      return options.isDateDisabled?.(date) ?? false;
    },
    [options],
  );

  const isUnavailable = useCallback(
    (date: DateValue): boolean => options.isDateUnavailable?.(date) ?? false,
    [options],
  );

  const onValueChange = useCallback((range: DateRange | null): void => setValueState(range), []);

  return { value, start, end, isComplete, setRange, clearRange, isDisabled, isUnavailable, onValueChange };
}
