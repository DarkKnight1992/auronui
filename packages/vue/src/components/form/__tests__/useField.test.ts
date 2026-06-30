import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useField } from '../useField'
import Form from '../Form.vue'

describe('useField — standalone mode (no form context)', () => {
  it('returns modelValue, error, fieldProps', () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() { field = useField('test'); return {} },
      template: '<div />',
    }))
    expect(field!.modelValue.value).toBeUndefined()
    expect(field!.error.value).toBeUndefined()
    expect(field!.isInvalid.value).toBe(false)
    expect(field!.fieldProps.value.name).toBe('test')
  })

  it('handleUpdate sets modelValue', async () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() { field = useField('x'); return {} },
      template: '<div />',
    }))
    await field!.handleUpdate('hello')
    expect(field!.modelValue.value).toBe('hello')
  })

  it('validates in standalone mode with rules', async () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() {
        field = useField('email', { rules: { required: true } })
        return {}
      },
      template: '<div />',
    }))
    await field!.handleUpdate('')
    await flushPromises()
    expect(field!.error.value).toBe('Enter a value')
    expect(field!.isInvalid.value).toBe(true)
  })

  it('handleBlur marks isTouched and triggers on-blur validation', async () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() {
        field = useField('x', { rules: { required: true }, validationMode: 'on-blur' })
        return {}
      },
      template: '<div />',
    }))
    expect(field!.isTouched.value).toBe(false)
    await field!.handleBlur()
    await flushPromises()
    expect(field!.isTouched.value).toBe(true)
    expect(field!.error.value).toBe('Enter a value')
  })

  it('reset() clears value and error', async () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() {
        field = useField('x', { defaultValue: 'original', rules: { required: true } })
        return {}
      },
      template: '<div />',
    }))
    await field!.handleUpdate('')
    await flushPromises()
    expect(field!.error.value).toBeDefined()
    field!.reset()
    await nextTick()
    expect(field!.modelValue.value).toBe('original')
    expect(field!.error.value).toBeUndefined()
  })

  it('isDirty is true when value differs from defaultValue', async () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() {
        field = useField('x', { defaultValue: 'original' })
        return {}
      },
      template: '<div />',
    }))
    expect(field!.isDirty.value).toBe(false)
    await field!.handleUpdate('changed')
    expect(field!.isDirty.value).toBe(true)
  })

  it('custom validator receives value and returns error', async () => {
    let field: ReturnType<typeof useField> | null = null
    const myValidator = vi.fn((v: unknown) => v === 'bad' ? 'Not allowed' : undefined)
    mount(defineComponent({
      setup() {
        field = useField('x', { validate: myValidator })
        return {}
      },
      template: '<div />',
    }))
    await field!.handleUpdate('bad')
    await flushPromises()
    expect(field!.error.value).toBe('Not allowed')
  })

  it('fieldProps includes all input-binding keys', () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() { field = useField('email'); return {} },
      template: '<div />',
    }))
    const fp = field!.fieldProps.value
    expect(fp).toHaveProperty('name', 'email')
    expect(fp).toHaveProperty('modelValue')
    expect(fp).toHaveProperty('onUpdate:modelValue')
    expect(fp).toHaveProperty('isInvalid')
    expect(fp).toHaveProperty('errorMessage')
    expect(fp).toHaveProperty('isDisabled')
    expect(fp).toHaveProperty('onBlur')
  })
})

describe('useField — with form context', () => {
  it('registers into Form and appears in ctx.values', async () => {
    const InnerField = defineComponent({
      setup() {
        useField('rating', { defaultValue: 5 })
        return {}
      },
      template: '<div />',
    })

    const Wrapper = defineComponent({
      components: { Form, InnerField },
      template: `
        <Form v-slot="{ values }">
          <InnerField />
          <span data-v>{{ values.rating }}</span>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await flushPromises()
    expect(wrapper.find('[data-v]').text()).toBe('5')
  })

  it('isDisabled inherits from form context', async () => {
    let field: ReturnType<typeof useField> | null = null

    const InnerField = defineComponent({
      setup() {
        field = useField('x')
        return {}
      },
      template: '<div />',
    })

    mount(defineComponent({
      components: { Form, InnerField },
      template: `<Form :is-disabled="true"><InnerField /></Form>`,
    }))
    await flushPromises()
    expect(field!.isDisabled.value).toBe(true)
  })

  it('form.reset() also resets useField value to defaultValue', async () => {
    let field: ReturnType<typeof useField> | null = null

    const InnerField = defineComponent({
      setup() {
        field = useField('score', { defaultValue: 0 })
        return {}
      },
      template: '<div />',
    })

    const wrapper = mount(defineComponent({
      components: { Form, InnerField },
      template: `<Form><InnerField /></Form>`,
    }))
    await flushPromises()

    await field!.handleUpdate(42)
    expect(field!.modelValue.value).toBe(42)

    const api = wrapper.findComponent(Form).vm as unknown as Record<string, unknown>
    ;(api.reset as () => void)()
    await nextTick()
    expect(field!.modelValue.value).toBe(0)
  })

  it('standalone mode when used outside a Form — no registration errors', () => {
    let field: ReturnType<typeof useField> | null = null
    expect(() => {
      mount(defineComponent({
        setup() { field = useField('x'); return {} },
        template: '<div />',
      }))
    }).not.toThrow()
    expect(field!.isDisabled.value).toBe(false)
  })
})
