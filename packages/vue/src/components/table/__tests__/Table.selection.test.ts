import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
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

function mountTable(extra: Record<string, unknown> = {}) {
  const Wrapper = defineComponent({
    components: { Table },
    setup() {
      return { columns, data, extra }
    },
    template: '<Table :columns="columns" :data="data" v-bind="extra" />',
  })
  return mount(Wrapper)
}

describe('Table — selection', () => {
  it('no selection column when selection="none" (default)', () => {
    const wrapper = mountTable()
    // Only 1 column header (Name) — no __select__ column
    expect(wrapper.findAll('th[role="columnheader"]').length).toBe(1)
  })

  it('selection="multiple" injects checkbox column + header select-all', () => {
    const wrapper = mountTable({ selection: 'multiple' })
    expect(wrapper.findAll('th[role="columnheader"]').length).toBe(2)
    // Header has a checkbox (select-all)
    expect(wrapper.find('thead [role="checkbox"], thead input[type="checkbox"]').exists()).toBe(true)
  })

  it('selection="single" injects checkbox column but NO header select-all', () => {
    const wrapper = mountTable({ selection: 'single' })
    expect(wrapper.findAll('th[role="columnheader"]').length).toBe(2)
    // Header has NO checkbox
    expect(wrapper.find('thead [role="checkbox"], thead input[type="checkbox"]').exists()).toBe(false)
  })

  it('clicking row checkbox emits update:rowSelection', async () => {
    const emitted: Record<string, boolean>[] = []
    const Wrapper = defineComponent({
      components: { Table },
      setup() {
        return {
          columns,
          data,
          onUpdate: (v: Record<string, boolean>) => { emitted.push(v) },
        }
      },
      template: '<Table :columns="columns" :data="data" selection="multiple" @update:row-selection="onUpdate" />',
    })
    const wrapper = mount(Wrapper)
    const firstRowCheckbox = wrapper.findAll('tbody [role="checkbox"], tbody input[type="checkbox"]')[0]
    await firstRowCheckbox.trigger('click')
    expect(emitted.length).toBeGreaterThan(0)
    // TanStack uses row index as string ID by default ('0', '1', ...)
    expect(emitted[0]).toEqual({ '0': true })
  })

  it('selected row has data-state="checked"', async () => {
    const wrapper = mountTable({ selection: 'multiple' })
    const firstRowCheckbox = wrapper.findAll('tbody [role="checkbox"], tbody input[type="checkbox"]')[0]
    await firstRowCheckbox.trigger('click')
    await nextTick()
    const firstRow = wrapper.findAll('tbody tr[role="row"]')[0]
    expect(firstRow.attributes('data-state')).toBe('checked')
  })

  it('single selection: clicking a second row replaces the first', async () => {
    const rowSelection = ref<Record<string, boolean>>({})
    const Wrapper = defineComponent({
      components: { Table },
      setup() {
        return {
          columns,
          data,
          onUpdate: (v: Record<string, boolean>) => { rowSelection.value = v },
        }
      },
      template: '<Table :columns="columns" :data="data" selection="single" @update:row-selection="onUpdate" />',
    })
    const wrapper = mount(Wrapper)
    const checkboxes = wrapper.findAll('tbody [role="checkbox"], tbody input[type="checkbox"]')
    await checkboxes[0].trigger('click')
    await checkboxes[1].trigger('click')
    // Only row '1' should be selected (single-select replaces; TanStack uses index IDs)
    const selectedKeys = Object.keys(rowSelection.value).filter((k) => (rowSelection.value as any)[k])
    expect(selectedKeys).toEqual(['1'])
  })

  it('multiple selection: header checkbox selects all', async () => {
    const wrapper = mountTable({ selection: 'multiple' })
    const headerCheckbox = wrapper.find('thead [role="checkbox"], thead input[type="checkbox"]')
    await headerCheckbox.trigger('click')
    await nextTick()
    const selectedRows = wrapper.findAll('tbody tr[data-state="checked"]')
    expect(selectedRows.length).toBe(4)
  })

  it('Space key on a focused gridcell toggles row selection', async () => {
    const wrapper = mountTable({ selection: 'multiple' })
    const firstRow = wrapper.findAll('tbody tr[role="row"]')[0]
    // Trigger Space on the <tr> directly (vue-test-utils does not support setting event.target)
    await firstRow.trigger('keydown', { key: ' ' })
    await nextTick()
    expect(firstRow.attributes('data-state')).toBe('checked')
  })

  it('Shift+Click selects range in multiple mode', async () => {
    const wrapper = mountTable({ selection: 'multiple' })
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
    const wrapper = mountTable({ selection: 'multiple', rowSelection: rowSelection.value })
    await nextTick()
    const rows = wrapper.findAll('tbody tr[role="row"]')
    // Row at index 1 (Bob) should be checked
    expect(rows[1].attributes('data-state')).toBe('checked')
  })
})
