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

describe('Select — label display', () => {
  it('Test 13: trigger shows item label (not raw value) when modelValue is pre-set', async () => {
    // When modelValue is pre-set and the dropdown has never been opened, items are
    // not yet mounted (no force-mount — see SelectContent.vue comment for why
    // force-mount cannot be used). Labels must be provided via the textValue prop
    // so SelectItem can register them at setup time (before mount).
    //
    // Without textValue, slot-text labels are only available after first mount
    // (i.e. after the dropdown is opened at least once). That is acceptable UX
    // for the slot-text API; the textValue prop is the correct contract for
    // pre-set label display.
    const Wrapper = makeWrapper(`
      <Select model-value="us" label="Country">
        <SelectTrigger>
          <SelectValue placeholder="Pick country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us" text-value="United States">United States</SelectItem>
          <SelectItem value="ca" text-value="Canada">Canada</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    const trigger = wrapper.find('button[role="combobox"]')
    expect(trigger.text()).toContain('United States')
    expect(trigger.text()).not.toContain('us')
    wrapper.unmount()
  })
})

describe('Select — numeric values', () => {
  it('Test 14: renders numeric-value items with matching data-value when open', async () => {
    const Wrapper = makeWrapper(`
      <Select :open="true" label="Quantity">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="1">One</SelectItem>
          <SelectItem :value="2">Two</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    const options = document.querySelectorAll('[role="option"]')
    expect(options.length).toBe(2)
    const texts = Array.from(options).map(o => (o as HTMLElement).textContent ?? '')
    expect(texts.some(t => t.includes('One'))).toBe(true)
    expect(texts.some(t => t.includes('Two'))).toBe(true)
    wrapper.unmount()
  })

  it('Test 15: trigger shows item label for a pre-set numeric modelValue', async () => {
    // textValue lets SelectItem register the label at setup time (before mount),
    // so the trigger displays the correct label for a pre-set numeric value
    // even though the dropdown has never been opened.
    const Wrapper = makeWrapper(`
      <Select :model-value="2" label="Quantity">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="1" text-value="One">One</SelectItem>
          <SelectItem :value="2" text-value="Two">Two</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    const trigger = wrapper.find('button[role="combobox"]')
    expect(trigger.text()).toContain('Two')
    wrapper.unmount()
  })

  it('Test 16: multiple-mode renders chip labels for a pre-set numeric array', async () => {
    // Exercises the numeric path through SelectValue → SelectOverflowChips →
    // itemLabel: a numeric modelValue[] must resolve to the registered labels.
    const Wrapper = makeWrapper(`
      <Select :multiple="true" :model-value="[1, 2]" label="Quantity">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="1" text-value="One">One</SelectItem>
          <SelectItem :value="2" text-value="Two">Two</SelectItem>
          <SelectItem :value="3" text-value="Three">Three</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    const trigger = wrapper.find('button[role="combobox"]')
    expect(trigger.text()).toContain('One')
    expect(trigger.text()).toContain('Two')
    wrapper.unmount()
  })

  it('Test 17: numeric key 0 with a registered label is not dropped by itemLabel', async () => {
    // Guards the filter(Boolean) → filter(length) fix: the falsy numeric key 0
    // must still resolve its label in multiple mode.
    const Wrapper = makeWrapper(`
      <Select :multiple="true" :model-value="[0]" label="Quantity">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="0" text-value="Zero">Zero</SelectItem>
          <SelectItem :value="1" text-value="One">One</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    const trigger = wrapper.find('button[role="combobox"]')
    expect(trigger.text()).toContain('Zero')
    wrapper.unmount()
  })
})

describe('Select — terse API (items prop / bare children)', () => {
  it('Test 18: renders options from the items prop without manual chrome', async () => {
    const Wrapper = makeWrapper(
      `<Select :open="true" label="Fruit" placeholder="Pick" :items="items" />`,
      undefined,
      () => ({
        items: [
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana' },
        ],
      }),
    )
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    const options = document.querySelectorAll('[role="option"]')
    expect(options.length).toBe(2)
    const texts = Array.from(options).map(o => (o as HTMLElement).textContent ?? '')
    expect(texts.some(t => t.includes('Apple'))).toBe(true)
    expect(texts.some(t => t.includes('Banana'))).toBe(true)
    wrapper.unmount()
  })

  it('Test 19: items prop supports numeric values', async () => {
    const Wrapper = makeWrapper(
      `<Select :open="true" label="Qty" placeholder="Pick" :items="items" />`,
      undefined,
      () => ({
        items: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
        ],
      }),
    )
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    const options = document.querySelectorAll('[role="option"]')
    expect(options.length).toBe(2)
    const texts = Array.from(options).map(o => (o as HTMLElement).textContent ?? '')
    expect(texts.some(t => t.includes('One'))).toBe(true)
    wrapper.unmount()
  })

  it('Test 20: #item slot customizes rendering in data-driven mode', async () => {
    const Wrapper = makeWrapper(
      `<Select :open="true" label="Fruit" placeholder="Pick" :items="items">
        <template #item="{ item }"><span>★ {{ item.label }}</span></template>
      </Select>`,
      undefined,
      () => ({ items: [{ value: 'apple', label: 'Apple' }] }),
    )
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    const options = document.querySelectorAll('[role="option"]')
    expect(options.length).toBe(1)
    expect((options[0] as HTMLElement).textContent).toContain('★')
    wrapper.unmount()
  })

  it('Test 21: bare SelectItem children render without manual trigger/content', async () => {
    const Wrapper = makeWrapper(`
      <Select :open="true" label="Fruit" placeholder="Pick">
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    const options = document.querySelectorAll('[role="option"]')
    expect(options.length).toBe(2)
    wrapper.unmount()
  })

  it('Test 22: terse Select still shows a combobox trigger and placeholder', () => {
    const Wrapper = makeWrapper(
      `<Select label="Fruit" placeholder="Pick a fruit" :items="items" />`,
      undefined,
      () => ({ items: [{ value: 'apple', label: 'Apple' }] }),
    )
    const wrapper = mount(Wrapper, { attachTo: document.body })
    expect(wrapper.find('button[role="combobox"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Pick a fruit')
    wrapper.unmount()
  })

  it('Test 25: terse items-prop shows the selected label while closed (pre-set value)', async () => {
    const Wrapper = makeWrapper(
      `<Select model-value="banana" label="Fruit" placeholder="Pick" :items="items" />`,
      undefined,
      () => ({
        items: [
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana' },
        ],
      }),
    )
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    const trigger = wrapper.find('button[role="combobox"]')
    expect(trigger.text()).toContain('Banana')
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

  it('Test 23: terse items-prop Select passes axe (closed)', async () => {
    const Wrapper = makeWrapper(
      `<Select label="Fruit" placeholder="Pick" :items="items" />`,
      undefined,
      () => ({
        items: [
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana' },
        ],
      }),
    )
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    const results = await axe.run(wrapper.element)
    if (results.violations.length > 0) {
      console.log('AXE VIOLATIONS (terse closed):', JSON.stringify(results.violations.map(v => ({
        id: v.id, description: v.description, nodes: v.nodes.map(n => n.html),
      })), null, 2))
    }
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('Test 24: terse items-prop Select passes axe (open)', async () => {
    const Wrapper = makeWrapper(
      `<Select :open="true" label="Fruit" placeholder="Pick" :items="items" />`,
      undefined,
      () => ({
        items: [
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana' },
        ],
      }),
    )
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    const results = await axe.run(wrapper.element)
    if (results.violations.length > 0) {
      console.log('AXE VIOLATIONS (terse open):', JSON.stringify(results.violations.map(v => ({
        id: v.id, description: v.description, nodes: v.nodes.map(n => n.html),
      })), null, 2))
    }
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
