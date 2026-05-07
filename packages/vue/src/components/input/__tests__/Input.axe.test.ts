import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import Input from '../Input.vue'

describe('Input axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('passes axe in default state (with aria-label)', async () => {
    const wrapper = mount(Input, {
      props: { 'aria-label': 'Text input' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when isInvalid=true with aria-describedby and associated error span', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const wrapper = mount(Input, {
      props: {
        isInvalid: true,
        'aria-label': 'Invalid field',
        'aria-describedby': 'err-msg',
      },
      attachTo: container,
    })
    const errSpan = document.createElement('span')
    errSpan.id = 'err-msg'
    errSpan.textContent = 'This field is required'
    container.appendChild(errSpan)
    mountedWrappers.push(wrapper)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
    document.body.removeChild(container)
  })

  it('passes axe when isDisabled=true', async () => {
    const wrapper = mount(Input, {
      props: {
        isDisabled: true,
        'aria-label': 'Disabled input',
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with bordered variant', async () => {
    const wrapper = mount(Input, {
      props: {
        variant: 'bordered',
        'aria-label': 'Bordered input',
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with type="email"', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'email',
        'aria-label': 'Email address',
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with placeholder and aria-label', async () => {
    const wrapper = mount(Input, {
      props: {
        placeholder: 'Enter text',
        'aria-label': 'Search',
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with start + end icon slots and aria-label', async () => {
    const wrapper = mount(Input, {
      props: { 'aria-label': 'Search' },
      slots: {
        startContent: '<svg aria-hidden="true" width="16" height="16"><circle cx="8" cy="8" r="6" /></svg>',
        endContent: '<svg aria-hidden="true" width="16" height="16"><path d="M4 4l8 8M12 4l-8 8" /></svg>',
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with label prop (no aria-label) — floating inside label', async () => {
    const wrapper = mount(Input, {
      props: { label: 'Email address' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with label + isInvalid + aria-describedby', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const wrapper = mount(Input, {
      props: {
        label: 'Email address',
        isInvalid: true,
        'aria-describedby': 'label-err-msg',
      },
      attachTo: container,
    })
    const errSpan = document.createElement('span')
    errSpan.id = 'label-err-msg'
    errSpan.textContent = 'Enter a valid email'
    container.appendChild(errSpan)
    mountedWrappers.push(wrapper)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
    document.body.removeChild(container)
  })
})
