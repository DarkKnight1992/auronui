import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import Table from '../Table.vue'

interface Person { id: string; name: string; age: number }

const data: Person[] = [
  { id: '1', name: 'Charlie', age: 30 },
  { id: '2', name: 'Alice',   age: 25 },
  { id: '3', name: 'Bob',     age: 28 },
]

const sortableColumns: ColumnDef<Person, any>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true },
  { id: 'age',  accessorKey: 'age',  header: 'Age',  enableSorting: true },
]

const mixedColumns: ColumnDef<Person, any>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name', enableSorting: true },
  { id: 'age',  accessorKey: 'age',  header: 'Age',  enableSorting: false },
]

function getCellText(wrapper: any, rowIndex: number, colIndex: number): string {
  return wrapper.find(`tbody [data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`).text()
}

function mountTable(tableColumns: ColumnDef<Person, any>[]) {
  const Wrapper = defineComponent({
    components: { Table },
    setup() {
      return { tableColumns, data }
    },
    template: '<Table :columns="tableColumns" :data="data" />',
  })
  return mount(Wrapper)
}

describe('Table — sorting', () => {
  it('sortable header has aria-sort="none" initially', () => {
    const wrapper = mountTable(sortableColumns)
    const name = wrapper.findAll('th[role="columnheader"]')[0]
    expect(name.attributes('aria-sort')).toBe('none')
  })

  it('non-sortable header has no aria-sort attribute', () => {
    const wrapper = mountTable(mixedColumns)
    const age = wrapper.findAll('th[role="columnheader"]')[1]
    expect(age.attributes('aria-sort')).toBeUndefined()
  })

  it('clicking sortable header toggles asc -> desc -> none', async () => {
    const wrapper = mountTable(sortableColumns)
    const nameHeader = wrapper.findAll('th[role="columnheader"]')[0]

    await nameHeader.trigger('click')
    expect(nameHeader.attributes('aria-sort')).toBe('ascending')
    expect(getCellText(wrapper, 0, 0)).toBe('Alice')
    expect(getCellText(wrapper, 1, 0)).toBe('Bob')
    expect(getCellText(wrapper, 2, 0)).toBe('Charlie')

    await nameHeader.trigger('click')
    expect(nameHeader.attributes('aria-sort')).toBe('descending')
    expect(getCellText(wrapper, 0, 0)).toBe('Charlie')
    expect(getCellText(wrapper, 2, 0)).toBe('Alice')

    await nameHeader.trigger('click')
    expect(nameHeader.attributes('aria-sort')).toBe('none')
  })

  it('Space key on focused sortable header toggles sort', async () => {
    const wrapper = mountTable(sortableColumns)
    const nameHeader = wrapper.findAll('th[role="columnheader"]')[0]
    await nameHeader.trigger('keydown', { key: ' ' })
    expect(nameHeader.attributes('aria-sort')).toBe('ascending')
  })

  it('Enter key on focused sortable header toggles sort', async () => {
    const wrapper = mountTable(sortableColumns)
    const nameHeader = wrapper.findAll('th[role="columnheader"]')[0]
    await nameHeader.trigger('keydown', { key: 'Enter' })
    expect(nameHeader.attributes('aria-sort')).toBe('ascending')
  })

  it('clicking non-sortable header does nothing', async () => {
    const wrapper = mountTable(mixedColumns)
    const ageHeader = wrapper.findAll('th[role="columnheader"]')[1]
    await ageHeader.trigger('click')
    expect(ageHeader.attributes('aria-sort')).toBeUndefined()
    // data unchanged
    expect(getCellText(wrapper, 0, 0)).toBe('Charlie')
  })

  it('sortable header has data-allows-sorting="true"', () => {
    const wrapper = mountTable(sortableColumns)
    const name = wrapper.findAll('th[role="columnheader"]')[0]
    expect(name.attributes('data-allows-sorting')).toBe('true')
  })
})

describe('Table — controlled / manual sorting', () => {
  function mountControlled(props: Record<string, unknown>) {
    return mount(Table as any, { props: { columns: sortableColumns, data, ...props } })
  }

  it('emits update:sorting when a sortable header is clicked', async () => {
    const wrapper = mountControlled({})
    await wrapper.findAll('th[role="columnheader"]')[0].trigger('click')
    expect(wrapper.emitted('update:sorting')?.[0]).toEqual([[{ id: 'name', desc: false }]])
  })

  it('reflects a controlled sorting prop in aria-sort and row order', async () => {
    const wrapper = mountControlled({ sorting: [{ id: 'age', desc: true }] })
    const ageHeader = wrapper.findAll('th[role="columnheader"]')[1]
    expect(ageHeader.attributes('aria-sort')).toBe('descending')
    expect(getCellText(wrapper, 0, 0)).toBe('Charlie')
    await wrapper.setProps({ sorting: [{ id: 'name', desc: false }] })
    expect(getCellText(wrapper, 0, 0)).toBe('Alice')
  })

  it('manual-sorting leaves row order to the caller but still reports the sort', async () => {
    const wrapper = mountControlled({ manualSorting: true })
    const nameHeader = wrapper.findAll('th[role="columnheader"]')[0]
    await nameHeader.trigger('click')
    expect(wrapper.emitted('update:sorting')?.[0]).toEqual([[{ id: 'name', desc: false }]])
    expect(nameHeader.attributes('aria-sort')).toBe('ascending')
    // data order unchanged: Charlie, Alice, Bob
    expect(getCellText(wrapper, 0, 0)).toBe('Charlie')
    expect(getCellText(wrapper, 1, 0)).toBe('Alice')
  })
})
