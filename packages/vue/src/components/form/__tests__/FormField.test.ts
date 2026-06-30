import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import axe from 'axe-core'
import Form from '../Form.vue'
import FormField from '../FormField.vue'
import Input from '../../input/Input.vue'
import { useFormInject } from '../form.context'

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
    expect(input.props('errorMessage')).toBe('Enter a value')
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
    expect(input.props('errorMessage')).toBe('Enter a value')
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

// ── slot: touched / dirty ─────────────────────────────────────────────────────

describe('FormField — slot: touched', () => {
  function mountWithSlotAttrs(opts: { defaultValue?: unknown; initialValue?: unknown } = {}) {
    const value = ref(opts.initialValue ?? '')
    const Wrapper = defineComponent({
      components: { FormField, Input },
      setup() { return { value, ...opts } },
      template: `
        <FormField name="f" v-model="value" :default-value="defaultValue" validation-mode="on-blur">
          <template #default="{ fieldProps, touched, dirty }">
            <Input v-bind="fieldProps" label="F" />
            <span data-touched>{{ String(touched) }}</span>
            <span data-dirty>{{ String(dirty) }}</span>
          </template>
        </FormField>
      `,
    })
    return { wrapper: mount(Wrapper), value }
  }

  it('touched slot prop starts false', () => {
    const { wrapper } = mountWithSlotAttrs()
    expect(wrapper.find('[data-touched]').text()).toBe('false')
  })

  it('touched slot prop becomes true after blur', async () => {
    const { wrapper } = mountWithSlotAttrs()
    await wrapper.find('input').trigger('blur')
    expect(wrapper.find('[data-touched]').text()).toBe('true')
  })

  it('dirty slot prop starts false when value equals defaultValue', async () => {
    const { wrapper } = mountWithSlotAttrs({ initialValue: 'x', defaultValue: 'x' })
    await nextTick()
    expect(wrapper.find('[data-dirty]').text()).toBe('false')
  })

  it('dirty slot prop becomes true when value changes from defaultValue', async () => {
    const { wrapper, value } = mountWithSlotAttrs({ initialValue: 'x', defaultValue: 'x' })
    value.value = 'y'
    await nextTick()
    expect(wrapper.find('[data-dirty]').text()).toBe('true')
  })

  it('dirty slot prop is true when initialValue differs from defaultValue', async () => {
    const { wrapper } = mountWithSlotAttrs({ initialValue: 'changed', defaultValue: 'original' })
    await nextTick()
    expect(wrapper.find('[data-dirty]').text()).toBe('true')
  })
})

// ── defaultValue prop ─────────────────────────────────────────────────────────

