import { describe, it, expect } from 'vitest'
import { useCheckboxGroup } from '../useCheckboxGroup'

describe('useCheckboxGroup', () => {
  it('starts with empty values by default', () => {
    const { values } = useCheckboxGroup()
    expect(values.value).toEqual([])
  })

  it('respects defaultValues', () => {
    const { values } = useCheckboxGroup({ defaultValues: ['apple', 'banana'] })
    expect(values.value).toEqual(['apple', 'banana'])
  })

  it('isChecked returns true for checked values', () => {
    const { isChecked } = useCheckboxGroup({ defaultValues: ['apple'] })
    expect(isChecked('apple')).toBe(true)
    expect(isChecked('banana')).toBe(false)
  })

  it('toggle() checks an unchecked value', () => {
    const { values, toggle } = useCheckboxGroup()
    toggle('apple')
    expect(values.value).toContain('apple')
  })

  it('toggle() unchecks a checked value', () => {
    const { values, toggle } = useCheckboxGroup({ defaultValues: ['apple'] })
    toggle('apple')
    expect(values.value).not.toContain('apple')
  })

  it('checkAll() adds all provided keys', () => {
    const { values, checkAll } = useCheckboxGroup()
    checkAll(['apple', 'banana', 'cherry'])
    expect(values.value).toEqual(['apple', 'banana', 'cherry'])
  })

  it('checkAll() does not duplicate existing values', () => {
    const { values, checkAll } = useCheckboxGroup({ defaultValues: ['apple'] })
    checkAll(['apple', 'banana'])
    expect(values.value).toEqual(['apple', 'banana'])
  })

  it('uncheckAll() empties values', () => {
    const { values, uncheckAll } = useCheckboxGroup({ defaultValues: ['apple', 'banana'] })
    uncheckAll()
    expect(values.value).toEqual([])
  })

  it('setValues() replaces the list', () => {
    const { values, setValues } = useCheckboxGroup({ defaultValues: ['apple'] })
    setValues(['banana', 'cherry'])
    expect(values.value).toEqual(['banana', 'cherry'])
  })

  it('isIndeterminate is false without options provided', () => {
    const { isIndeterminate, toggle } = useCheckboxGroup()
    toggle('apple')
    expect(isIndeterminate.value).toBe(false)
  })

  it('isIndeterminate is true when some but not all options are checked', () => {
    const { isIndeterminate, toggle } = useCheckboxGroup({
      options: ['apple', 'banana', 'cherry'],
    })
    toggle('apple')
    expect(isIndeterminate.value).toBe(true)
  })

  it('isIndeterminate is false when all options are checked', () => {
    const { isIndeterminate, checkAll } = useCheckboxGroup({
      options: ['apple', 'banana'],
    })
    checkAll(['apple', 'banana'])
    expect(isIndeterminate.value).toBe(false)
  })

  it('isAllChecked is true when every option is checked', () => {
    const { isAllChecked, checkAll } = useCheckboxGroup({
      options: ['apple', 'banana'],
    })
    checkAll(['apple', 'banana'])
    expect(isAllChecked.value).toBe(true)
  })

  it('isAllChecked is false when not all options are checked', () => {
    const { isAllChecked, toggle } = useCheckboxGroup({
      options: ['apple', 'banana'],
    })
    toggle('apple')
    expect(isAllChecked.value).toBe(false)
  })

  it('onValueChange syncs values', () => {
    const { values, onValueChange } = useCheckboxGroup()
    onValueChange(['x', 'y'])
    expect(values.value).toEqual(['x', 'y'])
  })
})
