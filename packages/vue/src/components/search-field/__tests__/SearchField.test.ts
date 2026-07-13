import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchField from '../SearchField.vue'

describe('SearchField', () => {
  it('renders wrapper <div> containing a native <input type="search">', () => {
    const wrapper = mount(SearchField)
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('search')
  })

  it('renders the built-in search icon in startContent by default', () => {
    const wrapper = mount(SearchField)
    const start = wrapper.find('.input__start-content')
    expect(start.exists()).toBe(true)
    expect(start.find('svg').exists()).toBe(true)
  })

  it('startContent slot overrides the default search icon', () => {
    const wrapper = mount(SearchField, {
      slots: { startContent: '<svg data-testid="custom-icon" />' },
    })
    expect(wrapper.find('[data-testid="custom-icon"]').exists()).toBe(true)
  })

  it('v-model binds two-way — modelValue updates input.value, typing updates ref', async () => {
    let value = 'initial'
    const wrapper = mount(SearchField, {
      props: {
        modelValue: value,
        'onUpdate:modelValue': (v: string) => { value = v },
      },
    })
    const inputEl = wrapper.find('input')
    expect((inputEl.element as HTMLInputElement).value).toBe('initial')
    await inputEl.setValue('vue')
    expect(value).toBe('vue')
  })

  it('isClearable defaults to true — clear button appears once filled', async () => {
    const wrapper = mount(SearchField, { props: { modelValue: 'query' } })
    expect(wrapper.find('button[aria-label="Clear search"]').exists()).toBe(true)
  })

  it('clear button is absent when the value is empty', () => {
    const wrapper = mount(SearchField, { props: { modelValue: '' } })
    expect(wrapper.find('button[aria-label="Clear search"]').exists()).toBe(false)
  })

  it('isClearable: false suppresses the clear button even when filled', () => {
    const wrapper = mount(SearchField, { props: { modelValue: 'query', isClearable: false } })
    expect(wrapper.find('button[aria-label="Clear search"]').exists()).toBe(false)
  })

  it('clicking the clear button empties the value and emits clear', async () => {
    let value = 'query'
    const wrapper = mount(SearchField, {
      props: {
        modelValue: value,
        'onUpdate:modelValue': (v: string) => { value = v },
      },
      attachTo: document.body,
    })
    await wrapper.find('button[aria-label="Clear search"]').trigger('click')
    expect(value).toBe('')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    wrapper.unmount()
  })

  it('pressing Escape while filled clears the value and emits clear', async () => {
    let value = 'query'
    const wrapper = mount(SearchField, {
      props: {
        modelValue: value,
        'onUpdate:modelValue': (v: string) => { value = v },
      },
      attachTo: document.body,
    })
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    expect(value).toBe('')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    wrapper.unmount()
  })

  it('pressing Escape while empty does not emit clear', async () => {
    const wrapper = mount(SearchField, { props: { modelValue: '' } })
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('clear')).toBeUndefined()
  })

  it('isInvalid: true sets data-invalid on wrapper AND aria-invalid on input', () => {
    const wrapper = mount(SearchField, { props: { isInvalid: true } })
    expect(wrapper.attributes('data-invalid')).toBeTruthy()
    expect(wrapper.find('input').attributes('aria-invalid')).toBeTruthy()
  })

  it('isDisabled: true sets data-disabled on wrapper AND native disabled on input, hides clear button', () => {
    const wrapper = mount(SearchField, { props: { isDisabled: true, modelValue: 'query' } })
    expect(wrapper.attributes('data-disabled')).toBeTruthy()
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button[aria-label="Clear search"]').exists()).toBe(false)
  })

  it('isReadOnly: true sets data-readonly on wrapper AND native readonly on input, hides clear button', () => {
    const wrapper = mount(SearchField, { props: { isReadOnly: true, modelValue: 'query' } })
    expect(wrapper.attributes('data-readonly')).toBeTruthy()
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
    expect(wrapper.find('button[aria-label="Clear search"]').exists()).toBe(false)
  })

  it('label="Search" renders a <label> matching the input via useId', () => {
    const wrapper = mount(SearchField, { props: { label: 'Search' } })
    const lbl = wrapper.find('label')
    expect(lbl.exists()).toBe(true)
    expect(lbl.text()).toContain('Search')
    expect(lbl.attributes('for')).toBe(wrapper.find('input').attributes('id'))
  })

  it('isRequired: true sets data-required on wrapper and required on input', () => {
    const wrapper = mount(SearchField, { props: { isRequired: true } })
    expect(wrapper.attributes('data-required')).toBeTruthy()
    expect(wrapper.find('input').attributes('required')).toBeDefined()
  })

  it('forwards placeholder and name attributes to native input element', () => {
    const wrapper = mount(SearchField, { props: { placeholder: 'Search components…', name: 'q' } })
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Search components…')
    expect(input.attributes('name')).toBe('q')
  })

  it('aria-describedby (error case) points at an element that exists in the DOM and contains the error text', () => {
    const wrapper = mount(SearchField, { props: { errorMessage: 'Search failed', isInvalid: true } })
    const describedBy = wrapper.find('input').attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    const target = wrapper.find(`#${describedBy}`)
    expect(target.exists()).toBe(true)
    expect(target.text()).toBe('Search failed')
  })
})
