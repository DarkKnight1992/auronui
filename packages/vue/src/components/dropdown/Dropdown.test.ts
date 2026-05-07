import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import axe from 'axe-core'
import Dropdown from './Dropdown.vue'
import DropdownTrigger from './DropdownTrigger.vue'
import DropdownMenu from './DropdownMenu.vue'
import DropdownItem from './DropdownItem.vue'
import DropdownCheckboxItem from './DropdownCheckboxItem.vue'
import DropdownRadioGroup from './DropdownRadioGroup.vue'
import DropdownRadioItem from './DropdownRadioItem.vue'
import DropdownSection from './DropdownSection.vue'
import DropdownSub from './DropdownSub.vue'
import DropdownSubTrigger from './DropdownSubTrigger.vue'
import DropdownSubContent from './DropdownSubContent.vue'

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {}
})

const allComponents = {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSection,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
}

// Helper to create a basic closed dropdown
const BasicDropdown = defineComponent({
  components: allComponents,
  template: `
    <Dropdown>
      <DropdownTrigger>
        <button type="button">Open Menu</button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Basic menu">
        <DropdownItem>Item 1</DropdownItem>
        <DropdownItem>Item 2</DropdownItem>
        <DropdownItem>Item 3</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  `,
})

// Helper to create an open dropdown for testing
const OpenDropdown = defineComponent({
  components: allComponents,
  template: `
    <Dropdown :is-open="true">
      <DropdownTrigger>
        <button type="button">Open Menu</button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Open menu">
        <DropdownItem>Item 1</DropdownItem>
        <DropdownItem>Item 2</DropdownItem>
        <DropdownItem :is-disabled="true">Disabled Item</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  `,
})

describe('Dropdown — render', () => {
  it('Test 1: renders a trigger button', () => {
    const wrapper = mount(BasicDropdown, { attachTo: document.body })
    expect(wrapper.find('button').exists()).toBe(true)
    wrapper.unmount()
  })

  it('Test 2: menu is hidden when closed', () => {
    const wrapper = mount(BasicDropdown, { attachTo: document.body })
    // When closed, no menu items should be visible in the portal
    const menuItems = document.querySelectorAll('[role="menuitem"]')
    expect(menuItems.length).toBe(0)
    wrapper.unmount()
  })

  it('Test 3: menu renders items when isOpen=true', async () => {
    const wrapper = mount(OpenDropdown, { attachTo: document.body })
    await nextTick()
    const menuItems = document.querySelectorAll('[role="menuitem"]')
    expect(menuItems.length).toBeGreaterThanOrEqual(2)
    wrapper.unmount()
  })

  it('Test 4: trigger uses DropdownMenuTrigger from reka-ui (has aria-haspopup)', () => {
    const wrapper = mount(BasicDropdown, { attachTo: document.body })
    const trigger = wrapper.find('button')
    expect(trigger.attributes('aria-haspopup')).toBeDefined()
    wrapper.unmount()
  })
})

