import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import CloseButton from '../CloseButton.vue'

describe('CloseButton axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  it('default CloseButton passes axe (has aria-label="Close")', async () => {
    const wrapper = mount(CloseButton, { attachTo: document.body })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('CloseButton with custom aria-label passes axe', async () => {
    const wrapper = mount(CloseButton, {
      props: { ariaLabel: 'Dismiss dialog' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('disabled CloseButton passes axe', async () => {
    const wrapper = mount(CloseButton, {
      props: { disabled: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('small CloseButton passes axe', async () => {
    const wrapper = mount(CloseButton, {
      props: { size: 'sm' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
