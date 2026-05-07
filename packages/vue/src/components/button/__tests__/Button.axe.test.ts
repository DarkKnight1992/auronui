import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import Button from '../Button.vue'

const variants = ['primary', 'secondary', 'tertiary', 'outline', 'ghost', 'danger', 'danger-soft', 'success', 'success-soft', 'warning', 'warning-soft'] as const

describe('Button axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  for (const variant of variants) {
    it(`passes axe with variant="${variant}"`, async () => {
      const wrapper = mount(Button, {
        props: { variant },
        slots: { default: `${variant} button` },
        attachTo: document.body,
      })
      mountedWrappers.push(wrapper)
      const results = await axe.run(wrapper.element)
      expect(results).toHaveNoViolations()
    })
  }

  it('passes axe when isLoading=true', async () => {
    const wrapper = mount(Button, {
      props: { isLoading: true, 'aria-label': 'Loading...' },
      slots: { default: 'Submit' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when disabled=true', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
