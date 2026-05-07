import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import Table from '../Table.vue'

interface Person { id: string; name: string; age: number }

const data: Person[] = [
  { id: '1', name: 'Ada', age: 36 },
  { id: '2', name: 'Bob', age: 42 },
  { id: '3', name: 'Cat', age: 28 },
]

const columns: ColumnDef<Person, any>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'age', accessorKey: 'age', header: 'Age' },
]

describe('Table — core', () => {
  it('renders <table role="grid"> with thead and tbody', () => {
    const wrapper = mount(Table, { props: { columns, data, ariaLabel: 'People' } })
    expect(wrapper.find('table').attributes('role')).toBe('grid')
    expect(wrapper.find('table').attributes('aria-label')).toBe('People')
    expect(wrapper.find('thead').exists()).toBe(true)
    expect(wrapper.find('tbody').exists()).toBe(true)
  })

  it('renders 1 header row with 2 columnheaders', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    const headers = wrapper.findAll('th[role="columnheader"]')
    expect(headers.length).toBe(2)
    expect(headers[0].text()).toBe('Name')
    expect(headers[1].text()).toBe('Age')
  })

  it('renders 3 data rows with 2 gridcells each', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    const rows = wrapper.findAll('tbody tr[role="row"]')
    expect(rows.length).toBe(3)
    expect(rows[0].findAll('td[role="gridcell"]').length).toBe(2)
  })

  it('first cell has tabindex=0, others have tabindex=-1 (roving tabindex)', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    const cells = wrapper.findAll('tbody td[role="gridcell"]')
    expect(cells[0].attributes('tabindex')).toBe('0')
    for (let i = 1; i < cells.length; i++) {
      expect(cells[i].attributes('tabindex')).toBe('-1')
    }
  })

  it('variant="primary" applies table-root--primary class', () => {
    const wrapper = mount(Table, { props: { columns, data, variant: 'primary' } })
    expect(wrapper.html()).toContain('table-root--primary')
  })

  it('variant="secondary" applies table-root--secondary class', () => {
    const wrapper = mount(Table, { props: { columns, data, variant: 'secondary' } })
    expect(wrapper.html()).toContain('table-root--secondary')
  })

  it('empty data renders empty tbody without crash', () => {
    const wrapper = mount(Table, { props: { columns, data: [] } })
    expect(wrapper.find('tbody').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr').length).toBe(0)
  })

  it('scoped slot #cell receives row, cell, column, value', () => {
    const wrapper = mount(Table, {
      props: { columns, data },
      slots: {
        cell: (scope: any) => h('span', { class: 'custom-cell' }, `[${scope.value}]`),
      },
    })
    expect(wrapper.html()).toContain('[Ada]')
    expect(wrapper.html()).toContain('[36]')
    expect(wrapper.findAll('.custom-cell').length).toBe(6)
  })

  it('cells have data-row-index and data-col-index for keyboard query', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    expect(wrapper.find('[data-row-index="0"][data-col-index="0"]').exists()).toBe(true)
    expect(wrapper.find('[data-row-index="2"][data-col-index="1"]').exists()).toBe(true)
  })

  it('column headers with accessorKey get aria-sort="none" (TanStack enables sorting by default)', () => {
    // TanStack Table enables sorting by default for accessor columns (getCanSort()=true).
    // aria-sort="none" means sortable but no active sort — correct per WAI-ARIA spec.
    const wrapper = mount(Table, { props: { columns, data } })
    const firstHeader = wrapper.find('th[role="columnheader"]')
    expect(firstHeader.attributes('aria-sort')).toBe('none')
  })
})
