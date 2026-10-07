import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Form from '../Form.vue'
import FormField from '../FormField.vue'
import { useField } from '../useField'

// An array/object default written inline in a template is a fresh object on
// every render. Defaults used to be compared by reference, so each re-render
// looked like a "new default" and was re-applied — re-rendering again, until
// Vue gave up with "Maximum recursive updates exceeded".

describe('inline array/object defaults', () => {
  it('FormField with an inline array default does not loop on re-render', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errors: unknown[] = []
    const tick = ref(0)
    const w = mount(defineComponent({
      components: { Form, FormField },
      setup: () => ({ tick }),
      template: `
        <Form>
          <FormField name="tags" :default-value="['a', 'b']">
            <template #default="{ fieldProps }">
              <span class="v">{{ JSON.stringify(fieldProps.modelValue) }}-{{ tick }}</span>
            </template>
          </FormField>
        </Form>
      `,
    }), { global: { config: { errorHandler: (e) => { errors.push(e) } } } })
    for (let i = 0; i < 5; i++) { tick.value++; await nextTick() }
    await flushPromises()
    const recursion = warn.mock.calls.some(c => String(c[0]).includes('Maximum recursive updates'))
    warn.mockRestore()
    expect(recursion).toBe(false)
    expect(errors).toEqual([])
    expect(w.find('.v').text()).toBe('["a","b"]-5')
  })

  it('a structurally equal default does not clobber or dirty the field', async () => {
    let field!: ReturnType<typeof useField>
    const dv = ref<Record<string, unknown>>({ tags: ['a'] })
    mount(defineComponent({
      components: { Form },
      setup() { return { dv } },
      template: `<Form :default-values="dv"><Child /></Form>`,
    }, ), {
      global: { components: { Child: defineComponent({ setup() { field = useField('tags'); return () => null } }) } },
    })
    await flushPromises()
    expect(field.isDirty.value).toBe(false)
    dv.value = { tags: ['a'] }
    await flushPromises()
    expect(field.isDirty.value).toBe(false)
    expect(field.modelValue.value).toEqual(['a'])
  })

  it('FormField is not dirty while its array value equals the default', async () => {
    let update!: (v: unknown) => Promise<void>
    const w = mount(defineComponent({
      components: { Form, FormField },
      setup: () => ({ capture: (fp: any) => { update = fp['onUpdate:modelValue'] } }),
      template: `
        <Form :default-values="{ tags: ['a'] }">
          <FormField name="tags" v-slot="{ fieldProps }">{{ capture(fieldProps) }}</FormField>
        </Form>
      `,
    }))
    await flushPromises()
    await update(['a'])
    await flushPromises()
    expect((w.findComponent(Form).vm as any).isDirty).toBe(false)
    await update(['a', 'b'])
    await flushPromises()
    expect((w.findComponent(Form).vm as any).isDirty).toBe(true)
  })
})
