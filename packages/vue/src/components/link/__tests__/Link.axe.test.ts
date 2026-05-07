import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import Link from '../Link.vue'

describe('Link axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  it('default link passes axe', async () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com' },
      slots: { default: 'Visit example.com' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('external link passes axe', async () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', isExternal: true },
      slots: { default: 'External site' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('disabled link passes axe', async () => {
    const wrapper = mount(Link, {
      props: { href: '#', disabled: true, 'aria-label': 'Disabled link' },
      slots: { default: 'Disabled' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
