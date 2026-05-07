import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import Textarea from '../Textarea.vue'

describe('Textarea axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('passes axe in default state (with aria-label)', async () => {
    const wrapper = mount(Textarea, {
      props: { 'aria-label': 'Description' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when isInvalid=true with aria-describedby and associated error span', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const wrapper = mount(Textarea, {
      props: {
        isInvalid: true,
        'aria-label': 'Invalid field',
        'aria-describedby': 'textarea-err',
      },
      attachTo: container,
    })
    const errSpan = document.createElement('span')
    errSpan.id = 'textarea-err'
    errSpan.textContent = 'This field is required'
    container.appendChild(errSpan)
    mountedWrappers.push(wrapper)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
    document.body.removeChild(container)
  })

  it('passes axe when isDisabled=true', async () => {
    const wrapper = mount(Textarea, {
      props: {
        isDisabled: true,
        'aria-label': 'Disabled textarea',
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with bordered variant', async () => {
    const wrapper = mount(Textarea, {
      props: {
        variant: 'bordered',
        'aria-label': 'Notes',
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with isReadonly=true', async () => {
    const wrapper = mount(Textarea, {
      props: {
        isReadonly: true,
        'aria-label': 'Readonly textarea',
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with placeholder and aria-label', async () => {
    const wrapper = mount(Textarea, {
      props: {
        placeholder: 'Enter text',
        'aria-label': 'Comments',
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
