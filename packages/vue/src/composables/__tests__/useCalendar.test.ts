import { describe, it, expect } from 'vitest'
import { useCalendar } from '../useCalendar'
import { CalendarDate } from '@internationalized/date'

const date1 = new CalendarDate(2024, 1, 15)
const date2 = new CalendarDate(2024, 6, 20)
const minDate = new CalendarDate(2024, 1, 1)
const maxDate = new CalendarDate(2024, 12, 31)

describe('useCalendar', () => {
  it('starts with undefined value', () => {
    const { value } = useCalendar()
    expect(value.value).toBeUndefined()
  })

  it('respects defaultValue', () => {
    const { value } = useCalendar({ defaultValue: date1 })
    expect(value.value).toEqual(date1)
  })

  it('hasValue is false with no selection', () => {
    const { hasValue } = useCalendar()
    expect(hasValue.value).toBe(false)
  })

  it('hasValue is true after setValue', () => {
    const { hasValue, setValue } = useCalendar()
    setValue(date1)
    expect(hasValue.value).toBe(true)
  })

  it('setValue updates value', () => {
    const { value, setValue } = useCalendar()
    setValue(date1)
    expect(value.value).toEqual(date1)
  })

  it('setValue replaces existing value', () => {
    const { value, setValue } = useCalendar({ defaultValue: date1 })
    setValue(date2)
    expect(value.value).toEqual(date2)
  })

  it('clear() resets value to undefined', () => {
    const { value, clear } = useCalendar({ defaultValue: date1 })
    clear()
    expect(value.value).toBeUndefined()
  })

  it('isDisabled returns true for dates before minValue', () => {
    const { isDisabled } = useCalendar({ minValue: minDate })
    expect(isDisabled(new CalendarDate(2023, 12, 31))).toBe(true)
  })

  it('isDisabled returns false for dates on minValue', () => {
    const { isDisabled } = useCalendar({ minValue: minDate })
    expect(isDisabled(minDate)).toBe(false)
  })

  it('isDisabled returns true for dates after maxValue', () => {
    const { isDisabled } = useCalendar({ maxValue: maxDate })
    expect(isDisabled(new CalendarDate(2025, 1, 1))).toBe(true)
  })

  it('isDisabled uses custom isDateDisabled callback', () => {
    const { isDisabled } = useCalendar({
      isDateDisabled: (d) => d.day === 13,
    })
    expect(isDisabled(new CalendarDate(2024, 6, 13))).toBe(true)
    expect(isDisabled(new CalendarDate(2024, 6, 14))).toBe(false)
  })

  it('isUnavailable uses custom callback', () => {
    const { isUnavailable } = useCalendar({
      isDateUnavailable: (d) => d.day % 2 === 0,
    })
    expect(isUnavailable(new CalendarDate(2024, 1, 2))).toBe(true)
    expect(isUnavailable(new CalendarDate(2024, 1, 1))).toBe(false)
  })

  it('onValueChange updates value', () => {
    const { value, onValueChange } = useCalendar()
    onValueChange(date2)
    expect(value.value).toEqual(date2)
  })

  it('onValueChange with undefined clears value', () => {
    const { value, onValueChange } = useCalendar({ defaultValue: date1 })
    onValueChange(undefined)
    expect(value.value).toBeUndefined()
  })
})
