import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, useTemplateRef, nextTick } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import axe from 'axe-core'
import Table from '../Table.vue'
import Select from '../../select/Select.vue'

interface Item { id: string; name: string }

function makeData(n: number): Item[] {
  return Array.from({ length: n }, (_, i) => ({ id: String(i), name: `Row ${i}` }))
}

const columns: ColumnDef<Item, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
]

function mountTable(data: Item[], props: Record<string, unknown> = {}) {
  const Wrapper = defineComponent({
    components: { Table },
    emits: ['update:page', 'update:rowSelection', 'update:pageSize'],
    setup(_, { emit }) {
      const tableRef = useTemplateRef('tableRef')
      return { columns, data, tableProps: props, tableRef, emit, table: tableRef }
    },
    template: '<Table ref="tableRef" :columns="columns" :data="data" v-bind="tableProps" @update:page="emit(\'update:page\', $event)" @update:rowSelection="emit(\'update:rowSelection\', $event)" @update:pageSize="emit(\'update:pageSize\', $event)" />',
  })
  const wrapper = mount(Wrapper)
  // Expose the table instance from the mounted wrapper for test access.
  // Reads through the component's own template ref (already captured in setup())
  // rather than wrapper.findComponent(Table) — Table's generic SFC type breaks
  // findComponent's overload resolution and falls back to an untyped WrapperLike.
  Object.defineProperty(wrapper.vm, 'table', {
    get: () => (wrapper.vm as unknown as { tableRef: { table: unknown } }).tableRef.table,
  })
  return wrapper
}

function rowNames(wrapper: ReturnType<typeof mountTable>): string[] {
  return wrapper.findAll('tbody tr[role="row"]').map((tr) => tr.find('td').text())
}

describe('Table — pagination (core wiring)', () => {
  it('pagination unset (default): all rows render, no slicing', () => {
    const wrapper = mountTable(makeData(15))
    expect(wrapper.findAll('tbody tr[role="row"]').length).toBe(15)
  })

  it('client mode: pageSize=2, default page renders first 2 rows', () => {
    const wrapper = mountTable(makeData(5), { pagination: { pageSize: 2 } })
    expect(rowNames(wrapper)).toEqual(['Row 0', 'Row 1'])
  })

  it('client mode: page=2 prop renders the second slice', () => {
    const wrapper = mountTable(makeData(5), { pagination: { pageSize: 2 }, page: 2 })
    expect(rowNames(wrapper)).toEqual(['Row 2', 'Row 3'])
  })

  it('manual mode: data is rendered as-is, not re-sliced', () => {
    // Simulates a parent that already fetched only the current page's rows.
    const currentPageData = [makeData(20)[6], makeData(20)[7], makeData(20)[8]]
    const wrapper = mountTable(currentPageData, {
      pagination: { manual: true, pageSize: 3, totalItems: 20 },
      page: 3,
    })
    expect(rowNames(wrapper)).toEqual(['Row 6', 'Row 7', 'Row 8'])
  })

  it('emits update:page when the underlying table changes page (uncontrolled)', async () => {
    const wrapper = mountTable(makeData(5), { pagination: { pageSize: 2 } })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(wrapper.vm as any).table.setPageIndex(1)
    await nextTick()
    expect(wrapper.emitted('update:page')).toEqual([[2]])
    expect(rowNames(wrapper)).toEqual(['Row 2', 'Row 3'])
  })

  it('uncontrolled default: page starts at 1 when `page` prop is not bound', () => {
    const wrapper = mountTable(makeData(5), { pagination: { pageSize: 2 } })
    expect(rowNames(wrapper)).toEqual(['Row 0', 'Row 1'])
  })
})

