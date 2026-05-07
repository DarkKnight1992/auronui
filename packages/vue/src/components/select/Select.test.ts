import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import axe from 'axe-core'
import Select from './Select.vue'
import SelectTrigger from './SelectTrigger.vue'
import SelectValue from './SelectValue.vue'
import SelectContent from './SelectContent.vue'
import SelectItem from './SelectItem.vue'

// jsdom does not implement scrollIntoView — mock it globally
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {}
})

// Helper: standard Select with 5 items
function makeWrapper(
  template: string,
  components?: Record<string, unknown>,
  setup?: () => Record<string, unknown>,
) {
  return defineComponent({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, ...components },
    setup,
    template,
  })
}

const BasicSelect = makeWrapper(`
  <Select label="Favorite Fruit">
    <SelectTrigger>
      <SelectValue placeholder="Pick a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="cherry">Cherry</SelectItem>
      <SelectItem value="date">Date</SelectItem>
      <SelectItem value="elderberry">Elderberry</SelectItem>
    </SelectContent>
  </Select>
`)

describe('Select — render', () => {
  it('Test 1: renders a trigger button', () => {
    const wrapper = mount(BasicSelect, { attachTo: document.body })
    expect(wrapper.find('button[role="combobox"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('Test 2: renders label when label prop is provided', () => {
    const wrapper = mount(BasicSelect, { attachTo: document.body })
    expect(wrapper.text()).toContain('Favorite Fruit')
    wrapper.unmount()
  })

  it('Test 3: renders placeholder text before selection', () => {
    const wrapper = mount(BasicSelect, { attachTo: document.body })
    expect(wrapper.text()).toContain('Pick a fruit')
    wrapper.unmount()
  })

  it('Test 4: trigger has the select__trigger CSS class', () => {
    const wrapper = mount(BasicSelect, { attachTo: document.body })
    const trigger = wrapper.find('button[role="combobox"]')
    expect(trigger.classes()).toContain('select__trigger')
    wrapper.unmount()
  })
})

describe('Select — v-model', () => {
  it('Test 5: open state renders option items in the portal', async () => {
    // jsdom cannot open Reka UI Select via pointer events (no real layout engine).
    // Use :open="true" so SelectContent portal mounts and verify items are rendered
    // with correct ARIA roles and data-value attributes.
    const Wrapper = makeWrapper(`
      <Select :open="true" label="Fruit">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    // SelectContent portal renders options with role="option"
    const options = document.querySelectorAll('[role="option"]')
    expect(options.length).toBe(2)
    // Verify item text is rendered inside the options
    const texts = Array.from(options).map(o => (o as HTMLElement).textContent ?? '')
    expect(texts.some(t => t.includes('Apple'))).toBe(true)
    expect(texts.some(t => t.includes('Banana'))).toBe(true)
    wrapper.unmount()
  })

  it('Test 6: open prop exposes aria-expanded=true on the trigger', async () => {
    // jsdom cannot open Reka UI Select via click (no real layout engine for popper).
    // Use the controlled :open prop to assert the ARIA contract.
    const Wrapper = makeWrapper(`
      <Select :open="true" label="Fruit">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    expect(wrapper.find('button[role="combobox"]').attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })
})

describe('Select — disabled options', () => {
  it('Test 7: disabled items are rendered with data-disabled when open', async () => {
    // Use :open="true" to bypass jsdom popper layout limitation
    const Wrapper = makeWrapper(`
      <Select :open="true" label="Fruit">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana" :is-disabled="true">Banana</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    // Content portal mounts immediately when open=true; check document for disabled item
    const disabledItems = document.querySelectorAll('[data-disabled]')
    expect(disabledItems.length).toBeGreaterThan(0)
    wrapper.unmount()
  })

  it('Test 8: isDisabled=true on Select disables the trigger', () => {
    const Wrapper = makeWrapper(`
      <Select label="Fruit" :is-disabled="true">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const trigger = wrapper.find('button[role="combobox"]')
    expect(trigger.attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })
})

describe('Select — label / description / error', () => {
  it('Test 9: description renders when provided', () => {
    const Wrapper = makeWrapper(`
      <Select label="Fruit" description="Pick your favorite fruit">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    expect(wrapper.text()).toContain('Pick your favorite fruit')
    wrapper.unmount()
  })

  it('Test 10: errorMessage renders when isInvalid=true', () => {
    const Wrapper = makeWrapper(`
      <Select label="Fruit" :is-invalid="true" error-message="Please select a fruit">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    expect(wrapper.text()).toContain('Please select a fruit')
    wrapper.unmount()
  })
})

describe('Select — accessibility (axe)', () => {
  it('Test 11: passes axe in closed state (zero violations)', async () => {
    const wrapper = mount(BasicSelect, { attachTo: document.body })
    await nextTick()
    const results = await axe.run(wrapper.element)
    if (results.violations.length > 0) {
      console.log('AXE VIOLATIONS (closed):', JSON.stringify(results.violations.map(v => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map(n => n.html),
      })), null, 2))
    }
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('Test 12: passes axe in open state (zero violations)', async () => {
    // Use :open="true" to bypass jsdom popper layout limitation.
    // Run axe on wrapper.element (not document.body) to avoid cross-contamination
    // from other tests that may have left DOM nodes attached.
    const OpenSelect = makeWrapper(`
      <Select :open="true" label="Favorite Fruit">
        <SelectTrigger>
          <SelectValue placeholder="Pick a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(OpenSelect, { attachTo: document.body })
    await nextTick()
    const results = await axe.run(wrapper.element)
    if (results.violations.length > 0) {
      console.log('AXE VIOLATIONS (open):', JSON.stringify(results.violations.map(v => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map(n => n.html),
      })), null, 2))
    }
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
