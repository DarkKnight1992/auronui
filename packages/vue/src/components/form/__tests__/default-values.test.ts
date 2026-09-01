import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import Form from '../Form.vue'
import FormField from '../FormField.vue'
import Checkbox from '../../checkbox/Checkbox.vue'
import Input from '../../input/Input.vue'
import { useField } from '../useField'

const NESTED = {
  auth_factor: { force_mfa: true },
  password: { min_length: 8 },
  flat_flag: true,
}

const Wrapper = defineComponent({
  components: { Form, FormField, Checkbox },
  props: { dv: { type: Object, default: undefined } },
  template: `
    <Form :default-values="dv">
      <FormField name="auth_factor.force_mfa">
        <template #default="{ fieldProps }"><Checkbox v-bind="fieldProps">MFA</Checkbox></template>
      </FormField>
      <FormField name="password.min_length">
        <template #default="{ fieldProps }"><Checkbox v-bind="fieldProps">Len</Checkbox></template>
      </FormField>
      <FormField name="flat_flag">
        <template #default="{ fieldProps }"><Checkbox v-bind="fieldProps">Flat</Checkbox></template>
      </FormField>
    </Form>
  `,
})

function values(w: ReturnType<typeof mount>): unknown[] {
  return w.findAllComponents(FormField).map((f) => f.vm.modelValue)
}

describe('Form — defaultValues resolution', () => {
  it('resolves dotted field names against a nested defaultValues object', async () => {
    const w = mount(Wrapper, { props: { dv: NESTED } })
    await flushPromises()
    expect(values(w)).toEqual([true, 8, true])
  })

  it('still resolves a literal dotted key when defaultValues is flat', async () => {
    const w = mount(Wrapper, { props: { dv: { 'auth_factor.force_mfa': true } } })
    await flushPromises()
    expect(values(w)[0]).toBe(true)
  })

  it('adopts defaultValues that arrive after mount (fetched from an API)', async () => {
    const w = mount(Wrapper, { props: { dv: undefined } })
    await flushPromises()
    expect(values(w)).toEqual([undefined, undefined, undefined])

    await w.setProps({ dv: NESTED })
    await nextTick()
    await flushPromises()
    expect(values(w)).toEqual([true, 8, true])
  })

  it('never clobbers a value the user already edited', async () => {
    const w = mount(Wrapper, { props: { dv: undefined } })
    await flushPromises()

    // Go through the real update path the bound control uses.
    w.findAllComponents(Checkbox)[0].vm.$emit('update:modelValue', false)
    await flushPromises()

    await w.setProps({ dv: NESTED })
    await nextTick()
    await flushPromises()
    expect(values(w)[0]).toBe(false)
  })

  it('exposes late defaultValues through the form values shape', async () => {
    const w = mount(Wrapper, { props: { dv: undefined } })
    await flushPromises()
    await w.setProps({ dv: NESTED })
    await nextTick()
    await flushPromises()
    expect(w.findComponent(Form).vm.getValues()).toEqual(NESTED)
  })

  it('useField() resolves nested and late defaults too', async () => {
    const Consumer = defineComponent({
      components: { Input },
      setup() {
        return { f: useField('auth_factor.force_mfa') }
      },
      template: `<Input v-bind="f.fieldProps.value" label="x" />`,
    })
    const Host = defineComponent({
      components: { Form, Consumer },
      props: { dv: { type: Object, default: undefined } },
      template: `<Form :default-values="dv"><Consumer /></Form>`,
    })

    const w = mount(Host, { props: { dv: undefined } })
    await flushPromises()
    const consumer = w.findComponent(Consumer)
    expect(consumer.vm.f.modelValue.value).toBeUndefined()

    await w.setProps({ dv: NESTED })
    await nextTick()
    await flushPromises()
    expect(consumer.vm.f.modelValue.value).toBe(true)
  })
})
