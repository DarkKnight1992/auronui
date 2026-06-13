import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import axe from 'axe-core'
import Form from '../Form.vue'
import FormField from '../FormField.vue'
import Input from '../../input/Input.vue'

function mountField(opts: {
  name?: string
  rules?: object
  validate?: (v: unknown) => string | undefined
  initialValue?: string
  validationMode?: 'on-submit' | 'on-blur' | 'on-change'
  outsideForm?: boolean
}) {
  const value = ref(opts.initialValue ?? '')

  const inner = defineComponent({
    components: { Form, FormField, Input },
    setup() {
      return {
        value,
        rules: opts.rules,
        validate: opts.validate,
        validationMode: opts.validationMode,
      }
    },
    template: opts.outsideForm
      ? `
          <FormField name="field" v-model="value" :rules="rules" :validate="validate" :validation-mode="validationMode">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Test" />
            </template>
          </FormField>
        `
      : `
          <Form :validation-mode="validationMode ?? 'on-submit'">
            <FormField name="field" v-model="value" :rules="rules" :validate="validate">
              <template #default="{ fieldProps }">
                <Input v-bind="fieldProps" label="Test" />
              </template>
            </FormField>
            <button type="submit">Submit</button>
          </Form>
        `,
  })

  return { wrapper: mount(inner), value }
}

describe('FormField', () => {
  it('renders slot content (Input)', () => {
    const { wrapper } = mountField({})
    expect(wrapper.findComponent(Input).exists()).toBe(true)
  })

  it('passes initial modelValue through fieldProps to the slotted Input', () => {
    const { wrapper } = mountField({ initialValue: 'hello' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('hello')
  })

  it('updates v-model when inner Input changes value', async () => {
    const { wrapper, value } = mountField({})
    await wrapper.find('input').setValue('typed')
    await flushPromises()
    expect(value.value).toBe('typed')
  })

  it('initially isInvalid=false and no errorMessage', () => {
    const { wrapper } = mountField({})
    const input = wrapper.findComponent(Input)
    expect(input.props('isInvalid')).toBe(false)
    expect(input.props('errorMessage')).toBeUndefined()
  })

  it('on-change mode: sets isInvalid after value becomes invalid', async () => {
    const { wrapper } = mountField({ rules: { required: true }, validationMode: 'on-change', initialValue: 'x' })
    await wrapper.find('input').setValue('')
    await flushPromises()
    const input = wrapper.findComponent(Input)
    expect(input.props('isInvalid')).toBe(true)
    expect(input.props('errorMessage')).toBe('This field is required')
  })

  it('on-change mode: clears error when value becomes valid', async () => {
    const { wrapper } = mountField({ rules: { required: true }, validationMode: 'on-change', initialValue: 'x' })
    await wrapper.find('input').setValue('')
    await flushPromises()
    await wrapper.find('input').setValue('fixed')
    await flushPromises()
    expect(wrapper.findComponent(Input).props('isInvalid')).toBe(false)
  })

  it('on-blur mode: does NOT validate on change', async () => {
    const { wrapper } = mountField({ rules: { required: true }, validationMode: 'on-blur', initialValue: 'x' })
    await wrapper.find('input').setValue('')
    await flushPromises()
    expect(wrapper.findComponent(Input).props('isInvalid')).toBe(false)
  })

  it('on-blur mode: validates on blur', async () => {
    const { wrapper } = mountField({ rules: { required: true }, validationMode: 'on-blur', initialValue: '' })
    await wrapper.find('input').trigger('blur')
    await flushPromises()
    expect(wrapper.findComponent(Input).props('isInvalid')).toBe(true)
  })

  it('on-submit mode: does NOT validate on change or blur', async () => {
    const { wrapper } = mountField({ rules: { required: true }, validationMode: 'on-submit', initialValue: '' })
    await wrapper.find('input').setValue('')
    await wrapper.find('input').trigger('blur')
    await flushPromises()
    expect(wrapper.findComponent(Input).props('isInvalid')).toBe(false)
  })

  it('on-submit mode: clears error on change once field has been invalidated', async () => {
    const { wrapper } = mountField({ rules: { required: true }, validationMode: 'on-submit', initialValue: 'x' })
    // Trigger error via submit
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.findComponent(Input).props('isInvalid')).toBe(false) // value is 'x', valid

    // Force an error by emptying the field and submitting
    await wrapper.find('input').setValue('')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.findComponent(Input).props('isInvalid')).toBe(true)

    // Now type a valid value — error should clear immediately without another submit
    await wrapper.find('input').setValue('fixed')
    await flushPromises()
    expect(wrapper.findComponent(Input).props('isInvalid')).toBe(false)
  })

  it('on-blur mode: clears error on change once field has been invalidated', async () => {
    const { wrapper } = mountField({ rules: { required: true }, validationMode: 'on-blur', initialValue: '' })
    await wrapper.find('input').trigger('blur')
    await flushPromises()
    expect(wrapper.findComponent(Input).props('isInvalid')).toBe(true)

    // Type a valid value — error should clear immediately without another blur
    await wrapper.find('input').setValue('hello')
    await flushPromises()
    expect(wrapper.findComponent(Input).props('isInvalid')).toBe(false)
  })

  it('standalone (outside Form): on-change validation works locally', async () => {
    const { wrapper } = mountField({ rules: { required: true }, validationMode: 'on-change', outsideForm: true, initialValue: 'x' })
    await wrapper.find('input').setValue('')
    await flushPromises()
    const input = wrapper.findComponent(Input)
    expect(input.props('isInvalid')).toBe(true)
    expect(input.props('errorMessage')).toBe('This field is required')
  })

  it('passes isDisabled from Form context into fieldProps', async () => {
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val: ref('') } },
      template: `
        <Form :is-disabled="true">
          <FormField name="x" v-model="val">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="X" /></template>
          </FormField>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await nextTick()
    expect(wrapper.findComponent(Input).props('isDisabled')).toBe(true)
  })

  it('passes axe audit — Form + FormField + Input in error state', async () => {
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val: ref('') } },
      template: `
        <Form>
          <FormField name="email" v-model="val" :rules="{ required: true }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Email" />
            </template>
          </FormField>
          <button type="submit">Submit</button>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
    wrapper.unmount()
  })
})
