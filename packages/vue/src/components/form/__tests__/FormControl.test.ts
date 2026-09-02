import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import Form from '../Form.vue'
import FormControl from '../FormControl.vue'
import Checkbox from '../../checkbox/Checkbox.vue'
import Switch from '../../switch/Switch.vue'
import Input from '../../input/Input.vue'
import NumberField from '../../number-field/NumberField.vue'

function host(template: string, setup: Record<string, unknown> = {}) {
  return defineComponent({
    components: { Form, FormControl, Checkbox, Switch, Input, NumberField },
    setup: () => ({ Checkbox, Switch, Input, NumberField, ...setup }),
    template,
  })
}

describe('FormControl — seeding from Form :default-values', () => {
  it('seeds a boolean control from a form-level default (the regression this exists to prevent)', async () => {
    const w = mount(host(`
      <Form :default-values="{ auth_factor: { force_mfa: true }, webhook: { enabled: true } }">
        <FormControl name="auth_factor.force_mfa" :as="Checkbox">MFA</FormControl>
        <FormControl name="webhook.enabled" :as="Switch" />
      </Form>`))
    await flushPromises()

    expect(w.findComponent(Checkbox).props('modelValue')).toBe(true)
    expect(w.findComponent(Switch).props('modelValue')).toBe(true)
    expect(w.findComponent(Form).vm.getValues()).toEqual({
      auth_factor: { force_mfa: true },
      webhook: { enabled: true },
    })
  })

  it('seeds a mixed boolean/number/text form from one nested default object', async () => {
    const w = mount(host(`
      <Form :default-values="dv">
        <FormControl name="password.has_uppercase" :as="Checkbox">Upper</FormControl>
        <FormControl name="password.min_length" :as="NumberField" label="Min" />
        <FormControl name="privacy.tos_link" :as="Input" label="ToS" />
      </Form>`, {
      dv: { password: { has_uppercase: true, min_length: 8 }, privacy: { tos_link: 'https://x.y' } },
    }))
    await flushPromises()

    expect(w.findComponent(Checkbox).props('modelValue')).toBe(true)
    expect(w.findComponent(NumberField).props('modelValue')).toBe(8)
    expect(w.findComponent(Input).props('modelValue')).toBe('https://x.y')
  })

  it('adopts form-level defaults that arrive after mount', async () => {
    const Host = defineComponent({
      components: { Form, FormControl, Checkbox },
      props: { dv: { type: Object, default: undefined } },
      setup: () => ({ Checkbox }),
      template: `
        <Form :default-values="dv">
          <FormControl name="auth_factor.force_mfa" :as="Checkbox">MFA</FormControl>
        </Form>`,
    })
    const w = mount(Host, { props: { dv: undefined } })
    await flushPromises()
    expect(w.findComponent(Checkbox).props('modelValue')).toBeUndefined()

    await w.setProps({ dv: { auth_factor: { force_mfa: true } } })
    await nextTick()
    await flushPromises()
    expect(w.findComponent(Checkbox).props('modelValue')).toBe(true)
  })
})

describe('FormControl — precedence', () => {
  it('field-level default wins over form-level, in both directions', async () => {
    const w = mount(host(`
      <Form :default-values="{ a: false, b: true }">
        <FormControl name="a" :as="Checkbox" :default-value="true">A</FormControl>
        <FormControl name="b" :as="Checkbox" :default-value="false">B</FormControl>
      </Form>`))
    await flushPromises()
    const boxes = w.findAllComponents(Checkbox)
    expect(boxes[0].props('modelValue')).toBe(true)
    expect(boxes[1].props('modelValue')).toBe(false)
  })

  it('an explicit undefined defers to the form; null overrides it', async () => {
    const w = mount(host(`
      <Form :default-values="{ a: true, b: true }">
        <FormControl name="a" :as="Checkbox" :default-value="undefined">A</FormControl>
        <FormControl name="b" :as="Checkbox" :default-value="null">B</FormControl>
      </Form>`))
    await flushPromises()
    const boxes = w.findAllComponents(Checkbox)
    expect(boxes[0].props('modelValue')).toBe(true)
    expect(boxes[1].props('modelValue')).toBe(null)
  })

  it('v-model outranks both and suppresses seeding', async () => {
    const model = ref(false)
    const w = mount(host(`
      <Form :default-values="{ a: true }">
        <FormControl name="a" :as="Checkbox" v-model="model">A</FormControl>
      </Form>`, { model }))
    await flushPromises()
    expect(w.findComponent(Checkbox).props('modelValue')).toBe(false)
  })
})

describe('FormControl — binds only what the control declares', () => {
  it('binds errorMessage to a control that declares it', async () => {
    const w = mount(host(`
      <Form :default-values="{ a: '' }" validation-mode="on-submit">
        <FormControl name="a" :as="Input" label="A" :rules="{ required: 'Required' }" />
        <button type="submit">go</button>
      </Form>`))
    await flushPromises()
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(w.findComponent(Input).props('errorMessage')).toBe('Required')
  })

  it('does NOT leak errormessage onto the DOM of a control that does not declare it', async () => {
    const w = mount(host(`
      <Form validation-mode="on-submit">
        <FormControl name="a" :as="Checkbox" :rules="{ required: 'Required' }">A</FormControl>
        <button type="submit">go</button>
      </Form>`), { attachTo: document.body })
    await flushPromises()
    await w.find('form').trigger('submit')
    await flushPromises()

    expect(w.findComponent(Form).vm.errors.a).toBe('Required')
    expect(w.html().toLowerCase()).not.toContain('errormessage')
    w.unmount()
  })

  it('binds name and isInvalid where declared', async () => {
    const w = mount(host(`
      <Form validation-mode="on-submit">
        <FormControl name="a" :as="Checkbox" :rules="{ required: 'Required' }">A</FormControl>
        <button type="submit">go</button>
      </Form>`))
    await flushPromises()
    expect(w.findComponent(Checkbox).props('name')).toBe('a')
    expect(w.findComponent(Checkbox).props('isInvalid')).toBe(false)

    await w.find('form').trigger('submit')
    await flushPromises()
    expect(w.findComponent(Checkbox).props('isInvalid')).toBe(true)
  })
})

