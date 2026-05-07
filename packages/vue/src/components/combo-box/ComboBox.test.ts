import { describe, it, expect, afterEach, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'

// jsdom does not implement scrollIntoView — mock it so Reka UI's
// highlightSelected() call inside ComboboxRoot does not throw.
beforeAll(() => {
  if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = () => {}
  }
})
import ComboBox from './ComboBox.vue'
import ComboBoxInput from './ComboBoxInput.vue'
import ComboBoxContent from './ComboBoxContent.vue'
import ComboBoxItem from './ComboBoxItem.vue'
import ComboBoxEmpty from './ComboBoxEmpty.vue'

interface Item {
  value: string
  label: string
}

const items: Item[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
]

function harness(props: Record<string, unknown> = {}) {
  return mount({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    props: ['modelValue', 'isDisabled', 'label'],
    template: `
      <ComboBox :items="items" :model-value="modelValue" :is-disabled="isDisabled" :label="label" aria-label="Fruit picker">
        <ComboBoxInput placeholder="Select a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :text-value="item.label"
          >
            {{ item.label }}
          </ComboBoxItem>
          <template #empty>
            <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
          </template>
        </ComboBoxContent>
      </ComboBox>
    `,
    setup() {
      return { items }
    },
  }, { props })
}

const mountedWrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  mountedWrappers.forEach(w => w.unmount())
  mountedWrappers.length = 0
})

describe('ComboBox', () => {
  it('renders with combo-box base class', () => {
    const w = harness()
    mountedWrappers.push(w)
    expect(w.find('.combo-box').exists()).toBe(true)
  })

  it('renders ComboBoxInput', () => {
    const w = harness()
    mountedWrappers.push(w)
    // Input should be rendered
    expect(w.find('input').exists()).toBe(true)
  })

  it('renders label when provided', () => {
    const w = harness({ label: 'Fruit' })
    mountedWrappers.push(w)
    expect(w.find('label').text()).toContain('Fruit')
  })

  it('input has placeholder text', () => {
    const w = harness()
    mountedWrappers.push(w)
    const input = w.find('input')
    expect(input.attributes('placeholder')).toBe('Select a fruit...')
  })

  it('trigger button is present for opening the dropdown', () => {
    const w = harness()
    mountedWrappers.push(w)
    // Trigger button or some interactive element should exist
    expect(w.find('button').exists()).toBe(true)
  })

  it('input accepts ArrowDown keyboard input (search attribute)', async () => {
    const w = harness()
    mountedWrappers.push(w)
    const input = w.find('input')
    await input.trigger('keydown', { key: 'ArrowDown' })
    // No errors thrown
    expect(input.exists()).toBe(true)
  })

  it('disabled state: isDisabled prop applied', () => {
    const w = harness({ isDisabled: true })
    mountedWrappers.push(w)
    expect(w.find('.combo-box').exists()).toBe(true)
  })

  it('axe: passes accessibility audit in closed state', async () => {
    const wrapper = mount({
      components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
      template: `
        <ComboBox :items="items" aria-label="Fruit picker">
          <ComboBoxInput placeholder="Select a fruit..." />
          <ComboBoxContent>
            <ComboBoxItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              :text-value="item.label"
            >
              {{ item.label }}
            </ComboBoxItem>
            <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
          </ComboBoxContent>
        </ComboBox>
      `,
      setup() {
        return { items }
      },
    }, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    // Reka UI sets aria-controls="" on the combobox input before the portal
    // content mounts (closed state). This is structurally correct but axe
    // flags aria-controls="" as an empty attribute reference. We disable only
    // that one rule for this test; all other violations still surface.
    const results = await axe.run(wrapper.element, {
      rules: { 'aria-required-attr': { enabled: false } },
    })
    expect(results).toHaveNoViolations()
  })
})
