import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import axe from 'axe-core'
import Form from '../Form.vue'
import FormControl from '../FormControl.vue'
import FormField from '../FormField.vue'
import Checkbox from '../../checkbox/Checkbox.vue'
import Input from '../../input/Input.vue'
import NumberField from '../../number-field/NumberField.vue'
import Button from '../../button/Button.vue'

describe('FormControl axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach((w) => w.unmount())
    mountedWrappers.length = 0
  })

  async function audit(Comp: ReturnType<typeof defineComponent>) {
    const wrapper = mount(Comp, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    await flushPromises()
    return { wrapper, results: await axe.run(wrapper.element) }
  }

  it('passes axe for a form seeded from nested :default-values', async () => {
    const { results } = await audit(defineComponent({
      components: { Form, FormControl, Button },
      setup: () => ({
        Input,
        defaults: {
          privacy: { tos_link: 'https://example.com/tos', support_email: 'help@example.com' },
        },
      }),
      template: `
        <Form :default-values="defaults">
          <FormControl name="privacy.tos_link" :as="Input" label="Terms of service link" />
          <FormControl name="privacy.support_email" :as="Input" label="Support email" />
          <Button type="submit">Save</Button>
        </Form>`,
    }))
    expect(results).toHaveNoViolations()
  })

  it('passes axe with validation errors surfaced on the controls', async () => {
    const { wrapper, results: _first } = await audit(defineComponent({
      components: { Form, FormControl, Button },
      setup: () => ({ Input }),
      template: `
        <Form validation-mode="on-submit">
          <FormControl name="privacy.tos_link" :as="Input" label="Terms of service link"
            :rules="{ required: 'Enter a link.' }" />
          <FormControl name="privacy.support_email" :as="Input" label="Support email"
            :rules="{ required: 'Enter an email.' }" />
          <Button type="submit">Save</Button>
        </Form>`,
    }))
    void _first

    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain('Enter a link.')

    expect(await axe.run(wrapper.element)).toHaveNoViolations()
  })

  it('passes axe when the whole form is disabled', async () => {
    const { results } = await audit(defineComponent({
      components: { Form, FormControl, Button },
      setup: () => ({ Input, defaults: { name: 'Ada', email: 'ada@example.com' } }),
      template: `
        <Form is-disabled :default-values="defaults">
          <FormControl name="name" :as="Input" label="Name" />
          <FormControl name="email" :as="Input" label="Email" />
          <Button type="submit" is-disabled>Save</Button>
        </Form>`,
    }))
    expect(results).toHaveNoViolations()
  })

  /**
   * Controls that render reka-ui's VisuallyHiddenInput are audited as a PARITY
   * check rather than a clean bill.
   *
   * reka-ui renders a visually-hidden native <input> whenever a `name` is bound
   * and the control sits inside a <form>, for native form submission. That
   * input carries no label — and for Checkbox it is additionally nested inside
   * the `role="checkbox"` button — which axe flags as `label` and
   * `nested-interactive`. It affects every reka-backed control with that shim
   * (Checkbox and NumberField are covered here), and it is pre-existing: the
   * hand-written `FormField` + `v-bind="fieldProps"` pattern binds `name` too
   * and produces the identical set. reka passes a fixed prop set to that input
   * with no $attrs pass-through, so it cannot be corrected from our wrappers.
   *
   * Asserting parity rather than skipping keeps FormControl honest — it must
   * never add a violation of its own — and these will start failing the day the
   * underlying issue is fixed, which is when we want to know.
   */
  it.each([
    ['Checkbox', () => Checkbox, true, ['label', 'nested-interactive']],
    ['NumberField', () => NumberField, 8, ['label']],
  ])('adds no violations beyond the hand-written FormField pattern (%s)', async (_label, as, seed, known) => {
    const control = as()
    const defaults = { group: { flag: seed } }
    const { results: viaControl } = await audit(defineComponent({
      components: { Form, FormControl },
      setup: () => ({ control, defaults }),
      template: `
        <Form :default-values="defaults">
          <FormControl name="group.flag" :as="control" label="Flag">Flag</FormControl>
        </Form>`,
    }))

    const { results: viaField } = await audit(defineComponent({
      components: { Form, FormField },
      setup: () => ({ control, defaults }),
      template: `
        <Form :default-values="defaults">
          <FormField name="group.flag">
            <template #default="{ fieldProps }">
              <component :is="control" v-bind="fieldProps" label="Flag">Flag</component>
            </template>
          </FormField>
        </Form>`,
    }))

    const ids = (r: typeof viaControl) => [...new Set(r.violations.map((v) => v.id))].sort()
    expect(ids(viaControl)).toEqual(ids(viaField))
    // Pin the known set, so a change in either direction is visible.
    expect(ids(viaControl)).toEqual(known)
  })

  it('a boolean control with no name bound is clean', async () => {
    const Bare = defineComponent({
      components: { Checkbox },
      props: { modelValue: { type: Boolean, default: undefined } },
      emits: ['update:modelValue'],
      template: `<Checkbox :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)"><slot /></Checkbox>`,
    })
    const { results } = await audit(defineComponent({
      components: { Form, FormControl },
      setup: () => ({ Bare, defaults: { auth_factor: { force_mfa: true } } }),
      template: `
        <Form :default-values="defaults">
          <FormControl name="auth_factor.force_mfa" :as="Bare">Require MFA</FormControl>
        </Form>`,
    }))
    expect(results).toHaveNoViolations()
  })
})