describe('FormControl — isDisabled composition', () => {
  it('a form-level is-disabled disables the control', async () => {
    const w = mount(host(`
      <Form is-disabled>
        <FormControl name="a" :as="Checkbox">A</FormControl>
      </Form>`))
    await flushPromises()
    expect(w.findComponent(Checkbox).props('isDisabled')).toBe(true)
  })

  it('a per-control is-disabled disables it independently', async () => {
    const w = mount(host(`
      <Form>
        <FormControl name="a" :as="Checkbox" is-disabled>A</FormControl>
      </Form>`))
    await flushPromises()
    expect(w.findComponent(Checkbox).props('isDisabled')).toBe(true)
  })

  it('neither set leaves it enabled', async () => {
    const w = mount(host(`
      <Form>
        <FormControl name="a" :as="Checkbox">A</FormControl>
      </Form>`))
    await flushPromises()
    expect(w.findComponent(Checkbox).props('isDisabled')).toBe(false)
  })
})

describe('FormControl — pass-through and updates', () => {
  it('passes arbitrary attrs to the control', async () => {
    const w = mount(host(`
      <Form>
        <FormControl name="a" :as="Input" label="My label" variant="bordered" placeholder="hi" />
      </Form>`))
    await flushPromises()
    const input = w.findComponent(Input)
    expect(input.props('label')).toBe('My label')
    expect(input.props('variant')).toBe('bordered')
    expect(input.props('placeholder')).toBe('hi')
  })

  it('forwards default slot content to the control', async () => {
    const w = mount(host(`
      <Form>
        <FormControl name="a" :as="Checkbox">Require MFA</FormControl>
      </Form>`))
    await flushPromises()
    expect(w.text()).toContain('Require MFA')
  })

  it('an update from the control writes through to getValues()', async () => {
    const w = mount(host(`
      <Form :default-values="{ auth_factor: { force_mfa: false } }">
        <FormControl name="auth_factor.force_mfa" :as="Checkbox">MFA</FormControl>
      </Form>`))
    await flushPromises()

    w.findComponent(Checkbox).vm.$emit('update:modelValue', true)
    await flushPromises()
    expect(w.findComponent(Form).vm.getValues()).toEqual({ auth_factor: { force_mfa: true } })
  })

  it('runs on-blur validation through the forwarded blur listener', async () => {
    const w = mount(host(`
      <Form validation-mode="on-blur">
        <FormControl name="a" :as="Input" label="A" :rules="{ required: 'Required' }" />
      </Form>`), { attachTo: document.body })
    await flushPromises()

    await w.find('input').trigger('blur')
    await flushPromises()
    expect(w.findComponent(Form).vm.errors.a).toBe('Required')
    w.unmount()
  })

  it('tolerates a control that declares no props at all', async () => {
    const Bare = defineComponent({
      name: 'Bare',
      emits: ['update:modelValue'],
      template: `<span data-testid="bare" />`,
    })
    const w = mount(host(`
      <Form :default-values="{ a: 1 }">
        <FormControl name="a" :as="Bare" />
      </Form>`, { Bare }))
    await flushPromises()
    expect(w.find('[data-testid="bare"]').exists()).toBe(true)
    expect(w.findComponent(Form).vm.getValues()).toEqual({ a: 1 })
  })
})

describe('FormField — dev warning for a shadowing false default', () => {
  async function mountWith(fieldDefault: unknown, formDefaults: Record<string, unknown>) {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { _clearWarnedCache } = await import('../../../utils/warnDeprecated')
    _clearWarnedCache()

    const Host = defineComponent({
      components: { Form, FormControl, Checkbox },
      setup: () => ({ Checkbox, fieldDefault, formDefaults }),
      template: `
        <Form :default-values="formDefaults">
          <FormControl name="flag" :as="Checkbox" :default-value="fieldDefault">A</FormControl>
        </Form>`,
    })
    mount(Host)
    await flushPromises()
    const messages = warn.mock.calls.map((c) => String(c[0])).filter((m) => m.startsWith('[AuronUI]'))
    warn.mockRestore()
    return messages
  }

  it('warns when a false field default shadows a true form default', async () => {
    const messages = await mountWith(false, { flag: true })
    expect(messages).toHaveLength(1)
    expect(messages[0]).toContain('FormField "flag"')
    expect(messages[0]).toContain('Boolean prop to false')
  })

  it('stays silent when both are false', async () => {
    expect(await mountWith(false, { flag: false })).toEqual([])
  })

  it('stays silent when there is no form-level entry', async () => {
    expect(await mountWith(false, {})).toEqual([])
  })

  it('stays silent for a non-false field default that shadows', async () => {
    expect(await mountWith(true, { flag: false })).toEqual([])
  })

  it('stays silent when no field default is passed at all', async () => {
    expect(await mountWith(undefined, { flag: true })).toEqual([])
  })
})
