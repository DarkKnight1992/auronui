import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, useTemplateRef, nextTick } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import Table from '../Table.vue'

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
    emits: ['update:page', 'update:rowSelection'],
    setup(_, { emit }) {
      const tableRef = useTemplateRef('tableRef')
      return { columns, data, tableProps: props, tableRef, emit, table: tableRef }
    },
    template: '<Table ref="tableRef" :columns="columns" :data="data" v-bind="tableProps" @update:page="emit(\'update:page\', $event)" @update:rowSelection="emit(\'update:rowSelection\', $event)" />',
  })
  const wrapper = mount(Wrapper)
  // Expose the table instance from the mounted wrapper for test access
  Object.defineProperty(wrapper.vm, 'table', {
    get: () => wrapper.findComponent(Table).vm.table,
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
})
