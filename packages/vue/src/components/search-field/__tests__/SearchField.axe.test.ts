import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import SearchField from '../SearchField.vue'

describe('SearchField axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('passes axe in default state (with aria-label)', async () => {
    const wrapper = mount(SearchField, {
      props: { 'aria-label': 'Search' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with a filled value and visible clear button', async () => {
    const wrapper = mount(SearchField, {
      props: { 'aria-label': 'Search', modelValue: 'components' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with label prop (floating inside label)', async () => {
    const wrapper = mount(SearchField, {
      props: { label: 'Search' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when isInvalid=true with aria-describedby and associated error span', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const wrapper = mount(SearchField, {
      props: {
        isInvalid: true,
        'aria-label': 'Search',
        'aria-describedby': 'err-msg',
      },
      attachTo: container,
    })
    const errSpan = document.createElement('span')
    errSpan.id = 'err-msg'
    errSpan.textContent = 'Search failed'
    container.appendChild(errSpan)
    mountedWrappers.push(wrapper)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
    document.body.removeChild(container)
  })

  it('passes axe when isDisabled=true', async () => {
    const wrapper = mount(SearchField, {
      props: { isDisabled: true, 'aria-label': 'Search' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
