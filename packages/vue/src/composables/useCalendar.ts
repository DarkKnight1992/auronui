import { shallowRef, computed, type Ref, type ComputedRef } from 'vue'
import type { DateValue } from '@internationalized/date'

export interface UseCalendarOptions {
  /** Initial selected date for uncontrolled usage. */
  defaultValue?: DateValue
  /** Minimum selectable date. */
  minValue?: DateValue
  /** Maximum selectable date. */
  maxValue?: DateValue
  /** Returns true for dates that should be disabled (not selectable). */
  isDateDisabled?: (date: DateValue) => boolean
  /** Returns true for dates that are unavailable (selectable but marked unavailable). */
  isDateUnavailable?: (date: DateValue) => boolean
}

export interface UseCalendarReturn {
  /** Reactive selected date value. */
  value: Ref<DateValue | undefined>
  /** Whether a date is currently selected. */
  hasValue: ComputedRef<boolean>
  /** Set the selected date. */
  setValue: (date: DateValue) => void
  /** Clear the selected date. */
  clear: () => void
  /** Returns true if the given date is disabled per the `isDateDisabled` option. */
  isDisabled: (date: DateValue) => boolean
  /** Returns true if the given date is unavailable per the `isDateUnavailable` option. */
  isUnavailable: (date: DateValue) => boolean
  /**
   * Pass as `v-model` on the Calendar component.
   * Keeps `value` in sync when the component changes selection internally.
   */
  onValueChange: (date: DateValue | undefined) => void
}

/**
 * Manages selected date state for the Calendar component.
 *
 * @example
 * ```ts
 * const calendar = useCalendar()
 * ```
 * ```html
 * <Calendar v-model="calendar.value" />
 * ```
 */
export function useCalendar(options: UseCalendarOptions = {}): UseCalendarReturn {
  const value = shallowRef<DateValue | undefined>(options.defaultValue)

  const hasValue = computed(() => value.value !== undefined)

  function setValue(date: DateValue): void {
    value.value = date
  }

  function clear(): void {
    value.value = undefined
  }

  function isDisabled(date: DateValue): boolean {
    if (options.minValue && date.compare(options.minValue) < 0) return true
    if (options.maxValue && date.compare(options.maxValue) > 0) return true
    return options.isDateDisabled?.(date) ?? false
  }

  function isUnavailable(date: DateValue): boolean {
    return options.isDateUnavailable?.(date) ?? false
  }

  function onValueChange(date: DateValue | undefined): void {
    value.value = date
  }

  return {
    value,
    hasValue,
    setValue,
    clear,
    isDisabled,
    isUnavailable,
    onValueChange,
  }
}
