import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
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
  defaultValue?: string
} = {}) {
  const value = ref(opts.initialValue ?? '')
  const onSubmit = vi.fn()
  const onInvalid = vi.fn()
  const onReset = vi.fn()

  const Wrapper = defineComponent({
    components: { Form, FormField, Input },
    setup() {
      return { value, onSubmit, onInvalid, onReset, ...opts }
    },
    template: `
      <Form
        :validation-mode="validationMode"
        :is-disabled="isDisabled"
        @submit="onSubmit"
        @invalid="onInvalid"
        @reset="onReset"
      >
        <FormField name="field" v-model="value" :default-value="defaultValue" :rules="rules" :validate="validate">
          <template #default="{ fieldProps }">
            <Input v-bind="fieldProps" label="Field" />
          </template>
        </FormField>
        <button type="submit">Submit</button>
      </Form>
    `,
  })

  const wrapper = mount(Wrapper)
  return { wrapper, value, onSubmit, onInvalid, onReset }
}

describe('Form — basics', () => {
  it('renders a <form> element', () => {
    const wrapper = mount(Form)
    expect(wrapper.element.tagName.toLowerCase()).toBe('form')
  })

  it('passes class to <form>', () => {
    const wrapper = mount(Form, { props: { class: 'my-form' } })
    expect(wrapper.classes()).toContain('my-form')
  })

  it('calls event.preventDefault() on submit', async () => {
    let defaultPrevented = false
    const wrapper = mount(Form)
    wrapper.find('form').element.addEventListener('submit', (e) => { defaultPrevented = e.defaultPrevented })
    await wrapper.find('form').trigger('submit')
    expect(defaultPrevented).toBe(true)
  })
})

describe('Form — submit', () => {
  it('emits submit with values when no validation errors', async () => {
    const { wrapper, onSubmit } = makeForm({ initialValue: 'hello' })
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit.mock.calls[0]![0].values).toEqual({ field: 'hello' })
    expect(typeof onSubmit.mock.calls[0]![0].setErrors).toBe('function')
  })

  it('emits invalid and does NOT emit submit when required field is empty', async () => {
    const { wrapper, onSubmit, onInvalid } = makeForm({ rules: { required: true }, initialValue: '' })
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onInvalid).toHaveBeenCalledOnce()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onInvalid.mock.calls[0]![0]).toEqual({ field: 'This field is required' })
  })

  it('setErrors merges server errors into the errors map', async () => {
    const { wrapper, onSubmit } = makeForm({ initialValue: 'hello' })
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    const { setErrors } = onSubmit.mock.calls[0]![0]
    setErrors({ field: 'Already taken' })
    await nextTick()
    const input = wrapper.findComponent(Input)
    expect(input.props('isInvalid')).toBe(true)
    expect(input.props('errorMessage')).toBe('Already taken')
  })

  it('isDisabled=true propagates into fieldProps.isDisabled via context', async () => {
    const { wrapper } = makeForm({ isDisabled: true })
    await nextTick()
    expect(wrapper.findComponent(Input).props('isDisabled')).toBe(true)
  })
})

describe('Form — isSubmitted / submitCount', () => {
  it('isSubmitted is false before submit', () => {
    const Wrapper = defineComponent({
      components: { Form },
      template: `<Form v-slot="{ isSubmitted }"><span :data-v="String(isSubmitted)" /></Form>`,
    })
    const wrapper = mount(Wrapper)
    expect(wrapper.find('[data-v]').attributes('data-v')).toBe('false')
  })

  it('isSubmitted becomes true after a valid submit', async () => {
    const Wrapper = defineComponent({
      components: { Form },
      template: `<Form v-slot="{ isSubmitted }"><span :data-v="String(isSubmitted)" /><button type="submit">Go</button></Form>`,
    })
    const wrapper = mount(Wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.find('[data-v]').attributes('data-v')).toBe('true')
  })

  it('isSubmitted becomes true even after an invalid submit', async () => {
    const { wrapper } = makeForm({ rules: { required: true }, initialValue: '' })
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    // Access via defineExpose
    const formVm = wrapper.findComponent(Form).vm as InstanceType<typeof Form>
    expect((formVm as unknown as Record<string, unknown>).isSubmitted).toBeTruthy()
  })

  it('submitCount increments on each submit attempt', async () => {
    const Wrapper = defineComponent({
      components: { Form },
      template: `<Form v-slot="{ submitCount }"><span :data-v="submitCount" /><button type="submit">Go</button></Form>`,
    })
    const wrapper = mount(Wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.find('[data-v]').attributes('data-v')).toBe('2')
  })
})

