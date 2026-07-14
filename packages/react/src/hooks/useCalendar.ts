import { useCallback, useState } from "react";
import type { DateValue } from "@internationalized/date";

export interface UseCalendarOptions {
  /** Initial selected date for uncontrolled usage. */
  defaultValue?: DateValue;
  /** Minimum selectable date. */
  minValue?: DateValue;
  /** Maximum selectable date. */
  maxValue?: DateValue;
  /** Returns true for dates that should be disabled (not selectable). */
  isDateDisabled?: (date: DateValue) => boolean;
  /** Returns true for dates that are unavailable (selectable but marked unavailable). */
  isDateUnavailable?: (date: DateValue) => boolean;
}

export interface UseCalendarReturn {
  /** Currently selected date value. */
  value: DateValue | undefined;
  /** Whether a date is currently selected. */
  hasValue: boolean;
  /** Set the selected date. */
  setValue: (date: DateValue) => void;
  /** Clear the selected date. */
  clear: () => void;
  /** Returns true if the given date is disabled per the `isDateDisabled` option. */
  isDisabled: (date: DateValue) => boolean;
  /** Returns true if the given date is unavailable per the `isDateUnavailable` option. */
  isUnavailable: (date: DateValue) => boolean;
  /**
   * Pass as the `onValueChange` handler on the Calendar component.
   * Keeps `value` in sync when the component changes selection internally.
   */
  onValueChange: (date: DateValue | undefined) => void;
}

/**
 * Manages selected date state for the Calendar component.
 *
 * @example
 * ```tsx
 * const calendar = useCalendar()
 * ```
 * ```tsx
 * <Calendar value={calendar.value} onValueChange={calendar.onValueChange} />
 * ```
 */
export function useCalendar(options: UseCalendarOptions = {}): UseCalendarReturn {
  const [value, setValueState] = useState<DateValue | undefined>(options.defaultValue);

  const hasValue = value !== undefined;

  const setValue = useCallback((date: DateValue): void => setValueState(date), []);
  const clear = useCallback((): void => setValueState(undefined), []);

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

  const onValueChange = useCallback(
    (date: DateValue | undefined): void => setValueState(date),
    [],
  );

  return { value, hasValue, setValue, clear, isDisabled, isUnavailable, onValueChange };
}
