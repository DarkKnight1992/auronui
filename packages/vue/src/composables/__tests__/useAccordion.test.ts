import { describe, it, expect } from 'vitest'
import { useAccordion } from '../useAccordion'

describe('useAccordion — single mode', () => {
  it('starts with nothing expanded', () => {
    const { expanded } = useAccordion()
    expect(expanded.value).toBeUndefined()
  })

  it('respects defaultExpanded', () => {
    const { expanded } = useAccordion({ defaultExpanded: 'item-1' })
    expect(expanded.value).toBe('item-1')
  })

  it('expand() sets the expanded item', () => {
    const { expanded, expand } = useAccordion()
    expand('item-1')
    expect(expanded.value).toBe('item-1')
  })

  it('expand() replaces the current item in single mode', () => {
    const { expanded, expand } = useAccordion({ defaultExpanded: 'item-1' })
    expand('item-2')
    expect(expanded.value).toBe('item-2')
  })

  it('collapse() is a no-op when collapsible is false', () => {
    const { expanded, expand, collapse } = useAccordion()
    expand('item-1')
    collapse('item-1')
    expect(expanded.value).toBe('item-1')
  })

  it('collapse() clears when collapsible is true', () => {
    const { expanded, expand, collapse } = useAccordion({ collapsible: true })
    expand('item-1')
    collapse('item-1')
    expect(expanded.value).toBeUndefined()
  })

  it('toggle() expands a closed item', () => {
    const { expanded, toggle } = useAccordion({ collapsible: true })
    toggle('item-1')
    expect(expanded.value).toBe('item-1')
  })

  it('toggle() collapses an open item when collapsible', () => {
    const { expanded, toggle } = useAccordion({ collapsible: true, defaultExpanded: 'item-1' })
    toggle('item-1')
    expect(expanded.value).toBeUndefined()
  })

  it('isExpanded returns correct boolean', () => {
    const { isExpanded, expand } = useAccordion()
    expand('item-1')
    expect(isExpanded('item-1')).toBe(true)
    expect(isExpanded('item-2')).toBe(false)
  })

  it('onValueChange syncs expanded', () => {
    const { expanded, onValueChange } = useAccordion()
    onValueChange('item-3')
    expect(expanded.value).toBe('item-3')
  })
})

describe('useAccordion — multiple mode', () => {
  it('starts with empty array', () => {
    const { expanded } = useAccordion({ type: 'multiple' })
    expect(expanded.value).toEqual([])
  })

  it('expand() adds to the list', () => {
    const { expanded, expand } = useAccordion({ type: 'multiple' })
    expand('item-1')
    expand('item-2')
    expect(expanded.value).toEqual(['item-1', 'item-2'])
  })

  it('expand() does not duplicate', () => {
    const { expanded, expand } = useAccordion({ type: 'multiple' })
    expand('item-1')
    expand('item-1')
    expect(expanded.value).toEqual(['item-1'])
  })

  it('collapse() removes from the list', () => {
    const { expanded, expand, collapse } = useAccordion({ type: 'multiple' })
    expand('item-1')
    expand('item-2')
    collapse('item-1')
    expect(expanded.value).toEqual(['item-2'])
  })

  it('collapseAll() empties the list', () => {
    const { expanded, expand, collapseAll } = useAccordion({ type: 'multiple' })
    expand('item-1')
    expand('item-2')
    collapseAll()
    expect(expanded.value).toEqual([])
  })
})
