import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Form from '../Form.vue'
import FormField from '../FormField.vue'
import Input from '../../input/Input.vue'

function makeForm(opts: {
  validationMode?: 'on-submit' | 'on-blur' | 'on-change'
  isDisabled?: boolean
  rules?: object
  validate?: (v: unknown) => string | undefined | Promise<string | undefined>
  initialValue?: string
}) {
  const value = ref(opts.initialValue ?? '')
  const onSubmit = vi.fn()
  const onInvalid = vi.fn()

  const Wrapper = defineComponent({
    components: { Form, FormField, Input },
    setup() {
      return {
        value,
        onSubmit,
        onInvalid,
        validationMode: opts.validationMode,
        isDisabled: opts.isDisabled,
        rules: opts.rules,
        validate: opts.validate,
      }
    },
    template: `
      <Form
        :validation-mode="validationMode"
        :is-disabled="isDisabled"
        @submit="onSubmit"
        @invalid="onInvalid"
      >
        <FormField name="field" v-model="value" :rules="rules" :validate="validate">
          <template #default="{ fieldProps }">
            <Input v-bind="fieldProps" label="Field" />
          </template>
        </FormField>
        <button type="submit">Submit</button>
      </Form>
    `,
  })

  const wrapper = mount(Wrapper)
  return { wrapper, value, onSubmit, onInvalid }
}

describe('Form', () => {
  it('renders a <form> element', () => {
    const wrapper = mount(Form)
    expect(wrapper.element.tagName.toLowerCase()).toBe('form')
  })

  it('passes class to <form>', () => {
    const wrapper = mount(Form, { props: { class: 'my-form' } })
    expect(wrapper.classes()).toContain('my-form')
  })

  it('emits submit with values when no validation errors', async () => {
    const { wrapper, onSubmit } = makeForm({ initialValue: 'hello' })
    await wrapper.find('form').trigger('submit')
    await nextTick()
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit.mock.calls[0]![0].values).toEqual({ field: 'hello' })
    expect(typeof onSubmit.mock.calls[0]![0].setErrors).toBe('function')
  })

  it('emits invalid and does NOT emit submit when required field is empty', async () => {
    const { wrapper, onSubmit, onInvalid } = makeForm({ rules: { required: true }, initialValue: '' })
    await wrapper.find('form').trigger('submit')
    await nextTick()
    expect(onInvalid).toHaveBeenCalledOnce()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onInvalid.mock.calls[0]![0]).toEqual({ field: 'This field is required' })
  })

  it('setErrors merges server errors into the errors map', async () => {
    const { wrapper, onSubmit } = makeForm({ initialValue: 'hello' })
    await wrapper.find('form').trigger('submit')
    await nextTick()
    const { setErrors } = onSubmit.mock.calls[0]![0]
    setErrors({ field: 'Already taken' })
    await nextTick()
    const input = wrapper.findComponent(Input)
    expect(input.props('isInvalid')).toBe(true)
    expect(input.props('errorMessage')).toBe('Already taken')
  })

  it('slot exposes isSubmitting = false before submit', () => {
    const Wrapper = defineComponent({
      components: { Form },
      template: `<Form v-slot="{ isSubmitting }"><span :data-submitting="String(isSubmitting)">x</span></Form>`,
    })
    const wrapper = mount(Wrapper)
    expect(wrapper.find('[data-submitting]').attributes('data-submitting')).toBe('false')
  })

  it('slot exposes errors object that updates after invalid submit', async () => {
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() {
        const val = ref('')
        return { val }
      },
      template: `
        <Form v-slot="{ errors }">
          <FormField name="x" v-model="val" :rules="{ required: true }">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="X" /></template>
          </FormField>
          <span data-errors>{{ JSON.stringify(errors) }}</span>
          <button type="submit">Go</button>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await wrapper.find('form').trigger('submit')
    await nextTick()
    expect(wrapper.find('[data-errors]').text()).toContain('"x"')
  })

  it('isDisabled=true propagates into fieldProps.isDisabled via context', async () => {
    const { wrapper } = makeForm({ isDisabled: true })
    await nextTick()
    const input = wrapper.findComponent(Input)
    expect(input.props('isDisabled')).toBe(true)
  })

  it('calls event.preventDefault() on submit to prevent browser navigation', async () => {
    let defaultPrevented = false
    const wrapper = mount(Form)
    wrapper.find('form').element.addEventListener('submit', (e) => {
      defaultPrevented = e.defaultPrevented
    })
    await wrapper.find('form').trigger('submit')
    expect(defaultPrevented).toBe(true)
  })
})
