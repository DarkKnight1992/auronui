import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from '../Input.vue'

describe('Input', () => {
  it('renders wrapper <div> containing a native <input>', () => {
    const wrapper = mount(Input)
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('applies base input class with default variant/size/color', () => {
    const wrapper = mount(Input)
    const iw = wrapper.find('.input')
    expect(iw.exists()).toBe(true)
    expect(iw.classes()).toContain('input--flat')
    expect(iw.classes()).toContain('input--default')
    expect(iw.classes()).not.toContain('input--md')
  })

  it('applies bordered variant + lg size + primary color classes', () => {
    const wrapper = mount(Input, { props: { variant: 'bordered', size: 'lg', color: 'primary' } })
    const iw = wrapper.find('.input')
    expect(iw.classes()).toContain('input--bordered')
    expect(iw.classes()).toContain('input--lg')
    expect(iw.classes()).toContain('input--primary')
  })

  it('v-model binds two-way — modelValue updates input.value, typing updates ref', async () => {
    let value = 'initial'
    const wrapper = mount(Input, {
      props: {
        modelValue: value,
        'onUpdate:modelValue': (v: string | number | null) => { value = String(v ?? '') },
      },
    })
    const inputEl = wrapper.find('input')
    expect((inputEl.element as HTMLInputElement).value).toBe('initial')
    await inputEl.setValue('changed')
    expect(value).toBe('changed')
  })

  it('isInvalid: true sets data-invalid on wrapper AND aria-invalid on input', () => {
    const wrapper = mount(Input, { props: { isInvalid: true } })
    expect(wrapper.attributes('data-invalid')).toBeTruthy()
    expect(wrapper.find('input').attributes('aria-invalid')).toBeTruthy()
  })

  it('isInvalid: false — neither data-invalid on wrapper nor aria-invalid on input', () => {
    const wrapper = mount(Input, { props: { isInvalid: false } })
    expect(wrapper.attributes('data-invalid')).toBeUndefined()
    expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined()
  })

  it('isDisabled: true sets data-disabled on wrapper AND native disabled on input', () => {
    const wrapper = mount(Input, { props: { isDisabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeTruthy()
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('isDisabled: false — neither data-disabled on wrapper nor disabled on input', () => {
    const wrapper = mount(Input, { props: { isDisabled: false } })
    expect(wrapper.attributes('data-disabled')).toBeUndefined()
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
  })

  it('isReadonly: true sets data-readonly on wrapper AND native readonly on input', () => {
    const wrapper = mount(Input, { props: { isReadonly: true } })
    expect(wrapper.attributes('data-readonly')).toBeTruthy()
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('isReadonly: false — neither data-readonly on wrapper nor readonly on input', () => {
    const wrapper = mount(Input, { props: { isReadonly: false } })
    expect(wrapper.attributes('data-readonly')).toBeUndefined()
    expect(wrapper.find('input').attributes('readonly')).toBeUndefined()
  })

  it('passing class="custom" merges with base classes on the wrapper', () => {
    const wrapper = mount(Input, { props: { class: 'custom-class' } })
    expect(wrapper.classes()).toContain('custom-class')
    expect(wrapper.find('.input').exists()).toBe(true)
  })

  it('fullWidth: true applies input--full-width class on inputWrapper', () => {
    const wrapper = mount(Input, { props: { fullWidth: true } })
    expect(wrapper.find('.input').classes()).toContain('input--full-width')
  })

  it('applies sm size class', () => {
    const wrapper = mount(Input, { props: { size: 'sm' } })
    expect(wrapper.find('.input').classes()).toContain('input--sm')
  })

  it('applies lg size class', () => {
    const wrapper = mount(Input, { props: { size: 'lg' } })
    expect(wrapper.find('.input').classes()).toContain('input--lg')
  })

  it('applies all color variants', () => {
    const colors = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'] as const
    for (const color of colors) {
      const wrapper = mount(Input, { props: { color } })
      expect(wrapper.find('.input').classes()).toContain(`input--${color}`)
    }
  })

  it('forwards type attribute to native input element', () => {
    const wrapper = mount(Input, { props: { type: 'email' } })
    expect(wrapper.find('input').attributes('type')).toBe('email')
  })

  it('forwards placeholder attribute to native input element', () => {
    const wrapper = mount(Input, { props: { placeholder: 'Enter email' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter email')
  })

  it('forwards name attribute to native input element', () => {
    const wrapper = mount(Input, { props: { name: 'user-email' } })
    expect(wrapper.find('input').attributes('name')).toBe('user-email')
  })

  it('does NOT render start/end content spans when slots are empty', () => {
    const wrapper = mount(Input)
    expect(wrapper.find('.input__start-content').exists()).toBe(false)
    expect(wrapper.find('.input__end-content').exists()).toBe(false)
  })

  it('renders startContent slot inside a .input__start-content span', () => {
    const wrapper = mount(Input, {
      slots: { startContent: '<svg data-testid="start-icon" />' },
    })
    const startSpan = wrapper.find('.input__start-content')
    expect(startSpan.exists()).toBe(true)
    expect(startSpan.find('[data-testid="start-icon"]').exists()).toBe(true)
  })

  it('renders endContent slot inside a .input__end-content span', () => {
    const wrapper = mount(Input, {
      slots: { endContent: '<svg data-testid="end-icon" />' },
    })
    const endSpan = wrapper.find('.input__end-content')
    expect(endSpan.exists()).toBe(true)
    expect(endSpan.find('[data-testid="end-icon"]').exists()).toBe(true)
  })

  it('renders both slots with start before end inside inputWrapper', () => {
    const wrapper = mount(Input, {
      slots: {
        startContent: '<svg data-testid="start-icon" />',
        endContent: '<svg data-testid="end-icon" />',
      },
    })
    const iw = wrapper.find('.input')
    expect(iw.find('.input__start-content').exists()).toBe(true)
    expect(iw.find('.input__end-content').exists()).toBe(true)
    const children = Array.from(iw.element.children)
    const startIdx = children.findIndex(c => c.classList.contains('input__start-content'))
    const endIdx = children.findIndex(c => c.classList.contains('input__end-content'))
    expect(startIdx).toBeLessThan(endIdx)
  })

  it('fallthrough aria-label binds to inner <input> (not the wrapper) via inheritAttrs:false', () => {
    const wrapper = mount(Input, { attrs: { 'aria-label': 'Search' } })
    expect(wrapper.find('input').attributes('aria-label')).toBe('Search')
    expect(wrapper.attributes('aria-label')).toBeUndefined()
  })

  it('no label prop → no <label> in DOM', () => {
    const wrapper = mount(Input)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('label="Name" → renders <label> with text', () => {
    const wrapper = mount(Input, { props: { label: 'Name' } })
    const lbl = wrapper.find('label')
    expect(lbl.exists()).toBe(true)
    expect(lbl.text()).toBe('Name')
  })

  it('label set but modelValue empty → data-filled is NOT present on inputWrapper', () => {
    const wrapper = mount(Input, { props: { label: 'Name', modelValue: '' } })
    expect(wrapper.find('.input').attributes('data-filled')).toBeUndefined()
  })

  it('label set and modelValue non-empty → data-filled="true" on inputWrapper', () => {
    const wrapper = mount(Input, { props: { label: 'Name', modelValue: 'Jane' } })
    expect(wrapper.find('.input').attributes('data-filled')).toBe('true')
  })

  it('<label for> matches <input id> (generated via useId)', () => {
    const wrapper = mount(Input, { props: { label: 'Name' } })
    const forAttr = wrapper.find('label').attributes('for')
    const idAttr = wrapper.find('input').attributes('id')
    expect(forAttr).toBeTruthy()
    expect(idAttr).toBeTruthy()
    expect(forAttr).toBe(idAttr)
  })

  it('explicit id via fallthrough is honored by both <label for> and <input id>', () => {
    const wrapper = mount(Input, {
      props: { label: 'Name' },
      attrs: { id: 'custom-id' },
    })
    expect(wrapper.find('input').attributes('id')).toBe('custom-id')
    expect(wrapper.find('label').attributes('for')).toBe('custom-id')
  })
})
