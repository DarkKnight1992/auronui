import { describe, it, expect } from 'vitest'
import { useTree } from '../useTree'

describe('useTree — single selection', () => {
  it('starts with undefined selected', () => {
    const { selected } = useTree()
    expect(selected.value).toBeUndefined()
  })

  it('respects defaultSelected', () => {
    const { selected } = useTree({ defaultSelected: 'node-1' })
    expect(selected.value).toBe('node-1')
  })

  it('select() sets the selected node', () => {
    const { selected, select } = useTree()
    select('node-1')
    expect(selected.value).toBe('node-1')
  })

  it('select() replaces prior selection in single mode', () => {
    const { selected, select } = useTree({ defaultSelected: 'node-1' })
    select('node-2')
    expect(selected.value).toBe('node-2')
  })

  it('deselect() clears the selection', () => {
    const { selected, deselect } = useTree({ defaultSelected: 'node-1' })
    deselect('node-1')
    expect(selected.value).toBeUndefined()
  })

  it('isSelected returns correct value', () => {
    const { isSelected, select } = useTree()
    select('node-1')
    expect(isSelected('node-1')).toBe(true)
    expect(isSelected('node-2')).toBe(false)
  })

  it('toggle() selects when not selected', () => {
    const { selected, toggle } = useTree()
    toggle('node-1')
    expect(selected.value).toBe('node-1')
  })

  it('toggle() deselects when selected', () => {
    const { selected, toggle } = useTree({ defaultSelected: 'node-1' })
    toggle('node-1')
    expect(selected.value).toBeUndefined()
  })

  it('onSelectionChange updates selected', () => {
    const { selected, onSelectionChange } = useTree()
    onSelectionChange('node-5')
    expect(selected.value).toBe('node-5')
  })
})

describe('useTree — expansion', () => {
  it('starts with empty expanded', () => {
    const { expanded } = useTree()
    expect(expanded.value).toEqual([])
  })

  it('respects defaultExpanded', () => {
    const { expanded } = useTree({ defaultExpanded: ['root', 'branch-1'] })
    expect(expanded.value).toEqual(['root', 'branch-1'])
  })

  it('expand() adds a node to expanded', () => {
    const { expanded, expand } = useTree()
    expand('root')
    expect(expanded.value).toContain('root')
  })

  it('expand() does not duplicate', () => {
    const { expanded, expand } = useTree()
    expand('root')
    expand('root')
    expect(expanded.value).toEqual(['root'])
  })

  it('collapse() removes a node', () => {
    const { expanded, expand, collapse } = useTree()
    expand('root')
    expand('branch-1')
    collapse('root')
    expect(expanded.value).toEqual(['branch-1'])
  })

  it('isExpanded returns correct value', () => {
    const { isExpanded, expand } = useTree()
    expand('root')
    expect(isExpanded('root')).toBe(true)
    expect(isExpanded('leaf')).toBe(false)
  })

  it('toggleExpand() expands a collapsed node', () => {
    const { isExpanded, toggleExpand } = useTree()
    toggleExpand('root')
    expect(isExpanded('root')).toBe(true)
  })

  it('toggleExpand() collapses an expanded node', () => {
    const { isExpanded, expand, toggleExpand } = useTree()
    expand('root')
    toggleExpand('root')
    expect(isExpanded('root')).toBe(false)
  })

  it('expandAll() adds all provided keys', () => {
    const { expanded, expandAll } = useTree()
    expandAll(['root', 'branch-1', 'branch-2'])
    expect(expanded.value).toEqual(['root', 'branch-1', 'branch-2'])
  })

  it('collapseAll() empties expanded', () => {
    const { expanded, expand, collapseAll } = useTree()
    expand('root')
    expand('branch-1')
    collapseAll()
    expect(expanded.value).toEqual([])
  })

  it('onExpandedChange syncs expanded', () => {
    const { expanded, onExpandedChange } = useTree()
    onExpandedChange(['root', 'branch-3'])
    expect(expanded.value).toEqual(['root', 'branch-3'])
  })
})

describe('useTree — multiple selection', () => {
  it('starts with empty array', () => {
    const { selected } = useTree({ multiple: true })
    expect(selected.value).toEqual([])
  })

  it('select() adds to the list', () => {
    const { selected, select } = useTree({ multiple: true })
    select('node-1')
    select('node-2')
    expect(selected.value).toEqual(['node-1', 'node-2'])
  })

  it('deselect() removes from the list', () => {
    const { selected, select, deselect } = useTree({ multiple: true })
    select('node-1')
    select('node-2')
    deselect('node-1')
    expect(selected.value).toEqual(['node-2'])
  })
})