describe('FormField — defaultValue', () => {
  it('accepts defaultValue prop without throwing', () => {
    expect(() => {
      const Wrapper = defineComponent({
        components: { FormField, Input },
        setup() { return { val: ref('init') } },
        template: `
          <FormField name="x" v-model="val" default-value="init">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="X" /></template>
          </FormField>
        `,
      })
      mount(Wrapper)
    }).not.toThrow()
  })

  it('reset via Form.reset() restores field to defaultValue', async () => {
    const val = ref('changed')
    const formRef = ref<InstanceType<typeof Form> | null>(null)
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val, formRef } },
      template: `
        <Form ref="formRef">
          <FormField name="n" v-model="val" default-value="original">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="N" /></template>
          </FormField>
        </Form>
      `,
    })
    mount(Wrapper)
    await nextTick()
    const api = formRef.value as unknown as Record<string, unknown>
    ;(api?.reset as (() => void) | undefined)?.()
    await nextTick()
    expect(val.value).toBe('original')
  })

  it('reset also clears touched and dirty', async () => {
    const val = ref('x')
    const formRef = ref<InstanceType<typeof Form> | null>(null)
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val, formRef } },
      template: `
        <Form ref="formRef">
          <FormField name="n" v-model="val" default-value="x" validation-mode="on-blur">
            <template #default="{ fieldProps, touched, dirty }">
              <Input v-bind="fieldProps" label="N" />
              <span data-touched>{{ String(touched) }}</span>
              <span data-dirty>{{ String(dirty) }}</span>
            </template>
          </FormField>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await nextTick()
    // Make field touched and dirty
    val.value = 'other'
    await wrapper.find('input').trigger('blur')
    await nextTick()
    expect(wrapper.find('[data-dirty]').text()).toBe('true')
    expect(wrapper.find('[data-touched]').text()).toBe('true')
    // Reset
    const api = formRef.value as unknown as Record<string, unknown>
    ;(api?.reset as (() => void) | undefined)?.()
    await nextTick()
    expect(wrapper.find('[data-dirty]').text()).toBe('false')
    expect(wrapper.find('[data-touched]').text()).toBe('false')
  })
})

// ── cross-field: matches rule ─────────────────────────────────────────────────

describe('FormField — matches rule (cross-field)', () => {
  it('confirm fails when it does not match password', async () => {
    const password = ref('abc123')
    const confirm = ref('wrong')
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { password, confirm } },
      template: `
        <Form>
          <FormField name="password" v-model="password">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Password" /></template>
          </FormField>
          <FormField name="confirm" v-model="confirm" :rules="{ matches: 'password' }">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Confirm" /></template>
          </FormField>
          <button type="submit">Go</button>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    const inputs = wrapper.findAllComponents(Input)
    expect(inputs[1]!.props('isInvalid')).toBe(true)
    expect(inputs[1]!.props('errorMessage')).toBe('Must match password')
  })

  it('confirm passes when it matches password', async () => {
    const password = ref('abc123')
    const confirm = ref('abc123')
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { password, confirm } },
      template: `
        <Form>
          <FormField name="password" v-model="password">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Password" /></template>
          </FormField>
          <FormField name="confirm" v-model="confirm" :rules="{ matches: 'password' }">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Confirm" /></template>
          </FormField>
          <button type="submit">Go</button>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    const submitSpy = vi.fn()
    wrapper.findComponent(Form).vm.$emit('submit', submitSpy)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    const inputs = wrapper.findAllComponents(Input)
    expect(inputs[1]!.props('isInvalid')).toBe(false)
  })

  it('object form of matches uses custom message', async () => {
    const password = ref('abc')
    const confirm = ref('xyz')
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { password, confirm } },
      template: `
        <Form>
          <FormField name="password" v-model="password">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Password" /></template>
          </FormField>
          <FormField name="confirm" v-model="confirm" :rules="{ matches: { value: 'password', message: 'Passwords must match' } }">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Confirm" /></template>
          </FormField>
          <button type="submit">Go</button>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    const inputs = wrapper.findAllComponents(Input)
    expect(inputs[1]!.props('errorMessage')).toBe('Passwords must match')
  })
})

// ── field-level validationMode override ──────────────────────────────────────

