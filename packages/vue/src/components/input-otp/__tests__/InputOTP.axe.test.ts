import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import InputOTP from '../InputOTP.vue'

describe('InputOTP axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('Axe Test 1: InputOTP with aria-label and length=6 passes axe with zero violations', async () => {
    const wrapper = mount(InputOTP, {
      props: { length: 6, 'aria-label': 'One-time password' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 2: Disabled InputOTP passes axe with zero violations', async () => {
    const wrapper = mount(InputOTP, {
      props: { length: 6, disabled: true, 'aria-label': 'One-time password' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 3: Pre-filled InputOTP passes axe with zero violations', async () => {
    const wrapper = mount(InputOTP, {
      props: { length: 6, modelValue: '123456', 'aria-label': 'One-time password' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
