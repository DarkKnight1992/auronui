import { shallowRef, computed, type Ref, type ComputedRef } from 'vue'
import type { DateValue } from '@internationalized/date'

export interface DateRange {
  start: DateValue
  end: DateValue
}

export interface UseRangeCalendarOptions {
  /** Initial selected date range for uncontrolled usage. */
  defaultValue?: DateRange | null
  /** Minimum selectable date. */
  minValue?: DateValue
  /** Maximum selectable date. */
  maxValue?: DateValue
  /** Returns true for dates that should be disabled. */
  isDateDisabled?: (date: DateValue) => boolean
  /** Returns true for dates that are unavailable. */
  isDateUnavailable?: (date: DateValue) => boolean
}

export interface UseRangeCalendarReturn {
  /** Reactive selected date range (null when no selection). */
  value: Ref<DateRange | null>
  /** Reactive start date of the selected range. */
  start: ComputedRef<DateValue | null>
  /** Reactive end date of the selected range. */
  end: ComputedRef<DateValue | null>
  /** Whether a complete range (start and end) is selected. */
  isComplete: ComputedRef<boolean>
  /** Set the selected date range. */
  setRange: (range: DateRange) => void
  /** Clear the selected range. */
  clearRange: () => void
  /** Returns true if the given date is disabled per the `isDateDisabled` option. */
  isDisabled: (date: DateValue) => boolean
  /** Returns true if the given date is unavailable per the `isDateUnavailable` option. */
  isUnavailable: (date: DateValue) => boolean
  /**
   * Pass as `v-model` on the RangeCalendar component.
   * Keeps `value` in sync when the component changes selection internally.
   */
  onValueChange: (range: DateRange | null) => void
}

/**
 * Manages selected date range state for the RangeCalendar component.
 *
 * @example
 * ```ts
 * const range = useRangeCalendar()
 * ```
 * ```html
 * <RangeCalendar v-model="range.value" />
 * ```
 */
export function useRangeCalendar(options: UseRangeCalendarOptions = {}): UseRangeCalendarReturn {
  const value = shallowRef<DateRange | null>(options.defaultValue ?? null)

  const start = computed(() => value.value?.start ?? null)
  const end = computed(() => value.value?.end ?? null)

  const isComplete = computed(
    () => value.value !== null && !!value.value?.start && !!value.value?.end
  )

  function setRange(range: DateRange): void {
    value.value = range
  }

  function clearRange(): void {
    value.value = null
  }

  function isDisabled(date: DateValue): boolean {
    if (options.minValue && date.compare(options.minValue) < 0) return true
    if (options.maxValue && date.compare(options.maxValue) > 0) return true
    return options.isDateDisabled?.(date) ?? false
  }

  function isUnavailable(date: DateValue): boolean {
    return options.isDateUnavailable?.(date) ?? false
  }

  function onValueChange(range: DateRange | null): void {
    value.value = range
  }

  return {
    value,
    start,
    end,
    isComplete,
    setRange,
    clearRange,
    isDisabled,
    isUnavailable,
    onValueChange,
  }
}