describe('Table — pagination (footer UI & conflicts)', () => {
  it('auto-renders a Pagination nav in the footer when pagination is set', () => {
    const wrapper = mountTable(makeData(20), { pagination: { pageSize: 5 }, ariaLabel: 'Items' })
    const footer = wrapper.find('tfoot')
    expect(footer.exists()).toBe(true)
    expect(footer.find('nav').exists()).toBe(true)
  })

  it('does not render a footer when pagination is unset and no #footer slot is passed', () => {
    const wrapper = mountTable(makeData(5))
    expect(wrapper.find('tfoot').exists()).toBe(false)
  })

  it('a #footer slot overrides the auto-rendered Pagination control', () => {
    const Wrapper = defineComponent({
      components: { Table },
      setup() {
        return { columns, data: makeData(20) }
      },
      template: `
        <Table :columns="columns" :data="data" :pagination="{ pageSize: 5 }">
          <template #footer><span class="custom-footer">custom</span></template>
        </Table>
      `,
    })
    const wrapper = mount(Wrapper)
    expect(wrapper.find('tfoot .custom-footer').exists()).toBe(true)
    expect(wrapper.find('tfoot nav').exists()).toBe(false)
  })

  it('clicking the next-page control in the auto-rendered Pagination advances the page', async () => {
    const wrapper = mountTable(makeData(20), { pagination: { pageSize: 5 } })
    expect(rowNames(wrapper)).toEqual(['Row 0', 'Row 1', 'Row 2', 'Row 3', 'Row 4'])
    await wrapper.find('tfoot nav [aria-label="Next page"]').trigger('click')
    await nextTick()
    expect(rowNames(wrapper)).toEqual(['Row 5', 'Row 6', 'Row 7', 'Row 8', 'Row 9'])
  })

  it('pagination + virtualRows together: pagination wins, virtualization is disabled, dev warning logged', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountTable(makeData(100), {
      pagination: { pageSize: 5 },
      virtualRows: true,
    })
    // Non-virtualized scroll container has no inline height/overflow style
    // (see Table.vue's `:style="useVirtual ? {...} : undefined"`).
    const scrollContainer = wrapper.find('table').element.parentElement
    expect(scrollContainer?.getAttribute('style')).toBeNull()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('virtualRows'))
    warnSpy.mockRestore()
  })

  it('auto-rendered Pagination footer content is wrapped in a single <tr><td colspan> for valid tfoot markup', () => {
    const wrapper = mountTable(makeData(20), { pagination: { pageSize: 5 } })
    const rows = wrapper.findAll('tfoot > tr')
    expect(rows.length).toBe(1)
    const cell = rows[0].find('td')
    expect(cell.exists()).toBe(true)
    // Single "name" column in this fixture -> colspan should be 1
    expect(cell.attributes('colspan')).toBe('1')
    expect(cell.find('nav').exists()).toBe(true)
  })

  it('custom #footer slot content is also wrapped in a single <tr><td colspan> for valid tfoot markup', () => {
    const Wrapper = defineComponent({
      components: { Table },
      setup() {
        return { columns, data: makeData(20) }
      },
      template: `
        <Table :columns="columns" :data="data" :pagination="{ pageSize: 5 }">
          <template #footer><span class="custom-footer">custom</span></template>
        </Table>
      `,
    })
    const wrapper = mount(Wrapper)
    const rows = wrapper.findAll('tfoot > tr')
    expect(rows.length).toBe(1)
    const cell = rows[0].find('td')
    expect(cell.exists()).toBe(true)
    expect(cell.attributes('colspan')).toBe('1')
    expect(cell.find('.custom-footer').exists()).toBe(true)
  })
})

