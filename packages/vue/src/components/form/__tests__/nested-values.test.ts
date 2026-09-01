import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import Form from '../Form.vue'
import FormField from '../FormField.vue'
import FormFieldArray from '../FormFieldArray.vue'
import Input from '../../input/Input.vue'

/** Renders one bound Input per name, at whatever depth the name describes. */
function mountForm(names: string[], opts: {
  defaultValues?: Record<string, unknown>
  validationMode?: 'on-submit' | 'on-blur' | 'on-change'
  rules?: Record<string, object>
  validate?: Record<string, (v: unknown, c?: never) => unknown>
} = {}) {
  const W = defineComponent({
    components: { Form, FormField, Input },
    setup: () => ({ names, ...opts }),
    template: `
      <Form :default-values="defaultValues" :validation-mode="validationMode">
        <FormField
          v-for="n in names" :key="n" :name="n"
          :rules="rules?.[n]" :validate="validate?.[n]"
        >
          <template #default="{ fieldProps }"><Input v-bind="fieldProps" :label="n" /></template>
        </FormField>
        <button type="submit">go</button>
      </Form>`,
  })
  const wrapper = mount(W)
  return { wrapper, form: () => wrapper.findComponent(Form).vm }
}

describe('Form — one value shape for flat, nested and deeply nested names', () => {
  it('seeds every depth from defaultValues and returns the same shape', async () => {
    const defaults = {
      flat: 'f',
      auth_factor: { force_mfa: 'a' },
      a: { b: { c: { d: 'deep' } } },
    }
    const { wrapper, form } = mountForm(['flat', 'auth_factor.force_mfa', 'a.b.c.d'], {
      defaultValues: defaults,
    })
    await flushPromises()
    expect(wrapper.findAll('input').map((i) => (i.element as HTMLInputElement).value))
      .toEqual(['f', 'a', 'deep'])
    expect(form().getValues()).toEqual(defaults)
  })

  it('getValues(name) reads a leaf or a whole subtree at any depth', async () => {
    const { form } = mountForm(['flat', 'a.b.c.d', 'a.b.e'], {
      defaultValues: { flat: 'f', a: { b: { c: { d: 'deep' }, e: 'sibling' } } },
    })
    await flushPromises()
    expect(form().getValues('flat')).toBe('f')
    expect(form().getValues('a.b.c.d')).toBe('deep')
    expect(form().getValues('a.b')).toEqual({ c: { d: 'deep' }, e: 'sibling' })
    expect(form().getValues('a.nope')).toBeUndefined()
  })

  it('setValue writes a leaf by path and fans a subtree out to the fields it covers', async () => {
    const { form } = mountForm(['a.b.c.d', 'a.b.e'], {
      defaultValues: { a: { b: { c: { d: 'deep' }, e: 'sibling' } } },
    })
    await flushPromises()

    form().setValue('a.b.c.d', 'leaf-write')
    expect(form().getValues('a.b.c.d')).toBe('leaf-write')

    form().setValue('a.b', { c: { d: 'subtree' }, e: 'also' })
    expect(form().getValues()).toEqual({ a: { b: { c: { d: 'subtree' }, e: 'also' } } })
  })

  it('hands rules the SAME nested shape on change/blur and on submit', async () => {
    const seen: string[] = []
    const validate = vi.fn((_v: unknown, c?: { values: Record<string, unknown> }) => {
      seen.push(JSON.stringify(c?.values))
      return undefined
    })
    const { wrapper } = mountForm(['a.b'], {
      defaultValues: { a: { b: 'x' } },
      validationMode: 'on-change',
      validate: { 'a.b': validate as never },
    })
    await flushPromises()

    await wrapper.find('input').setValue('y')
    await flushPromises()
    const onChange = seen.pop()

    await wrapper.find('form').trigger('submit')
    await flushPromises()
    const onSubmit = seen.pop()

    expect(onChange).toBe('{"a":{"b":"y"}}')
    expect(onSubmit).toBe(onChange)
  })

  it('resolves a `matches` rule against a nested sibling name', async () => {
    const { wrapper, form } = mountForm(['password.value', 'password.confirm'], {
      defaultValues: { password: { value: 'secret', confirm: 'secret' } },
      rules: { 'password.confirm': { matches: { value: 'password.value', message: 'Must match' } } },
    })
    await flushPromises()

    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(form().errors).toEqual({})

    await wrapper.findAll('input')[1].setValue('different')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(form().errors['password.confirm']).toBe('Must match')
  })

  it('still resolves a `matches` rule across field-array row ids', async () => {
    const W = defineComponent({
      components: { Form, FormFieldArray, FormField, Input },
      setup: () => ({ rows: ref([{ email: 'a@b.c', confirm: 'a@b.c' }]) }),
      template: `
        <Form>
          <FormFieldArray name="contacts" :default-value="rows" v-slot="{ fields, fieldName }">
            <div v-for="row in fields" :key="row.id">
              <FormField :name="fieldName(row.id, 'email')" :default-value="row.defaultValue.email">
                <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="email" /></template>
              </FormField>
              <FormField
                :name="fieldName(row.id, 'confirm')"
                :default-value="row.defaultValue.confirm"
                :rules="{ matches: { value: fieldName(row.id, 'email'), message: 'Must match' } }"
              >
                <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="confirm" /></template>
              </FormField>
            </div>
          </FormFieldArray>
          <button type="submit">go</button>
        </Form>`,
    })
    const wrapper = mount(W)
    await flushPromises()
    const form = () => wrapper.findComponent(Form).vm

    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(form().errors).toEqual({})
    // Row ids are not paths in the public shape — rows index by position.
    expect(form().getValues()).toEqual({ contacts: [{ email: 'a@b.c', confirm: 'a@b.c' }] })

    await wrapper.findAll('input')[1].setValue('nope@x.y')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(Object.values(form().errors)).toEqual(['Must match'])
  })
})
