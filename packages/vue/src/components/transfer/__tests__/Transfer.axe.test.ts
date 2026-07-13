import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import axe from 'axe-core'
import Transfer from '../Transfer.vue'

const items = [
  { value: 'a', label: 'Alice' },
  { value: 'b', label: 'Bob' },
  { value: 'c', label: 'Carol' },
]

describe('Transfer axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('passes axe with titled panels', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Transfer },
        setup() {
          return { items }
        },
        template: '<Transfer :items="items" :model-value="[\'b\']" :titles="[\'Available\', \'Selected\']" />',
      }),
      { attachTo: document.body },
    )
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with search enabled', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Transfer },
        setup() {
          return { items }
        },
        template: '<Transfer :items="items" is-searchable :titles="[\'Available\', \'Selected\']" />',
      }),
      { attachTo: document.body },
    )
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when disabled', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Transfer },
        setup() {
          return { items }
        },
        template: '<Transfer :items="items" is-disabled :titles="[\'Available\', \'Selected\']" />',
      }),
      { attachTo: document.body },
    )
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
