import { describe, it, expect } from 'vitest'
import { useRangeCalendar } from '../useRangeCalendar'
import { CalendarDate } from '@internationalized/date'

const start = new CalendarDate(2024, 3, 1)
const end = new CalendarDate(2024, 3, 15)
const minDate = new CalendarDate(2024, 1, 1)
const maxDate = new CalendarDate(2024, 12, 31)

describe('useRangeCalendar', () => {
  it('starts with null value', () => {
    const { value } = useRangeCalendar()
    expect(value.value).toBeNull()
  })

  it('respects defaultValue', () => {
    const { value } = useRangeCalendar({ defaultValue: { start, end } })
    expect(value.value).toEqual({ start, end })
  })

  it('start is null when no range selected', () => {
    const { start: s } = useRangeCalendar()
    expect(s.value).toBeNull()
  })

  it('end is null when no range selected', () => {
    const { end: e } = useRangeCalendar()
    expect(e.value).toBeNull()
  })

  it('start and end reflect the selected range', () => {
    const { start: s, end: e } = useRangeCalendar({ defaultValue: { start, end } })
    expect(s.value).toEqual(start)
    expect(e.value).toEqual(end)
  })

  it('isComplete is false with no range', () => {
    const { isComplete } = useRangeCalendar()
    expect(isComplete.value).toBe(false)
  })

  it('isComplete is true when range has start and end', () => {
    const { isComplete } = useRangeCalendar({ defaultValue: { start, end } })
    expect(isComplete.value).toBe(true)
  })

  it('setRange updates value', () => {
    const { value, setRange } = useRangeCalendar()
    setRange({ start, end })
    expect(value.value).toEqual({ start, end })
  })

  it('clearRange resets to null', () => {
    const { value, clearRange } = useRangeCalendar({ defaultValue: { start, end } })
    clearRange()
    expect(value.value).toBeNull()
  })

  it('isDisabled returns true before minValue', () => {
    const { isDisabled } = useRangeCalendar({ minValue: minDate })
    expect(isDisabled(new CalendarDate(2023, 12, 31))).toBe(true)
  })

  it('isDisabled returns true after maxValue', () => {
    const { isDisabled } = useRangeCalendar({ maxValue: maxDate })
    expect(isDisabled(new CalendarDate(2025, 1, 1))).toBe(true)
  })

  it('onValueChange updates value', () => {
    const { value, onValueChange } = useRangeCalendar()
    onValueChange({ start, end })
    expect(value.value).toEqual({ start, end })
  })

  it('onValueChange with null clears range', () => {
    const { value, onValueChange } = useRangeCalendar({ defaultValue: { start, end } })
    onValueChange(null)
    expect(value.value).toBeNull()
  })
})
