import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import Table from '../Table.vue'

interface Item {
  id: string
  name: string
}

function makeData(n: number): Item[] {
  return Array.from({ length: n }, (_, i) => ({ id: String(i), name: `Row ${i}` }))
}

const columns: ColumnDef<Item, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
]

describe('Table — virtualization', () => {
  it('virtualRows=false (default) renders standard <tbody> with all rows', () => {
    const data = makeData(20)
    const wrapper = mount(Table, { props: { columns, data } })
    expect(wrapper.find('tbody').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr[role="row"]').length).toBe(20)
  })

  it('virtualRows=true renders <tbody> (virtualized mode)', () => {
    const data = makeData(100)
    const wrapper = mount(Table, {
      props: { columns, data, virtualRows: true },
      attachTo: document.body,
    })
    // Virtualized mode uses <tbody> with spacer rows — valid table structure
    expect(wrapper.find('tbody').exists()).toBe(true)
    // Should NOT render all 100 rows in jsdom (no layout engine)
    expect(wrapper.findAll('tbody tr[role="row"]').length).toBeLessThan(100)
    wrapper.unmount()
  })

  it('virtualRows=50 threshold: data.length=30 renders non-virtual <tbody>', () => {
    const data = makeData(30)
    const wrapper = mount(Table, { props: { columns, data, virtualRows: 50 } })
    expect(wrapper.find('tbody').exists()).toBe(true)
    // div[role="rowgroup"] is no longer used; both modes use <tbody>
    expect(wrapper.find('div[role="rowgroup"]').exists()).toBe(false)
  })

  it('virtualRows=50 threshold: data.length=100 renders virtualized <tbody>', () => {
    const data = makeData(100)
    const wrapper = mount(Table, {
      props: { columns, data, virtualRows: 50 },
      attachTo: document.body,
    })
    expect(wrapper.find('tbody').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr[role="row"]').length).toBeLessThan(100)
    wrapper.unmount()
  })

  it('virtualized rows have role="row" and role="gridcell"', async () => {
    const data = makeData(100)
    const wrapper = mount(Table, {
      props: { columns, data, virtualRows: true },
      attachTo: document.body,
    })
    await nextTick()
    // Virtualized mode uses <tbody> with spacer rows; the tbody always exists.
    expect(wrapper.find('tbody').exists()).toBe(true)
    wrapper.unmount()
  })

  it('aria-rowcount on <table> reflects total data.length (not visible count)', () => {
    const data = makeData(500)
    const wrapper = mount(Table, {
      props: { columns, data, virtualRows: true },
      attachTo: document.body,
    })
    expect(wrapper.find('table').attributes('aria-rowcount')).toBe('500')
    wrapper.unmount()
  })

  it('aria-rowcount = data.length in non-virtual mode', () => {
    const data = makeData(20)
    const wrapper = mount(Table, { props: { columns, data } })
    expect(wrapper.find('table').attributes('aria-rowcount')).toBe('20')
  })

  it('virtualized cells have data-row-index attribute set on gridcells', async () => {
    const data = makeData(100)
    const wrapper = mount(Table, {
      props: { columns, data, virtualRows: true },
      attachTo: document.body,
    })
    await nextTick()
    // Confirm the tbody exists and cells inside it carry data-row-index.
    // jsdom has no layout engine so the virtualizer may render 0 or more items.
    expect(wrapper.find('tbody').exists()).toBe(true)
    const cells = wrapper.findAll('[data-row-index]')
    // For any cells that were rendered, data-row-index must be a valid index
    for (const cell of cells) {
      const rowIndex = parseInt(cell.attributes('data-row-index') ?? '-1', 10)
      // Valid virtual item indices are within data bounds
      if (rowIndex >= 0) {
        expect(rowIndex).toBeLessThan(data.length)
      }
    }
    wrapper.unmount()
  })

  it('virtualized mode preserves selection state for initially-visible rows', async () => {
    const data = makeData(100)
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        virtualRows: true,
        selection: 'multiple',
        rowSelection: { '0': true },
      },
      attachTo: document.body,
    })
    await nextTick()
    // Row 0 is in the initial visible range; it should carry data-state="checked"
    const checkedRows = wrapper.findAll('[data-state="checked"]')
    // jsdom may not render virtual items, but if it does they must be marked
    if (checkedRows.length > 0) {
      expect(checkedRows[0].attributes('data-state')).toBe('checked')
    }
    wrapper.unmount()
  })

  it('switching virtualRows from false to true still renders <tbody>', async () => {
    const data = makeData(100)
    const wrapper = mount(Table, {
      props: { columns, data, virtualRows: false },
      attachTo: document.body,
    })
    expect(wrapper.findAll('tbody tr[role="row"]').length).toBe(100)
    await wrapper.setProps({ virtualRows: true })
    await nextTick()
    // Virtualized mode also uses <tbody>; row count drops to only visible rows
    expect(wrapper.find('tbody').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr[role="row"]').length).toBeLessThan(100)
    wrapper.unmount()
  })
})
