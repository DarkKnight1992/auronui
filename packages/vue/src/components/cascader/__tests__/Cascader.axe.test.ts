import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import Cascader from '../Cascader.vue'

interface Place {
  value: string
  label: string
  children?: Place[]
}

const items: Place[] = [
  {
    value: 'ca',
    label: 'California',
    children: [
      { value: 'sf', label: 'San Francisco' },
      { value: 'la', label: 'Los Angeles' },
    ],
  },
  { value: 'tx', label: 'Texas' },
]

// Disable region: the Popover panel teleports its content directly into
// body, outside any landmark — same known false positive documented in
// HoverCard.axe.test.ts / DatePicker.axe.test.ts for other Popper-based
// components in this codebase.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    region: { enabled: false },
  },
}

describe('Cascader axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
    document.body.innerHTML = ''
  })

  it('passes axe with a label, closed', async () => {
    const wrapper = mount(Cascader, {
      props: { items, getKey: (i: Record<string, any>) => i.value, getChildren: (i: Record<string, any>) => i.children, label: 'Location' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with an existing modelValue', async () => {
    const wrapper = mount(Cascader, {
      props: {
        items,
        getKey: (i: Record<string, any>) => i.value,
        getChildren: (i: Record<string, any>) => i.children,
        label: 'Location',
        modelValue: ['ca', 'sf'],
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when the panel is open with multiple columns', async () => {
    const wrapper = mount(Cascader, {
      props: {
        items,
        getKey: (i: Record<string, any>) => i.value,
        getChildren: (i: Record<string, any>) => i.children,
        label: 'Location',
        modelValue: ['ca'],
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    await wrapper.find('[data-slot="cascader-trigger"]').trigger('click')
    await wrapper.vm.$nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when isInvalid with errorMessage', async () => {
    const wrapper = mount(Cascader, {
      props: {
        items,
        getKey: (i: Record<string, any>) => i.value,
        getChildren: (i: Record<string, any>) => i.children,
        label: 'Location',
        isInvalid: true,
        errorMessage: 'Please choose a location',
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when isDisabled', async () => {
    const wrapper = mount(Cascader, {
      props: {
        items,
        getKey: (i: Record<string, any>) => i.value,
        getChildren: (i: Record<string, any>) => i.children,
        label: 'Location',
        isDisabled: true,
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })
})