describe('Table — pagination (page size selector)', () => {
  it('does not render a page-size selector when pageSizeOptions is unset', () => {
    const wrapper = mountTable(makeData(20), { pagination: { pageSize: 5 } })
    expect(wrapper.findComponent(Select).exists()).toBe(false)
  })

  it('renders a page-size selector showing the current page size when pageSizeOptions is set', () => {
    const wrapper = mountTable(makeData(20), {
      pagination: { pageSize: 5 },
      pageSizeOptions: [5, 10, 20],
    })
    const select = wrapper.findComponent(Select)
    expect(select.exists()).toBe(true)
    expect(select.text()).toContain('5')
  })

  it('selecting a different page size re-slices rows, resets to page 1, and emits update:pageSize', async () => {
    const wrapper = mountTable(makeData(20), {
      pagination: { pageSize: 5 },
      pageSizeOptions: [5, 10, 20],
      page: 2,
    })
    expect(rowNames(wrapper)).toEqual(['Row 5', 'Row 6', 'Row 7', 'Row 8', 'Row 9'])

    const select = wrapper.findComponent(Select)
    select.vm.$emit('update:modelValue', 10)
    await nextTick()

    expect(rowNames(wrapper)).toEqual([
      'Row 0', 'Row 1', 'Row 2', 'Row 3', 'Row 4', 'Row 5', 'Row 6', 'Row 7', 'Row 8', 'Row 9',
    ])
    expect(wrapper.emitted('update:page')).toContainEqual([1])
    expect(wrapper.emitted('update:pageSize')).toEqual([[10]])
  })
})

describe('Table — pagination (select-all scoping)', () => {
  it('header select-all only selects rows on the current page, not the whole dataset', async () => {
    // Regression test: TableCheckboxCell previously called
    // getIsAllRowsSelected/toggleAllRowsSelected, which operate on the whole
    // filtered dataset regardless of pagination — "select all" would
    // silently select rows on pages the user never saw.
    const wrapper = mountTable(makeData(10), { selection: 'multiple', pagination: { pageSize: 3 } })
    // rowNames() reads the first <td>, which is now the checkbox cell since
    // selection="multiple" injects a column at position 0 — read the name
    // column (second <td>) directly instead.
    const visibleNames = wrapper.findAll('tbody tr[role="row"]').map((tr) => tr.findAll('td')[1].text())
    expect(visibleNames).toEqual(['Row 0', 'Row 1', 'Row 2'])

    const headerCheckbox = wrapper.find('thead [role="checkbox"]')
    await headerCheckbox.trigger('click')
    await nextTick()

    const emitted = wrapper.emitted('update:rowSelection') as Array<[Record<string, boolean>]>
    expect(emitted).toBeTruthy()
    const lastSelection = emitted[emitted.length - 1][0]
    const selectedIds = Object.keys(lastSelection).filter((k) => lastSelection[k])
    // Only ids '0', '1', '2' (the visible page) should be selected — not all 10 rows.
    expect(selectedIds.sort()).toEqual(['0', '1', '2'])
  })

  it('header select-all checkbox reflects only the current page\'s selection state (indeterminate/checked)', async () => {
    const wrapper = mountTable(makeData(10), { selection: 'multiple', pagination: { pageSize: 3 } })
    const rowCheckboxes = wrapper.findAll('tbody [role="checkbox"]')
    // Select all 3 visible rows individually
    await rowCheckboxes[0].trigger('click')
    await rowCheckboxes[1].trigger('click')
    await rowCheckboxes[2].trigger('click')
    await nextTick()

    const headerCheckbox = wrapper.find('thead [role="checkbox"]')
    // Header should report fully checked (all page rows selected), not
    // indeterminate/unchecked, since only the page-scoped rows are selected
    // and all of them are checked — even though 7 rows elsewhere are not.
    expect(headerCheckbox.attributes('aria-checked')).toBe('true')
  })
})

describe('Table — pagination (axe audit)', () => {
  it('passes axe with pagination enabled', async () => {
    const wrapper = mountTable(makeData(23), { pagination: { pageSize: 5 }, ariaLabel: 'Paginated items' })
    document.body.appendChild(wrapper.element)
    const results = await axe.run(wrapper.element)
    wrapper.unmount()
    expect(results.violations).toEqual([])
  })
})