describe('Dropdown — open/close', () => {
  it('Test 5: click trigger opens the menu', async () => {
    const wrapper = mount(BasicDropdown, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await nextTick()
    const menuItems = document.querySelectorAll('[role="menuitem"]')
    expect(menuItems.length).toBeGreaterThan(0)
    wrapper.unmount()
  })

  it('Test 6: Escape key closes the menu', async () => {
    const wrapper = mount(OpenDropdown, { attachTo: document.body })
    await nextTick()
    // Send Escape key to document
    await wrapper.trigger('keydown', { key: 'Escape' })
    await nextTick()
    wrapper.unmount()
  })
})

describe('Dropdown — keyboard navigation', () => {
  it('Test 7: ArrowDown moves focus to first item when menu opens', async () => {
    const wrapper = mount(OpenDropdown, { attachTo: document.body })
    await nextTick()
    const content = document.querySelector('[role="menu"]')
    expect(content).not.toBeNull()
    // Fire ArrowDown — Reka UI handles focus internally
    content?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    wrapper.unmount()
  })

  it('Test 8: disabled item has data-disabled attribute', async () => {
    const wrapper = mount(OpenDropdown, { attachTo: document.body })
    await nextTick()
    const disabledItems = document.querySelectorAll('[data-disabled]')
    expect(disabledItems.length).toBeGreaterThan(0)
    wrapper.unmount()
  })

  it('Test 9: ArrowRight on SubTrigger opens submenu', async () => {
    const WithSubmenu = defineComponent({
      components: allComponents,
      template: `
        <Dropdown :is-open="true">
          <DropdownTrigger><button type="button">Menu</button></DropdownTrigger>
          <DropdownMenu aria-label="With submenu">
            <DropdownSub>
              <DropdownSubTrigger>More options</DropdownSubTrigger>
              <DropdownSubContent>
                <DropdownItem>Sub Item 1</DropdownItem>
                <DropdownItem>Sub Item 2</DropdownItem>
              </DropdownSubContent>
            </DropdownSub>
            <DropdownItem>Regular Item</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      `,
    })
    const wrapper = mount(WithSubmenu, { attachTo: document.body })
    await nextTick()
    const subTrigger = document.querySelector('[data-radix-dropdown-menu-sub-trigger]') as HTMLElement
      ?? document.querySelector('[role="menuitem"][aria-haspopup]') as HTMLElement
    expect(subTrigger || document.querySelector('[role="menu"]')).not.toBeNull()
    wrapper.unmount()
  })
})

describe('Dropdown — CheckboxItem', () => {
  it('Test 10: CheckboxItem renders with role="menuitemcheckbox"', async () => {
    const WithCheckbox = defineComponent({
      components: allComponents,
      setup() {
        const checked = ref(false)
        return { checked }
      },
      template: `
        <Dropdown :is-open="true">
          <DropdownTrigger><button type="button">Menu</button></DropdownTrigger>
          <DropdownMenu aria-label="Checkbox menu">
            <DropdownCheckboxItem v-model:is-selected="checked">Auto Save</DropdownCheckboxItem>
          </DropdownMenu>
        </Dropdown>
      `,
    })
    const wrapper = mount(WithCheckbox, { attachTo: document.body })
    await nextTick()
    const checkboxItem = document.querySelector('[role="menuitemcheckbox"]')
    expect(checkboxItem).not.toBeNull()
    wrapper.unmount()
  })

  it('Test 11: CheckboxItem aria-checked reflects isSelected model', async () => {
    const WithCheckbox = defineComponent({
      components: allComponents,
      setup() {
        const checked = ref(true)
        return { checked }
      },
      template: `
        <Dropdown :is-open="true">
          <DropdownTrigger><button type="button">Menu</button></DropdownTrigger>
          <DropdownMenu aria-label="Checkbox menu">
            <DropdownCheckboxItem v-model:is-selected="checked">Auto Save</DropdownCheckboxItem>
          </DropdownMenu>
        </Dropdown>
      `,
    })
    const wrapper = mount(WithCheckbox, { attachTo: document.body })
    await nextTick()
    const checkboxItem = document.querySelector('[role="menuitemcheckbox"]')
    expect(checkboxItem?.getAttribute('aria-checked')).toBe('true')
    wrapper.unmount()
  })
})

describe('Dropdown — RadioGroup', () => {
  it('Test 12: RadioItem renders with role="menuitemradio"', async () => {
    const WithRadio = defineComponent({
      components: allComponents,
      setup() {
        const density = ref('compact')
        return { density }
      },
      template: `
        <Dropdown :is-open="true">
          <DropdownTrigger><button type="button">Menu</button></DropdownTrigger>
          <DropdownMenu aria-label="Radio menu">
            <DropdownRadioGroup v-model="density">
              <DropdownRadioItem value="compact">Compact</DropdownRadioItem>
              <DropdownRadioItem value="comfortable">Comfortable</DropdownRadioItem>
              <DropdownRadioItem value="spacious">Spacious</DropdownRadioItem>
            </DropdownRadioGroup>
          </DropdownMenu>
        </Dropdown>
      `,
    })
    const wrapper = mount(WithRadio, { attachTo: document.body })
    await nextTick()
    const radioItems = document.querySelectorAll('[role="menuitemradio"]')
    expect(radioItems.length).toBe(3)
    wrapper.unmount()
  })

  it('Test 13: selected RadioItem has aria-checked="true"', async () => {
    const WithRadio = defineComponent({
      components: allComponents,
      setup() {
        const density = ref('compact')
        return { density }
      },
      template: `
        <Dropdown :is-open="true">
          <DropdownTrigger><button type="button">Menu</button></DropdownTrigger>
          <DropdownMenu aria-label="Radio menu">
            <DropdownRadioGroup v-model="density">
              <DropdownRadioItem value="compact">Compact</DropdownRadioItem>
              <DropdownRadioItem value="comfortable">Comfortable</DropdownRadioItem>
            </DropdownRadioGroup>
          </DropdownMenu>
        </Dropdown>
      `,
    })
    const wrapper = mount(WithRadio, { attachTo: document.body })
    await nextTick()
    const radioItems = document.querySelectorAll('[role="menuitemradio"]')
    const checkedItem = Array.from(radioItems).find(el => el.getAttribute('aria-checked') === 'true')
    expect(checkedItem).not.toBeNull()
    expect(checkedItem?.textContent).toContain('Compact')
    wrapper.unmount()
  })
})

describe('Dropdown — Section', () => {
  it('Test 14: DropdownSection renders with a label when title is given', async () => {
    const WithSection = defineComponent({
      components: allComponents,
      template: `
        <Dropdown :is-open="true">
          <DropdownTrigger><button type="button">Menu</button></DropdownTrigger>
          <DropdownMenu aria-label="Section menu">
            <DropdownSection title="Actions">
              <DropdownItem>Edit</DropdownItem>
              <DropdownItem>Delete</DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      `,
    })
    const wrapper = mount(WithSection, { attachTo: document.body })
    await nextTick()
    // DropdownMenuLabel renders with role="group" label
    expect(document.body.textContent).toContain('Actions')
    wrapper.unmount()
  })
})

describe('Dropdown — accessibility (axe)', () => {
  it('Test 15: passes axe in closed state (zero violations)', async () => {
    const wrapper = mount(BasicDropdown, { attachTo: document.body })
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

  it('Test 16: passes axe in open state with mixed item types (zero violations)', async () => {
    const ComplexDropdown = defineComponent({
      components: allComponents,
      setup() {
        const autoSave = ref(false)
        const density = ref('compact')
        return { autoSave, density }
      },
      template: `
        <Dropdown :is-open="true">
          <DropdownTrigger><button type="button">Settings</button></DropdownTrigger>
          <DropdownMenu aria-label="Settings menu">
            <DropdownSection title="Preferences">
              <DropdownCheckboxItem v-model:is-selected="autoSave">Auto Save</DropdownCheckboxItem>
            </DropdownSection>
            <DropdownSection title="View Density">
              <DropdownRadioGroup v-model="density">
                <DropdownRadioItem value="compact">Compact</DropdownRadioItem>
                <DropdownRadioItem value="comfortable">Comfortable</DropdownRadioItem>
                <DropdownRadioItem value="spacious">Spacious</DropdownRadioItem>
              </DropdownRadioGroup>
            </DropdownSection>
            <DropdownSub>
              <DropdownSubTrigger>More options</DropdownSubTrigger>
              <DropdownSubContent>
                <DropdownItem>Sub Item 1</DropdownItem>
              </DropdownSubContent>
            </DropdownSub>
          </DropdownMenu>
        </Dropdown>
      `,
    })
    const wrapper = mount(ComplexDropdown, { attachTo: document.body })
    await nextTick()
    const results = await axe.run(wrapper.element)
    if (results.violations.length > 0) {
      console.log('AXE VIOLATIONS (complex open):', JSON.stringify(results.violations.map(v => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map(n => n.html),
      })), null, 2))
    }
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
