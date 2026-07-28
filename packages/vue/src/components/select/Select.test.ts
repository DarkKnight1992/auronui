import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
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

  it('Test 26: deprecated bare disabled prop on SelectTrigger disables the trigger', () => {
    const Wrapper = makeWrapper(`
      <Select label="Fruit">
        <SelectTrigger :disabled="true">
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

  it('Test 28: isReadOnly (canonical) on Select marks the trigger data-readonly', () => {
    const Wrapper = makeWrapper(`
      <Select label="Fruit" :is-read-only="true">
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
    expect(trigger.attributes('data-readonly')).toBeTruthy()
    wrapper.unmount()
  })

  it('Test 29: deprecated isReadonly (old casing) on Select marks the trigger data-readonly', () => {
    const Wrapper = makeWrapper(`
      <Select label="Fruit" :is-readonly="true">
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
    expect(trigger.attributes('data-readonly')).toBeTruthy()
    wrapper.unmount()
  })

  it('Test 27: deprecated bare disabled prop on SelectItem marks the item data-disabled', async () => {
    // Use :open="true" to bypass jsdom popper layout limitation
    const Wrapper = makeWrapper(`
      <Select :open="true" label="Fruit">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana" :disabled="true">Banana</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    await nextTick()
    const disabledItems = document.querySelectorAll('[data-disabled]')
    expect(disabledItems.length).toBeGreaterThan(0)
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

// ─────────────────────────────────────────────────────────────────────────
// useFormField / FieldLabel regression coverage (split-file case).
//
// Select.vue calls useFormField() and destructures its return into top-level
// bindings, rendering the OUTSIDE-label fragment itself via <FieldLabel>.
// SelectTrigger.vue does NOT call useFormField — it computes its own
// showInsideLabel from the injected Select context (ctx.hasLabel /
// ctx.labelPlacement) and renders the INSIDE-label fragment via its own
// <FieldLabel>, wired to ctx.triggerId / ctx.label / ctx.isRequired.
//
// Regression guard: if useFormField's return were bundled into a single
// object referenced via dot-access in the template (`formField.showOutsideLabel`)
// instead of destructured into bare top-level bindings, Vue's <script setup>
// auto-unwrapping would not rewrite the nested ref, so `v-if` on the object
// reference would always be truthy — both label fragments could render
// simultaneously, or attributes bound via v-bind="formField.rootDataAttrs"
// would silently fail to render. These tests would catch either failure mode.
// ─────────────────────────────────────────────────────────────────────────

describe('Select — label placement (split-file: Select.vue outside / SelectTrigger.vue inside)', () => {
  it('Test 30: labelPlacement "inside" (default) renders exactly one <label>, from SelectTrigger', () => {
    const Wrapper = makeWrapper(`
      <Select label="Fruit" label-placement="inside">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    expect(wrapper.findAll('label')).toHaveLength(1)
    // The single label must live inside the trigger (SelectTrigger's context path),
    // not as a direct child of the Select.vue root.
    expect(wrapper.find('button[role="combobox"] label').exists()).toBe(true)
    wrapper.unmount()
  })

  it('Test 31: labelPlacement "outside" renders exactly one <label>, from Select.vue (not duplicated in SelectTrigger)', () => {
    const Wrapper = makeWrapper(`
      <Select label="Fruit" label-placement="outside">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    expect(wrapper.findAll('label')).toHaveLength(1)
    // The label must NOT be nested inside the trigger for outside placement.
    expect(wrapper.find('button[role="combobox"] label').exists()).toBe(false)
    wrapper.unmount()
  })

  it('Test 32: labelPlacement "outside-left" renders exactly one <label>, from Select.vue', () => {
    const Wrapper = makeWrapper(`
      <Select label="Fruit" label-placement="outside-left">
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    expect(wrapper.findAll('label')).toHaveLength(1)
    expect(wrapper.find('button[role="combobox"] label').exists()).toBe(false)
    wrapper.unmount()
  })

  it('Test 33: no label prop → zero <label> elements rendered anywhere', () => {
    const Wrapper = makeWrapper(`
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    `)
    const wrapper = mount(Wrapper, { attachTo: document.body })
    expect(wrapper.findAll('label')).toHaveLength(0)
    wrapper.unmount()
  })
})

describe('Select — aria-describedby resolution', () => {
  it('Test 34: aria-describedby (error case) on the trigger resolves to a DOM element containing the error text', () => {
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
    const trigger = wrapper.find('button[role="combobox"]')
    const describedBy = trigger.attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    const target = wrapper.find(`#${describedBy}`)
    expect(target.exists()).toBe(true)
    expect(target.text()).toBe('Please select a fruit')
    wrapper.unmount()
  })

  it('Test 35: aria-describedby (description case) on the trigger resolves to a DOM element containing the description text', () => {
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
    const trigger = wrapper.find('button[role="combobox"]')
    const describedBy = trigger.attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    const target = wrapper.find(`#${describedBy}`)
    expect(target.exists()).toBe(true)
    expect(target.text()).toBe('Pick your favorite fruit')
    wrapper.unmount()
  })
})

describe('Select — root data-attributes (rootDataAttrs from useFormField)', () => {
  // None of these were previously asserted on Select.vue's own root <div> — only
  // the SelectTrigger element's independent data-readonly (Tests 28/29) and
  // SelectItem's data-disabled (Tests 7/27) had coverage. rootDataAttrs is
  // v-bind'd onto the Select.vue root, so every one of the 6 attributes needs
  // present/absent coverage here.

  it('Test 36: isInvalid=true sets data-invalid on the root; absent when false', () => {
    const valid = mount(BasicSelect, { attachTo: document.body })
    expect(valid.attributes('data-invalid')).toBeUndefined()
    valid.unmount()

    const Wrapper = makeWrapper(`
      <Select label="Fruit" :is-invalid="true">
        <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>
        <SelectContent><SelectItem value="apple">Apple</SelectItem></SelectContent>
      </Select>
    `)
    const invalid = mount(Wrapper, { attachTo: document.body })
    expect(invalid.attributes('data-invalid')).toBeTruthy()
    invalid.unmount()
  })

  it('Test 37: isDisabled=true sets data-disabled on the root; absent when false', () => {
    const enabled = mount(BasicSelect, { attachTo: document.body })
    expect(enabled.attributes('data-disabled')).toBeUndefined()
    enabled.unmount()

    const Wrapper = makeWrapper(`
      <Select label="Fruit" :is-disabled="true">
        <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>
        <SelectContent><SelectItem value="apple">Apple</SelectItem></SelectContent>
      </Select>
    `)
    const disabled = mount(Wrapper, { attachTo: document.body })
    expect(disabled.attributes('data-disabled')).toBeTruthy()
    disabled.unmount()
  })

  it('Test 38: isReadOnly=true sets data-readonly on the Select.vue root (distinct from the trigger\'s own data-readonly)', () => {
    const enabled = mount(BasicSelect, { attachTo: document.body })
    expect(enabled.attributes('data-readonly')).toBeUndefined()
    enabled.unmount()

    const Wrapper = makeWrapper(`
      <Select label="Fruit" :is-read-only="true">
        <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>
        <SelectContent><SelectItem value="apple">Apple</SelectItem></SelectContent>
      </Select>
    `)
    const readonly = mount(Wrapper, { attachTo: document.body })
    expect(readonly.attributes('data-readonly')).toBeTruthy()
    readonly.unmount()
  })

  it('Test 39: isRequired=true sets data-required on the root; absent when false', () => {
    const notRequired = mount(BasicSelect, { attachTo: document.body })
    expect(notRequired.attributes('data-required')).toBeUndefined()
    notRequired.unmount()

    const Wrapper = makeWrapper(`
      <Select label="Fruit" :is-required="true">
        <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>
        <SelectContent><SelectItem value="apple">Apple</SelectItem></SelectContent>
      </Select>
    `)
    const required = mount(Wrapper, { attachTo: document.body })
    expect(required.attributes('data-required')).toBeTruthy()
    required.unmount()
  })

  it('Test 40: label set → data-has-label on the root; absent when no label', () => {
    const withLabel = mount(BasicSelect, { attachTo: document.body })
    expect(withLabel.attributes('data-has-label')).toBeTruthy()
    withLabel.unmount()

    const Wrapper = makeWrapper(`
      <Select>
        <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>
        <SelectContent><SelectItem value="apple">Apple</SelectItem></SelectContent>
      </Select>
    `)
    const withoutLabel = mount(Wrapper, { attachTo: document.body })
    expect(withoutLabel.attributes('data-has-label')).toBeUndefined()
    withoutLabel.unmount()
  })

  it('Test 41: description set → data-has-helper on the root; absent when no description/error', () => {
    const noHelper = mount(BasicSelect, { attachTo: document.body })
    expect(noHelper.attributes('data-has-helper')).toBeUndefined()
    noHelper.unmount()

    const Wrapper = makeWrapper(`
      <Select label="Fruit" description="Pick your favorite fruit">
        <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>
        <SelectContent><SelectItem value="apple">Apple</SelectItem></SelectContent>
      </Select>
    `)
    const withHelper = mount(Wrapper, { attachTo: document.body })
    expect(withHelper.attributes('data-has-helper')).toBeTruthy()
    withHelper.unmount()
  })
})

describe('Select — open-on-focus guard', () => {
  // jsdom's matches(':focus-visible') always returns true for any focused
  // element — it has no real focus-visible heuristic — so these tests stub
  // HTMLElement.prototype.matches to simulate the two real-world cases a
  // browser actually distinguishes: a genuine keyboard Tab (focus-visible)
  // vs. a program-driven .focus() call like a Dialog auto-focusing its first
  // focusable descendant on open (not focus-visible).
  const original = HTMLElement.prototype.matches
  function stubFocusVisible(value: boolean) {
    vi.spyOn(HTMLElement.prototype, 'matches').mockImplementation(function (
      this: HTMLElement,
      selector: string,
    ) {
      if (selector === ':focus-visible') return value
      return original.call(this, selector)
    })
  }
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not open when focus is not focus-visible (e.g. a Dialog auto-focusing the trigger on open)', async () => {
    stubFocusVisible(false)
    const wrapper = mount(BasicSelect, { attachTo: document.body })
    const trigger = wrapper.find('button[role="combobox"]')
    await trigger.trigger('focus')
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('opens when focus is focus-visible (a genuine keyboard Tab into the field)', async () => {
    stubFocusVisible(true)
    const wrapper = mount(BasicSelect, { attachTo: document.body })
    const trigger = wrapper.find('button[role="combobox"]')
    await trigger.trigger('focus')
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })
})

describe('Select — color variants', () => {
  it('applies all color variants to the trigger', () => {
    const colors = ['default', 'primary', 'secondary', 'accent', 'success', 'warning', 'danger'] as const
    for (const color of colors) {
      const wrapper = mount(Select, {
        props: {
          color,
          items: [{ value: 'apple', label: 'Apple' }],
        },
        attachTo: document.body,
      })
      expect(wrapper.find('button[role="combobox"]').classes()).toContain(`select__trigger--${color}`)
      wrapper.unmount()
    }
  })
})
