import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Textarea from '../Textarea.vue'

describe('Textarea', () => {
  it('renders wrapper <div> containing a native <textarea>', () => {
    const wrapper = mount(Textarea)
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('applies base textarea class with default variant/size/color on inputWrapper', () => {
    const wrapper = mount(Textarea)
    const field = wrapper.find('.textarea')
    expect(field.exists()).toBe(true)
    expect(field.classes()).toContain('textarea--flat')
    expect(field.classes()).toContain('textarea--default')
    expect(field.classes()).not.toContain('textarea--md')
  })

  it('v-model two-way binding works (defineModel<string>)', async () => {
    let value = 'hello'
    const wrapper = mount(Textarea, {
      props: {
        modelValue: value,
        'onUpdate:modelValue': (v: string) => { value = v },
      },
    })
    const textareaEl = wrapper.find('textarea')
    expect((textareaEl.element as HTMLTextAreaElement).value).toBe('hello')
    await textareaEl.setValue('world')
    expect(value).toBe('world')
  })

  it('isInvalid: true sets data-invalid on wrapper AND aria-invalid on textarea', () => {
    const wrapper = mount(Textarea, { props: { isInvalid: true } })
    expect(wrapper.attributes('data-invalid')).toBeTruthy()
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBeTruthy()
  })

  it('isInvalid: false — neither data-invalid on wrapper nor aria-invalid on textarea', () => {
    const wrapper = mount(Textarea, { props: { isInvalid: false } })
    expect(wrapper.attributes('data-invalid')).toBeUndefined()
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBeUndefined()
  })

  it('isDisabled: true sets data-disabled on wrapper AND native disabled on textarea', () => {
    const wrapper = mount(Textarea, { props: { isDisabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeTruthy()
    expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
  })

  it('isDisabled: false — neither data-disabled nor native disabled present', () => {
    const wrapper = mount(Textarea, { props: { isDisabled: false } })
    expect(wrapper.attributes('data-disabled')).toBeUndefined()
    expect(wrapper.find('textarea').attributes('disabled')).toBeUndefined()
  })

  it('isReadonly: true sets data-readonly on wrapper AND native readonly on textarea', () => {
    const wrapper = mount(Textarea, { props: { isReadonly: true } })
    expect(wrapper.attributes('data-readonly')).toBeTruthy()
    expect(wrapper.find('textarea').attributes('readonly')).toBeDefined()
  })

  it('isReadonly: false — neither data-readonly nor readonly present', () => {
    const wrapper = mount(Textarea, { props: { isReadonly: false } })
    expect(wrapper.attributes('data-readonly')).toBeUndefined()
    expect(wrapper.find('textarea').attributes('readonly')).toBeUndefined()
  })

  it('isRequired: true sets data-required on wrapper AND native required on textarea', () => {
    const wrapper = mount(Textarea, { props: { isRequired: true } })
    expect(wrapper.attributes('data-required')).toBeTruthy()
    expect(wrapper.find('textarea').attributes('required')).toBeDefined()
  })

  it('rows prop forwards to native <textarea rows="X">', () => {
    const wrapper = mount(Textarea, { props: { rows: 6 } })
    expect(wrapper.find('textarea').attributes('rows')).toBe('6')
  })

  it('autoResize: true wires useTextareaAutosize — style.height is set after content change', async () => {
    const wrapper = mount(Textarea, {
      props: { autoResize: true },
      attachTo: document.body,
    })
    const el = wrapper.find('textarea').element as HTMLTextAreaElement
    Object.defineProperty(el, 'scrollHeight', { value: 80, configurable: true })
    await wrapper.setProps({ modelValue: 'line1\nline2\nline3' })
    await nextTick()
    expect(el.style.height).not.toBe('')
    wrapper.unmount()
  })

  it('autoResize: false (default) — style.height remains empty after content change', async () => {
    const wrapper = mount(Textarea, {
      props: { autoResize: false },
      attachTo: document.body,
    })
    const el = wrapper.find('textarea').element as HTMLTextAreaElement
    await wrapper.setProps({ modelValue: 'line1\nline2\nline3' })
    await nextTick()
    expect(el.style.height).toBe('')
    wrapper.unmount()
  })

  it('passing class="custom" merges with base classes on the wrapper', () => {
    const wrapper = mount(Textarea, { props: { class: 'custom-class' } })
    expect(wrapper.classes()).toContain('textarea-root')
    expect(wrapper.classes()).toContain('custom-class')
  })

  it('fullWidth: true applies textarea--full-width on the field', () => {
    const wrapper = mount(Textarea, { props: { fullWidth: true } })
    expect(wrapper.find('.textarea').classes()).toContain('textarea--full-width')
  })

  it('applies all four variants', () => {
    const variants = ['flat', 'bordered', 'faded', 'underlined'] as const
    for (const variant of variants) {
      const wrapper = mount(Textarea, { props: { variant } })
      expect(wrapper.find('.textarea').classes()).toContain(`textarea--${variant}`)
    }
  })

  it('applies sm and lg size classes', () => {
    const smWrapper = mount(Textarea, { props: { size: 'sm' } })
    expect(smWrapper.find('.textarea').classes()).toContain('textarea--sm')
    const lgWrapper = mount(Textarea, { props: { size: 'lg' } })
    expect(lgWrapper.find('.textarea').classes()).toContain('textarea--lg')
  })

  it('applies all color variants', () => {
    const colors = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'] as const
    for (const color of colors) {
      const wrapper = mount(Textarea, { props: { color } })
      expect(wrapper.find('.textarea').classes()).toContain(`textarea--${color}`)
    }
  })

  it('forwards placeholder attribute to native textarea', () => {
    const wrapper = mount(Textarea, { props: { placeholder: 'Enter text here' } })
    expect(wrapper.find('textarea').attributes('placeholder')).toBe('Enter text here')
  })

  it('forwards name attribute to native textarea', () => {
    const wrapper = mount(Textarea, { props: { name: 'description' } })
    expect(wrapper.find('textarea').attributes('name')).toBe('description')
  })

  it('fallthrough aria-label binds to inner <textarea> (not wrapper) via inheritAttrs:false', () => {
    const wrapper = mount(Textarea, { attrs: { 'aria-label': 'Notes' } })
    expect(wrapper.find('textarea').attributes('aria-label')).toBe('Notes')
    expect(wrapper.attributes('aria-label')).toBeUndefined()
  })

  // ─── Label support ─────────────────────────────────────────────────────
  it('no label prop → no <label> in DOM and no label-inside class on field', () => {
    const wrapper = mount(Textarea)
    expect(wrapper.find('label').exists()).toBe(false)
    expect(wrapper.find('.textarea').classes()).not.toContain('textarea--label-inside')
  })

  it('label="Name" → renders <label> with text and applies textarea--label-inside', () => {
    const wrapper = mount(Textarea, { props: { label: 'Name' } })
    const lbl = wrapper.find('label')
    expect(lbl.exists()).toBe(true)
    expect(lbl.text()).toBe('Name')
    expect(wrapper.find('.textarea').classes()).toContain('textarea--label-inside')
  })

  it('label set but modelValue empty → data-filled is NOT present on field', () => {
    const wrapper = mount(Textarea, { props: { label: 'Name', modelValue: '' } })
    expect(wrapper.find('.textarea').attributes('data-filled')).toBeUndefined()
  })

  it('label set and modelValue non-empty → data-filled="true" on field', () => {
    const wrapper = mount(Textarea, { props: { label: 'Name', modelValue: 'Jane' } })
    expect(wrapper.find('.textarea').attributes('data-filled')).toBe('true')
  })

  it('<label for> matches <textarea id> (generated via useId)', () => {
    const wrapper = mount(Textarea, { props: { label: 'Name' } })
    const forAttr = wrapper.find('label').attributes('for')
    const idAttr = wrapper.find('textarea').attributes('id')
    expect(forAttr).toBeTruthy()
    expect(idAttr).toBeTruthy()
    expect(forAttr).toBe(idAttr)
  })

  it('explicit id via fallthrough is honored by both <label for> and <textarea id>', () => {
    const wrapper = mount(Textarea, {
      props: { label: 'Name' },
      attrs: { id: 'custom-id' },
    })
    expect(wrapper.find('textarea').attributes('id')).toBe('custom-id')
    expect(wrapper.find('label').attributes('for')).toBe('custom-id')
  })

  // ─── Slots ─────────────────────────────────────────────────────────────
  it('does NOT render start/end content spans when slots are empty', () => {
    const wrapper = mount(Textarea)
    expect(wrapper.find('.textarea__start-content').exists()).toBe(false)
    expect(wrapper.find('.textarea__end-content').exists()).toBe(false)
  })

  it('renders startContent slot inside a .textarea__start-content span', () => {
    const wrapper = mount(Textarea, {
      slots: { startContent: '<svg data-testid="start-icon" />' },
    })
    const startSpan = wrapper.find('.textarea__start-content')
    expect(startSpan.exists()).toBe(true)
    expect(startSpan.find('[data-testid="start-icon"]').exists()).toBe(true)
  })

  it('renders endContent slot inside a .textarea__end-content span', () => {
    const wrapper = mount(Textarea, {
      slots: { endContent: '<svg data-testid="end-icon" />' },
    })
    const endSpan = wrapper.find('.textarea__end-content')
    expect(endSpan.exists()).toBe(true)
    expect(endSpan.find('[data-testid="end-icon"]').exists()).toBe(true)
  })

  // ─── Clear button ──────────────────────────────────────────────────────
  it('isClearable + non-empty value → renders clear button', () => {
    const wrapper = mount(Textarea, { props: { isClearable: true, modelValue: 'x' } })
    expect(wrapper.find('.textarea__clear-button').exists()).toBe(true)
  })

  it('isClearable + empty value → no clear button', () => {
    const wrapper = mount(Textarea, { props: { isClearable: true, modelValue: '' } })
    expect(wrapper.find('.textarea__clear-button').exists()).toBe(false)
  })

  it('clicking clear button empties v-model and emits @clear', async () => {
    let value = 'hello'
    const wrapper = mount(Textarea, {
      props: {
        isClearable: true,
        modelValue: value,
        'onUpdate:modelValue': (v: string) => { value = v },
      },
    })
    await wrapper.find('.textarea__clear-button').trigger('click')
    expect(value).toBe('')
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  // ─── Helper text ───────────────────────────────────────────────────────
  it('description renders in helper wrapper with matching aria-describedby', () => {
    const wrapper = mount(Textarea, { props: { description: 'Hint' } })
    const helper = wrapper.find('.textarea__description')
    expect(helper.exists()).toBe(true)
    expect(helper.text()).toBe('Hint')
    expect(wrapper.find('textarea').attributes('aria-describedby')).toBe(helper.attributes('id'))
  })

  it('errorMessage renders only when isInvalid=true and takes precedence over description', () => {
    const wrapper = mount(Textarea, {
      props: { isInvalid: true, description: 'Hint', errorMessage: 'Bad' },
    })
    expect(wrapper.find('.textarea__error-message').exists()).toBe(true)
    expect(wrapper.find('.textarea__description').exists()).toBe(false)
  })

  it('errorMessage without isInvalid is NOT rendered', () => {
    const wrapper = mount(Textarea, { props: { errorMessage: 'Bad' } })
    expect(wrapper.find('.textarea__error-message').exists()).toBe(false)
  })
})
