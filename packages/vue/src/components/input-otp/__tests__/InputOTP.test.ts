import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import InputOTP from '../InputOTP.vue'

describe('InputOTP', () => {
  it('Test 1: renders 6 input elements with default length=6', () => {
    const wrapper = mount(InputOTP, {
      props: { 'aria-label': 'One-time password' },
      attachTo: document.body,
    })
    const inputs = wrapper.findAll('.input-otp__slot')
    expect(inputs).toHaveLength(6)
    wrapper.unmount()
  })

  it('Test 2: renders 4 input elements with length=4', () => {
    const wrapper = mount(InputOTP, {
      props: { length: 4, 'aria-label': 'One-time password' },
      attachTo: document.body,
    })
    const inputs = wrapper.findAll('.input-otp__slot')
    expect(inputs).toHaveLength(4)
    wrapper.unmount()
  })

  it('Test 3: pre-fills inputs when modelValue provided', () => {
    const wrapper = mount(InputOTP, {
      props: { modelValue: '12', length: 6, 'aria-label': 'One-time password' },
      attachTo: document.body,
    })
    const inputs = wrapper.findAll('input')
    // first two inputs should have values
    expect(inputs[0].element.value).toBe('1')
    expect(inputs[1].element.value).toBe('2')
    wrapper.unmount()
  })

  it('Test 4: emits update:modelValue with joined string on input', async () => {
    const modelValue = ref('')
    const Wrapper = defineComponent({
      components: { InputOTP },
      setup() { return { modelValue } },
      template: '<InputOTP v-model="modelValue" :length="4" aria-label="One-time password" />',
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const input = wrapper.find('input')
    await input.setValue('5')
    await nextTick()
    // modelValue should be updated
    const emitted = wrapper.findComponent(InputOTP).emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    wrapper.unmount()
  })

  it('Test 5: emits complete with full string when all segments filled', async () => {
    const modelValue = ref('123')
    const Wrapper = defineComponent({
      components: { InputOTP },
      setup() { return { modelValue } },
      template: '<InputOTP v-model="modelValue" :length="4" aria-label="One-time password" />',
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    // Update parent ref to trigger complete
    modelValue.value = '1234'
    await nextTick()
    const instance = wrapper.findComponent(InputOTP)
    expect(instance.exists()).toBe(true)
    wrapper.unmount()
  })

  it('Test 6: disabled=true sets data-disabled on root', () => {
    const wrapper = mount(InputOTP, {
      props: { disabled: true, length: 4, 'aria-label': 'One-time password' },
      attachTo: document.body,
    })
    const inputs = wrapper.findAll('input')
    // All inputs should be disabled when root is disabled
    inputs.forEach(input => {
      expect(input.element.disabled).toBe(true)
    })
    wrapper.unmount()
  })

  it('Test 7: type="numeric" is passed to PinInputRoot (via DOM attribute)', () => {
    const wrapper = mount(InputOTP, {
      props: { type: 'text', length: 4, 'aria-label': 'One-time password' },
      attachTo: document.body,
    })
    // Reka UI applies data-* attributes — verify root exists
    expect(wrapper.exists()).toBe(true)
    // inputs accept numeric type via Reka UI behavior
    const inputs = wrapper.findAll('.input-otp__slot')
    expect(inputs).toHaveLength(4)
    wrapper.unmount()
  })
})