describe('Form — slot bindings', () => {
  it('slot exposes isSubmitting = false before submit', () => {
    const Wrapper = defineComponent({
      components: { Form },
      template: `<Form v-slot="{ isSubmitting }"><span :data-v="String(isSubmitting)" /></Form>`,
    })
    const wrapper = mount(Wrapper)
    expect(wrapper.find('[data-v]').attributes('data-v')).toBe('false')
  })

  it('slot exposes errors object that updates after invalid submit', async () => {
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val: ref('') } },
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
    await flushPromises()
    expect(wrapper.find('[data-errors]').text()).toContain('"x"')
  })

  it('slot exposes isValid = true when no errors', () => {
    const Wrapper = defineComponent({
      components: { Form },
      template: `<Form v-slot="{ isValid }"><span :data-v="String(isValid)" /></Form>`,
    })
    expect(mount(Wrapper).find('[data-v]').attributes('data-v')).toBe('true')
  })

  it('slot exposes isDirty = false initially', async () => {
    const { wrapper } = makeForm({ initialValue: 'x', defaultValue: 'x' })
    await nextTick()
    const Wrapper2 = defineComponent({
      components: { Form },
      template: `<Form v-slot="{ isDirty }"><span :data-v="String(isDirty)" /></Form>`,
    })
    expect(mount(Wrapper2).find('[data-v]').attributes('data-v')).toBe('false')
  })

  it('slot exposes isTouched = false initially', () => {
    const Wrapper = defineComponent({
      components: { Form },
      template: `<Form v-slot="{ isTouched }"><span :data-v="String(isTouched)" /></Form>`,
    })
    expect(mount(Wrapper).find('[data-v]').attributes('data-v')).toBe('false')
  })
})

describe('Form — imperative API (defineExpose)', () => {
  function mountWithRef() {
    const formRef = ref<InstanceType<typeof Form> | null>(null)
    const val = ref('initial')
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { formRef, val } },
      template: `
        <Form ref="formRef">
          <FormField name="name" v-model="val" default-value="initial" :rules="{ required: true }">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Name" /></template>
          </FormField>
          <button type="submit">Go</button>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    return { wrapper, formRef, val }
  }

  it('getValues() returns current field values', async () => {
    const { wrapper, formRef, val } = mountWithRef()
    await nextTick()
    val.value = 'changed'
    await nextTick()
    const api = formRef.value as unknown as Record<string, unknown>
    expect((api.getValues as () => Record<string, unknown>)()).toEqual({ name: 'changed' })
  })

  it('setValue() updates a field value', async () => {
    const { wrapper, formRef, val } = mountWithRef()
    await nextTick()
    const api = formRef.value as unknown as Record<string, unknown>
    ;(api.setValue as (n: string, v: unknown) => void)('name', 'programmatic')
    await nextTick()
    expect(val.value).toBe('programmatic')
  })

  it('setError() sets a single field error', async () => {
    const { wrapper, formRef } = mountWithRef()
    await nextTick()
    const api = formRef.value as unknown as Record<string, unknown>
    ;(api.setError as (n: string, m: string) => void)('name', 'Server error')
    await nextTick()
    expect(wrapper.findComponent(Input).props('errorMessage')).toBe('Server error')
  })

  it('clearErrors() removes all errors', async () => {
    const { wrapper, formRef } = mountWithRef()
    await nextTick()
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    const api = formRef.value as unknown as Record<string, unknown>
    // Manually set an error first
    ;(api.setError as (n: string, m: string) => void)('name', 'err')
    await nextTick()
    ;(api.clearErrors as () => void)()
    await nextTick()
    expect(wrapper.findComponent(Input).props('isInvalid')).toBe(false)
  })

  it('clearErrors(name) removes only that field\'s error', async () => {
    const { formRef } = mountWithRef()
    await nextTick()
    const api = formRef.value as unknown as Record<string, unknown>
    ;(api.setErrors as (e: Record<string, string>) => void)({ name: 'e1' })
    await nextTick()
    ;(api.clearErrors as (n?: string) => void)('name')
    await nextTick()
    // Vue auto-unwraps exposed refs on the component public instance
    const errors = api.errors as Record<string, string>
    expect(errors.name).toBeUndefined()
  })

  it('trigger() runs all validations and returns false when invalid', async () => {
    const { formRef, val } = mountWithRef()
    await nextTick()
    val.value = ''
    await nextTick()
    const api = formRef.value as unknown as Record<string, unknown>
    const valid = await (api.trigger as () => Promise<boolean>)()
    expect(valid).toBe(false)
  })

  it('trigger(name) runs one field validation', async () => {
    const { formRef, val } = mountWithRef()
    await nextTick()
    val.value = ''
    await nextTick()
    const api = formRef.value as unknown as Record<string, unknown>
    const valid = await (api.trigger as (n?: string) => Promise<boolean>)('name')
    expect(valid).toBe(false)
  })

  it('reset() clears values, errors, isSubmitted, submitCount', async () => {
    const { wrapper, formRef, val } = mountWithRef()
    await nextTick()
    val.value = 'dirty'
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    const api = formRef.value as unknown as Record<string, unknown>
    ;(api.reset as () => void)()
    await nextTick()
    expect(val.value).toBe('initial')
    // Vue auto-unwraps exposed refs on the component public instance
    expect(api.isSubmitted).toBe(false)
    expect(api.submitCount).toBe(0)
  })
})

describe('Form — reset event', () => {
  it('emits reset when reset() is called', async () => {
    const { wrapper, onReset } = makeForm()
    const formVm = wrapper.findComponent(Form).vm as unknown as Record<string, unknown>
    ;(formVm.reset as () => void)()
    await nextTick()
    expect(onReset).toHaveBeenCalledOnce()
  })
})
