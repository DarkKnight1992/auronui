import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import Checkbox from '../Checkbox.vue'
import Switch from '../../switch/Switch.vue'
import NumberField from '../../number-field/NumberField.vue'

// errorMessage used to be undeclared on these controls, so binding it (as a
// form wrapper naturally does) leaked a stray `errormessage="…"` attribute
// onto the DOM and the message itself was never shown.

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.forEach(w => w.unmount()); wrappers.length = 0 })
const m = (c: any, props: Record<string, unknown>, slot?: string) => {
  const w = mount(c, { props, slots: slot ? { default: slot } : undefined, attachTo: document.body })
  wrappers.push(w)
  return w
}

describe.each([
  ['Checkbox', Checkbox, 'button[role="checkbox"]'],
  ['Switch', Switch, 'button[role="switch"]'],
] as const)('%s errorMessage', (_name, Comp, controlSel) => {
  it('renders the message when invalid and links it with aria-describedby', () => {
    const w = m(Comp, { isInvalid: true, errorMessage: 'You must accept' }, 'Accept terms')
    const msg = w.find('[data-slot="error-message"]')
    expect(msg.exists()).toBe(true)
    expect(msg.text()).toBe('You must accept')
    const control = w.find(controlSel)
    expect(control.attributes('aria-describedby')).toContain(msg.attributes('id'))
  })

  it('does not leak an errormessage attribute', () => {
    const w = m(Comp, { isInvalid: true, errorMessage: 'Nope' }, 'Label')
    expect(w.html()).not.toMatch(/errormessage=/i)
  })

  it('hides the message while valid', () => {
    const w = m(Comp, { isInvalid: false, errorMessage: 'Nope' }, 'Label')
    expect(w.find('[data-slot="error-message"]').exists()).toBe(false)
  })

  it('keeps the error text out of the accessible name and passes axe', async () => {
    const w = m(Comp, { isInvalid: true, errorMessage: 'You must accept' }, 'Accept terms')
    const results = await axe.run(w.element as HTMLElement)
    expect(results.violations).toEqual([])
  })
})

describe('NumberField description / errorMessage', () => {
  it('renders the description and links it to the input', () => {
    const w = m(NumberField, { label: 'Seats', description: 'Max 10' })
    const desc = w.find('[data-slot="description"]')
    expect(desc.text()).toBe('Max 10')
    expect(w.find('input').attributes('aria-describedby')).toContain(desc.attributes('id'))
  })

  it('shows the error instead of the description when invalid', () => {
    const w = m(NumberField, { label: 'Seats', description: 'Max 10', isInvalid: true, errorMessage: 'Too many' })
    expect(w.find('[data-slot="description"]').exists()).toBe(false)
    const err = w.find('[data-slot="error-message"]')
    expect(err.text()).toBe('Too many')
    expect(w.find('input').attributes('aria-describedby')).toContain(err.attributes('id'))
    expect(w.html()).not.toMatch(/errormessage=/i)
  })

  it('passes axe with an error shown', async () => {
    const w = m(NumberField, { label: 'Seats', isInvalid: true, errorMessage: 'Too many' })
    const results = await axe.run(w.element as HTMLElement)
    expect(results.violations).toEqual([])
  })
})
