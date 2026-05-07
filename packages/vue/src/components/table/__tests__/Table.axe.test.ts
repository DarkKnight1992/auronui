import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
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

describe('Table — axe audit', () => {
  const mounted: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mounted.forEach((w) => w.unmount())
    mounted.length = 0
  })

  it('passes axe with variant="primary"', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, variant: 'primary', ariaLabel: 'Test grid' },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })

  it('passes axe with variant="secondary"', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, variant: 'secondary', ariaLabel: 'Test grid secondary' },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })

  it('passes axe with empty data', async () => {
    const wrapper = mount(Table, {
      props: { columns, data: [], ariaLabel: 'Empty grid' },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })
})
