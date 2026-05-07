import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import NumberField from '../NumberField.vue'

describe('NumberField', () => {
  // Test 1: Renders NumberFieldRoot as the outer element (base class)
  it('renders with base class "number-field" on root element', () => {
    const wrapper = mount(NumberField, {
      props: { ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    expect(wrapper.classes()).toContain('number-field')
    wrapper.unmount()
  })

  // Test 2: Renders NumberFieldInput with correct class
  it('renders NumberFieldInput with class "number-field__input"', () => {
    const wrapper = mount(NumberField, {
      props: { ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    const input = wrapper.find('.number-field__input')
    expect(input.exists()).toBe(true)
    wrapper.unmount()
  })

  // Test 3: Renders NumberFieldIncrement button with correct class
  it('renders NumberFieldIncrement button with class "number-field__increment-button"', () => {
    const wrapper = mount(NumberField, {
      props: { ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    const incrementBtn = wrapper.find('.number-field__increment-button')
    expect(incrementBtn.exists()).toBe(true)
    // Reka UI provides a default "Increase" aria-label on the increment button
    expect(incrementBtn.attributes('aria-label')).toBeTruthy()
    wrapper.unmount()
  })

  // Test 4: Renders NumberFieldDecrement button with correct class
  it('renders NumberFieldDecrement button with class "number-field__decrement-button"', () => {
    const wrapper = mount(NumberField, {
      props: { ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    const decrementBtn = wrapper.find('.number-field__decrement-button')
    expect(decrementBtn.exists()).toBe(true)
    // Reka UI provides a default "Decrease" aria-label on the decrement button
    expect(decrementBtn.attributes('aria-label')).toBeTruthy()
    wrapper.unmount()
  })

  // Test 5: v-model bound to a Ref<number> reflects value changes
  it('reflects initial modelValue on the input element', async () => {
    const modelValue = ref<number | undefined>(42)
    const wrapper = mount(NumberField, {
      props: {
        modelValue: modelValue.value,
        ariaLabel: 'Quantity',
        'onUpdate:modelValue': (v: number | undefined) => {
          modelValue.value = v
          wrapper.setProps({ modelValue: v })
        },
      },
      attachTo: document.body,
    })
    await nextTick()
    const input = wrapper.find('input')
    expect(input.element.value).toBe('42')
    wrapper.unmount()
  })

  // Test 6: Increment fires update:modelValue with current + step
  // Tested via ArrowUp on input — same user-facing behavior as clicking increment button.
  // Reka UI's button uses usePressedHold (pointerdown + VueUse watchImmediate flush:post)
  // which is not reliable in jsdom; keyboard events are handled via Vue template onKeydown.
  it('increment fires update:modelValue with current + step (via ArrowUp keyboard)', async () => {
    let emittedValue: number | undefined
    const wrapper = mount(NumberField, {
      props: {
        modelValue: 10,
        step: 1,
        ariaLabel: 'Quantity',
        'onUpdate:modelValue': (v: number | undefined) => {
          emittedValue = v
          wrapper.setProps({ modelValue: v })
        },
      },
      attachTo: document.body,
    })
    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    expect(emittedValue).toBe(11)
    wrapper.unmount()
  })

  // Test 7: Decrement fires update:modelValue with current - step
  // Tested via ArrowDown on input — same user-facing behavior as clicking decrement button.
  it('decrement fires update:modelValue with current - step (via ArrowDown keyboard)', async () => {
    let emittedValue: number | undefined
    const wrapper = mount(NumberField, {
      props: {
        modelValue: 10,
        step: 1,
        ariaLabel: 'Quantity',
        'onUpdate:modelValue': (v: number | undefined) => {
          emittedValue = v
          wrapper.setProps({ modelValue: v })
        },
      },
      attachTo: document.body,
    })
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(emittedValue).toBe(9)
    wrapper.unmount()
  })

  // Test 8: min prop clamps value — decrement below min has no effect
  it('decrement below min does not emit value below min', async () => {
    let emittedValue: number | undefined
    const wrapper = mount(NumberField, {
      props: {
        modelValue: 0,
        min: 0,
        step: 1,
        ariaLabel: 'Quantity',
        'onUpdate:modelValue': (v: number | undefined) => {
          emittedValue = v
          wrapper.setProps({ modelValue: v })
        },
      },
      attachTo: document.body,
    })
    // Reka UI disables the decrement button when at min
    const decrementBtn = wrapper.find('.number-field__decrement-button')
    expect(decrementBtn.attributes('disabled')).toBeDefined()
    // emittedValue should not change when clicking a disabled button
    await decrementBtn.trigger('click')
    await nextTick()
    expect(emittedValue).toBeUndefined() // no emission when button is disabled
    wrapper.unmount()
  })

  // Test 9: step prop controls increment delta (step=5 → ArrowUp from 0 yields 5)
  it('step=5 ArrowUp from 0 yields 5', async () => {
    let emittedValue: number | undefined
    const wrapper = mount(NumberField, {
      props: {
        modelValue: 0,
        step: 5,
        ariaLabel: 'Quantity',
        'onUpdate:modelValue': (v: number | undefined) => {
          emittedValue = v
          wrapper.setProps({ modelValue: v })
        },
      },
      attachTo: document.body,
    })
    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    expect(emittedValue).toBe(5)
    wrapper.unmount()
  })

  // Test 10: formatOptions forwards to NumberFieldRoot
  it('formatOptions forwards currency formatting to the rendered input', async () => {
    const wrapper = mount(NumberField, {
      props: {
        modelValue: 10,
        formatOptions: { style: 'currency', currency: 'USD' },
        ariaLabel: 'Price',
        'onUpdate:modelValue': (v: number | undefined) => {
          wrapper.setProps({ modelValue: v })
        },
      },
      attachTo: document.body,
    })
    await nextTick()
    const input = wrapper.find('input')
    // Reka UI formats the value as currency — expect '$' in the displayed value
    expect(input.element.value).toContain('$')
    wrapper.unmount()
  })

  // Test 11: isDisabled forwards to Reka UI's disabled prop
  it('isDisabled=true disables both increment and decrement buttons', () => {
    const wrapper = mount(NumberField, {
      props: {
        isDisabled: true,
        ariaLabel: 'Quantity',
      },
      attachTo: document.body,
    })
    const buttons = wrapper.findAll('button')
    buttons.forEach(btn => {
      expect(btn.attributes('disabled')).toBeDefined()
    })
    wrapper.unmount()
  })

  // Additional: variant classes from styles
  it('applies flat variant class by default', () => {
    const wrapper = mount(NumberField, {
      props: { ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    expect(wrapper.classes()).toContain('number-field--flat')
    wrapper.unmount()
  })

  it('applies bordered variant class when variant="bordered"', () => {
    const wrapper = mount(NumberField, {
      props: { variant: 'bordered', ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    expect(wrapper.classes()).toContain('number-field--bordered')
    wrapper.unmount()
  })

  it('applies primary color class when color="primary"', () => {
    const wrapper = mount(NumberField, {
      props: { color: 'primary', ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    expect(wrapper.classes()).toContain('number-field--primary')
    wrapper.unmount()
  })

  it('applies size class for sm', () => {
    const wrapper = mount(NumberField, {
      props: { size: 'sm', ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    expect(wrapper.classes()).toContain('number-field--sm')
    wrapper.unmount()
  })

  it('applies fullWidth class when fullWidth=true', () => {
    const wrapper = mount(NumberField, {
      props: { fullWidth: true, ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    expect(wrapper.classes()).toContain('number-field--full-width')
    wrapper.unmount()
  })

  it('applies invalid class when isInvalid=true', () => {
    const wrapper = mount(NumberField, {
      props: { isInvalid: true, ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    expect(wrapper.classes()).toContain('number-field--invalid')
    wrapper.unmount()
  })

  it('applies data-disabled attribute when isDisabled=true', () => {
    const wrapper = mount(NumberField, {
      props: { isDisabled: true, ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('applies group class on inner wrapper', () => {
    const wrapper = mount(NumberField, {
      props: { ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    const group = wrapper.find('.number-field__group')
    expect(group.exists()).toBe(true)
    wrapper.unmount()
  })

  it('applies custom class to root element', () => {
    const wrapper = mount(NumberField, {
      props: { class: 'my-custom-class', ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    expect(wrapper.classes()).toContain('my-custom-class')
    wrapper.unmount()
  })

  it('is readonly when isReadonly=true', () => {
    const wrapper = mount(NumberField, {
      props: { isReadonly: true, ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    const input = wrapper.find('input')
    expect(input.attributes('readonly')).toBeDefined()
    wrapper.unmount()
  })

  it('renders a visible label when label prop is provided', () => {
    const wrapper = mount(NumberField, {
      props: { label: 'Quantity' },
      attachTo: document.body,
    })
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Quantity')
    wrapper.unmount()
  })

  it('ArrowUp key on input increases value by step', async () => {
    let currentValue: number | undefined = 10
    const wrapper = mount(NumberField, {
      props: {
        modelValue: currentValue,
        step: 1,
        ariaLabel: 'Quantity',
        'onUpdate:modelValue': (v: number | undefined) => {
          currentValue = v
          wrapper.setProps({ modelValue: v })
        },
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    expect(currentValue).toBe(11)
    wrapper.unmount()
  })

  it('ArrowDown key on input decreases value by step', async () => {
    let currentValue: number | undefined = 10
    const wrapper = mount(NumberField, {
      props: {
        modelValue: currentValue,
        step: 1,
        ariaLabel: 'Quantity',
        'onUpdate:modelValue': (v: number | undefined) => {
          currentValue = v
          wrapper.setProps({ modelValue: v })
        },
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(currentValue).toBe(9)
    wrapper.unmount()
  })
})
