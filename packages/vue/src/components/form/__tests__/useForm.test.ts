import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import { useForm } from '../useForm'
import Form from '../Form.vue'
import FormField from '../FormField.vue'
import Input from '../../input/Input.vue'

describe('useForm — context provision', () => {
  it('provides context so FormField registers into it', async () => {
    let form: ReturnType<typeof useForm> | null = null

    const Wrapper = defineComponent({
      components: { FormField, Input },
      setup() {
        form = useForm({ defaultValues: { email: 'test@example.com' } })
        return { form: form! }
      },
      template: `
        <form>
          <FormField name="email">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Email" />
            </template>
          </FormField>
        </form>
      `,
    })
    mount(Wrapper)
    await flushPromises()
    expect(form!.values.value.email).toBe('test@example.com')
  })

  it('values updates reactively when a field changes', async () => {
    const fieldVal = ref('')
    let formRef: ReturnType<typeof useForm> | null = null

    const Wrapper = defineComponent({
      components: { FormField, Input },
      setup() {
        formRef = useForm()
        return { form: formRef!, fieldVal }
      },
      template: `
        <form>
          <FormField name="name" v-model="fieldVal">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Name" /></template>
          </FormField>
        </form>
      `,
    })
    mount(Wrapper)
    await flushPromises()
    expect(formRef!.values.value.name).toBe('')
    fieldVal.value = 'Alice'
    await nextTick()
    expect(formRef!.values.value.name).toBe('Alice')
  })

  it('defaultValues are passed through to ctx.defaultValues', () => {
    const Wrapper = defineComponent({
      setup() {
        const form = useForm({ defaultValues: { country: 'DE' } })
        return { form }
      },
      template: '<div />',
    })
    const wrapper = mount(Wrapper)
    const vm = wrapper.getComponent(Wrapper).vm as { form: ReturnType<typeof useForm> }
    expect(vm.form.defaultValues.country).toBe('DE')
  })
})

describe('useForm — handleSubmit', () => {
  it('handleSubmit calls onValid with values when valid', async () => {
    const fieldVal = ref('Alice')
    let formRef: ReturnType<typeof useForm> | null = null
    const onValid = vi.fn()

    const Wrapper = defineComponent({
      components: { FormField, Input },
      setup() {
        formRef = useForm()
        return { form: formRef!, fieldVal }
      },
      template: `
        <form>
          <FormField name="name" v-model="fieldVal">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Name" /></template>
          </FormField>
        </form>
      `,
    })
    mount(Wrapper)
    await flushPromises()
    await formRef!.handleSubmit(onValid)
    expect(onValid).toHaveBeenCalledWith(
      { name: 'Alice' },
      expect.objectContaining({ setErrors: expect.any(Function) }),
    )
  })

  it('handleSubmit can be used as a template event handler', async () => {
    const onValid = vi.fn()
    const Wrapper = defineComponent({
      components: { FormField, Input },
      setup() {
        const form = useForm()
        return { form, onValid }
      },
      template: `
        <form @submit.prevent="form.handleSubmit(onValid)">
          <FormField name="x">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="X" /></template>
          </FormField>
          <button type="submit">Submit</button>
        </form>
      `,
    })
    const wrapper = mount(Wrapper)
    await flushPromises()
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onValid).toHaveBeenCalled()
  })
})

describe('useForm — with <Form :form> prop', () => {
  it(':form prop wires the external ctx into the Form element', async () => {
    const val = ref('hello')
    let formRef: ReturnType<typeof useForm> | null = null

    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() {
        formRef = useForm()
        return { form: formRef!, val }
      },
      template: `
        <Form :form="form">
          <FormField name="greeting" v-model="val">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Greeting" /></template>
          </FormField>
        </Form>
      `,
    })
    mount(Wrapper)
    await flushPromises()
    expect(formRef!.values.value.greeting).toBe('hello')
  })

  it('submit event still fires via <Form> when using :form prop', async () => {
    const onSubmit = vi.fn()
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() {
        const form = useForm()
        return { form, onSubmit }
      },
      template: `
        <Form :form="form" @submit="onSubmit">
          <button type="submit">Submit</button>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).toHaveBeenCalled()
  })
})

describe('useForm — validationMode and isDisabled', () => {
  it('validationMode option is reflected on ctx', () => {
    const Wrapper = defineComponent({
      setup() {
        const form = useForm({ validationMode: 'on-blur' })
        return { form }
      },
      template: '<div />',
    })
    const wrapper = mount(Wrapper)
    const vm = wrapper.getComponent(Wrapper).vm as { form: ReturnType<typeof useForm> }
    expect(vm.form.validationMode.value).toBe('on-blur')
  })

  it('isDisabled option is reflected on ctx', () => {
    const Wrapper = defineComponent({
      setup() {
        const form = useForm({ isDisabled: true })
        return { form }
      },
      template: '<div />',
    })
    const wrapper = mount(Wrapper)
    const vm = wrapper.getComponent(Wrapper).vm as { form: ReturnType<typeof useForm> }
    expect(vm.form.isDisabled.value).toBe(true)
  })
})
