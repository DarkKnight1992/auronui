import { describe, it, expect } from 'vitest'
import { useListBox } from '../useListBox'

describe('useListBox — single mode', () => {
  it('starts with no selection', () => {
    const { selected } = useListBox()
    expect(selected.value).toBeUndefined()
  })

  it('respects defaultSelected', () => {
    const { selected } = useListBox({ defaultSelected: 'apple' })
    expect(selected.value).toBe('apple')
  })

  it('select() sets the selection', () => {
    const { selected, select } = useListBox()
    select('banana')
    expect(selected.value).toBe('banana')
  })

  it('select() replaces prior selection in single mode', () => {
    const { selected, select } = useListBox({ defaultSelected: 'apple' })
    select('banana')
    expect(selected.value).toBe('banana')
  })

  it('deselect() clears the selection', () => {
    const { selected, deselect } = useListBox({ defaultSelected: 'apple' })
    deselect('apple')
    expect(selected.value).toBeUndefined()
  })

  it('deselect() is a no-op for non-selected key', () => {
    const { selected, deselect } = useListBox({ defaultSelected: 'apple' })
    deselect('banana')
    expect(selected.value).toBe('apple')
  })

  it('toggle() selects when not selected', () => {
    const { selected, toggle } = useListBox()
    toggle('apple')
    expect(selected.value).toBe('apple')
  })

  it('toggle() deselects when selected', () => {
    const { selected, toggle } = useListBox({ defaultSelected: 'apple' })
    toggle('apple')
    expect(selected.value).toBeUndefined()
  })

  it('isSelected returns correct value', () => {
    const { isSelected, select } = useListBox()
    select('apple')
    expect(isSelected('apple')).toBe(true)
    expect(isSelected('banana')).toBe(false)
  })

  it('deselectAll clears selection', () => {
    const { selected, deselectAll } = useListBox({ defaultSelected: 'apple' })
    deselectAll()
    expect(selected.value).toBeUndefined()
  })

  it('onSelectionChange updates selected', () => {
    const { selected, onSelectionChange } = useListBox()
    onSelectionChange('cherry')
    expect(selected.value).toBe('cherry')
  })
})

describe('useListBox — multiple mode', () => {
  it('starts with empty array', () => {
    const { selected } = useListBox({ multiple: true })
    expect(selected.value).toEqual([])
  })

  it('select() adds to array', () => {
    const { selected, select } = useListBox({ multiple: true })
    select('apple')
    select('banana')
    expect(selected.value).toEqual(['apple', 'banana'])
  })

  it('select() does not duplicate', () => {
    const { selected, select } = useListBox({ multiple: true })
    select('apple')
    select('apple')
    expect(selected.value).toEqual(['apple'])
  })

  it('deselect() removes from array', () => {
    const { selected, select, deselect } = useListBox({ multiple: true })
    select('apple')
    select('banana')
    deselect('apple')
    expect(selected.value).toEqual(['banana'])
  })

  it('selectAll() sets the full list', () => {
    const { selected, selectAll } = useListBox({ multiple: true })
    selectAll(['apple', 'banana', 'cherry'])
    expect(selected.value).toEqual(['apple', 'banana', 'cherry'])
  })

  it('deselectAll() empties the list', () => {
    const { selected, select, deselectAll } = useListBox({ multiple: true })
    select('apple')
    select('banana')
    deselectAll()
    expect(selected.value).toEqual([])
  })
})