describe('FormField — field-level validationMode', () => {
  it('on-change at field level overrides on-submit at form level', async () => {
    const val = ref('start')
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val } },
      template: `
        <Form validation-mode="on-submit">
          <FormField name="f" v-model="val" :rules="{ required: true }" validation-mode="on-change">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="F" /></template>
          </FormField>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    // Must go through the input element so handleUpdate fires (not just mutating val directly)
    await wrapper.find('input').setValue('')
    await flushPromises()
    expect(wrapper.findComponent(Input).props('isInvalid')).toBe(true)
  })
})

describe('FormField — valueRef registration', () => {
  it('form context values updates when FormField value changes', async () => {
    const val = ref('start')
    let capturedCtx: ReturnType<typeof useFormInject> = null

    const Inspector = defineComponent({
      setup() {
        capturedCtx = useFormInject()
        return {}
      },
      template: '<div />',
    })

    const Wrapper = defineComponent({
      components: { Form, FormField, Input, Inspector },
      setup() { return { val } },
      template: `
        <Form>
          <FormField name="city" v-model="val">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="City" /></template>
          </FormField>
          <Inspector />
        </Form>
      `,
    })
    mount(Wrapper)
    await nextTick()
    expect(capturedCtx!.values.value.city).toBe('start')
    val.value = 'London'
    await nextTick()
    expect(capturedCtx!.values.value.city).toBe('London')
  })
})

describe('FormField — form-level defaultValues fallback', () => {
  it('initializes modelValue from ctx.defaultValues when no field-level default', async () => {
    const val = ref<unknown>(undefined)
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val } },
      template: `
        <Form :default-values="{ country: 'US' }">
          <FormField name="country" v-model="val">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Country" /></template>
          </FormField>
        </Form>
      `,
    })
    mount(Wrapper)
    await nextTick()
    expect(val.value).toBe('US')
  })

  it('field-level default wins over form-level default', async () => {
    const val = ref<unknown>(undefined)
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val } },
      template: `
        <Form :default-values="{ role: 'viewer' }">
          <FormField name="role" v-model="val" default-value="editor">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Role" /></template>
          </FormField>
        </Form>
      `,
    })
    mount(Wrapper)
    await nextTick()
    expect(val.value).toBe('editor')
  })

  it('reset() uses the resolved default (form-level)', async () => {
    const val = ref<unknown>(undefined)
    const formRef = ref<InstanceType<typeof Form> | null>(null)
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val, formRef } },
      template: `
        <Form ref="formRef" :default-values="{ score: 0 }">
          <FormField name="score" v-model="val">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Score" /></template>
          </FormField>
        </Form>
      `,
    })
    mount(Wrapper)
    await nextTick()
    val.value = 99
    await nextTick()
    const api = formRef.value as unknown as Record<string, unknown>
    ;(api.reset as () => void)()
    await nextTick()
    expect(val.value).toBe(0)
  })
})

describe('FormField — deps cross-field re-validation', () => {
  it('re-validates this field when a dep field value changes', async () => {
    const password = ref('secret')
    const confirm = ref('secret')

    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { password, confirm } },
      template: `
        <Form validation-mode="on-submit">
          <FormField name="password" v-model="password">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Password" /></template>
          </FormField>
          <FormField
            name="confirmPassword"
            v-model="confirm"
            :rules="{ matches: 'password' }"
            :deps="['password']"
          >
            <template #default="{ fieldProps, error }">
              <Input v-bind="fieldProps" label="Confirm" />
              <span v-if="error" data-error>{{ error }}</span>
            </template>
          </FormField>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await nextTick()

    // Initially matching — no error
    expect(wrapper.find('[data-error]').exists()).toBe(false)

    // Change password — confirm should re-validate and show error
    password.value = 'different'
    await flushPromises()
    expect(wrapper.find('[data-error]').exists()).toBe(true)
    expect(wrapper.find('[data-error]').text()).toContain('Must match')
  })

  it('clears dep error when values match again', async () => {
    const password = ref('abc')
    const confirm = ref('abc')

    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { password, confirm } },
      template: `
        <Form validation-mode="on-submit">
          <FormField name="password" v-model="password">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Password" /></template>
          </FormField>
          <FormField
            name="confirmPassword"
            v-model="confirm"
            :rules="{ matches: 'password' }"
            :deps="['password']"
          >
            <template #default="{ fieldProps, error }">
              <Input v-bind="fieldProps" label="Confirm" />
              <span v-if="error" data-error>{{ error }}</span>
            </template>
          </FormField>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await nextTick()

    // Trigger error
    password.value = 'xyz'
    await flushPromises()
    expect(wrapper.find('[data-error]').exists()).toBe(true)

    // Fix it
    password.value = 'abc'
    await flushPromises()
    expect(wrapper.find('[data-error]').exists()).toBe(false)
  })
})
