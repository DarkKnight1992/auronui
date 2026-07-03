import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import axe from 'axe-core'
import type { ColumnDef } from '@tanstack/vue-table'
import Table from '../Table.vue'

interface Person { id: string; name: string; age: number }

const data: Person[] = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  name: `Person ${i + 1}`,
  age: 20 + i,
}))

const columns: ColumnDef<Person, any>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'age', accessorKey: 'age', header: 'Age' },
  { id: 'id', accessorKey: 'id', header: 'ID' },
]

function mountTable(tableData: Person[], extra: Record<string, unknown> = {}) {
  const Wrapper = defineComponent({
    components: { Table },
    setup() {
      return { columns, tableData, extra }
    },
    template: '<Table :columns="columns" :data="tableData" v-bind="extra" />',
  })
  return mount(Wrapper, { attachTo: document.body })
}

describe('Table — axe audit', () => {
  const mounted: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mounted.forEach((w) => w.unmount())
    mounted.length = 0
  })

  it('passes axe with variant="primary"', async () => {
    const wrapper = mountTable(data, { variant: 'primary', ariaLabel: 'Test grid' })
    mounted.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })

  it('passes axe with variant="secondary"', async () => {
    const wrapper = mountTable(data, { variant: 'secondary', ariaLabel: 'Test grid secondary' })
    mounted.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })

  it('passes axe with empty data', async () => {
    const wrapper = mountTable([], { ariaLabel: 'Empty grid' })
    mounted.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })
})
