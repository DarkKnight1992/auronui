import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import Table from '../Table.vue'

interface Person { id: string; name: string }

const data: Person[] = [
  { id: 'a', name: 'Alice' },
  { id: 'b', name: 'Bob' },
  { id: 'c', name: 'Charlie' },
  { id: 'd', name: 'Dave' },
]

const columns: ColumnDef<Person, any>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
]

describe('Table — selection', () => {
  it('no selection column when selection="none" (default)', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    // Only 1 column header (Name) — no __select__ column
    expect(wrapper.findAll('th[role="columnheader"]').length).toBe(1)
  })

  it('selection="multiple" injects checkbox column + header select-all', () => {
    const wrapper = mount(Table, { props: { columns, data, selection: 'multiple' } })
    expect(wrapper.findAll('th[role="columnheader"]').length).toBe(2)
    // Header has a checkbox (select-all)
    expect(wrapper.find('thead [role="checkbox"], thead input[type="checkbox"]').exists()).toBe(true)
  })

  it('selection="single" injects checkbox column but NO header select-all', () => {
    const wrapper = mount(Table, { props: { columns, data, selection: 'single' } })
    expect(wrapper.findAll('th[role="columnheader"]').length).toBe(2)
    // Header has NO checkbox
    expect(wrapper.find('thead [role="checkbox"], thead input[type="checkbox"]').exists()).toBe(false)
  })

  it('clicking row checkbox emits update:rowSelection', async () => {
    const wrapper = mount(Table, { props: { columns, data, selection: 'multiple' } })
    const firstRowCheckbox = wrapper.findAll('tbody [role="checkbox"], tbody input[type="checkbox"]')[0]
    await firstRowCheckbox.trigger('click')
    const emitted = wrapper.emitted('update:rowSelection')
    expect(emitted).toBeTruthy()
    // TanStack uses row index as string ID by default ('0', '1', ...)
    expect(emitted![0][0]).toEqual({ '0': true })
  })

  it('selected row has data-state="checked"', async () => {
    const wrapper = mount(Table, { props: { columns, data, selection: 'multiple' } })
    const firstRowCheckbox = wrapper.findAll('tbody [role="checkbox"], tbody input[type="checkbox"]')[0]
    await firstRowCheckbox.trigger('click')
    await nextTick()
    const firstRow = wrapper.findAll('tbody tr[role="row"]')[0]
    expect(firstRow.attributes('data-state')).toBe('checked')
  })

  it('single selection: clicking a second row replaces the first', async () => {
    const rowSelection = ref<Record<string, boolean>>({})
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        selection: 'single',
        'onUpdate:rowSelection': (v: any) => { rowSelection.value = v },
      },
    })
    const checkboxes = wrapper.findAll('tbody [role="checkbox"], tbody input[type="checkbox"]')
    await checkboxes[0].trigger('click')
    await checkboxes[1].trigger('click')
    // Only row '1' should be selected (single-select replaces; TanStack uses index IDs)
    const selectedKeys = Object.keys(rowSelection.value).filter((k) => (rowSelection.value as any)[k])
    expect(selectedKeys).toEqual(['1'])
  })

  it('multiple selection: header checkbox selects all', async () => {
    const wrapper = mount(Table, { props: { columns, data, selection: 'multiple' } })
    const headerCheckbox = wrapper.find('thead [role="checkbox"], thead input[type="checkbox"]')
    await headerCheckbox.trigger('click')
    await nextTick()
    const selectedRows = wrapper.findAll('tbody tr[data-state="checked"]')
    expect(selectedRows.length).toBe(4)
  })

  it('Space key on a focused gridcell toggles row selection', async () => {
    const wrapper = mount(Table, { props: { columns, data, selection: 'multiple' } })
    const firstRow = wrapper.findAll('tbody tr[role="row"]')[0]
    // Trigger Space on the <tr> directly (vue-test-utils does not support setting event.target)
    await firstRow.trigger('keydown', { key: ' ' })
    await nextTick()
    expect(firstRow.attributes('data-state')).toBe('checked')
  })

  it('Shift+Click selects range in multiple mode', async () => {
    const wrapper = mount(Table, { props: { columns, data, selection: 'multiple' } })
    const rows = wrapper.findAll('tbody tr[role="row"]')
    // Click row 0 first (establish lastClicked)
    await rows[0].trigger('click')
    // Shift+Click row 2 (should select rows 0, 1, 2)
    await rows[2].trigger('click', { shiftKey: true })
    await nextTick()
    const selected = wrapper.findAll('tbody tr[data-state="checked"]')
    expect(selected.length).toBeGreaterThanOrEqual(3)
  })

  it('v-model:rowSelection is reactive (parent -> child)', async () => {
    // TanStack uses row index as string ID: '0'=Alice, '1'=Bob, '2'=Charlie, '3'=Dave
    const rowSelection = ref<Record<string, boolean>>({ '1': true })
    const wrapper = mount(Table, {
      props: { columns, data, selection: 'multiple', rowSelection: rowSelection.value },
    })
    await nextTick()
    const rows = wrapper.findAll('tbody tr[role="row"]')
    // Row at index 1 (Bob) should be checked
    expect(rows[1].attributes('data-state')).toBe('checked')
  })
})
