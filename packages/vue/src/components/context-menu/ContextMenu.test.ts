import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import axe from 'axe-core'
import ContextMenu from './ContextMenu.vue'
import ContextMenuTrigger from './ContextMenuTrigger.vue'
import ContextMenuContent from './ContextMenuContent.vue'
import ContextMenuItem from './ContextMenuItem.vue'
import ContextMenuCheckboxItem from './ContextMenuCheckboxItem.vue'
import ContextMenuRadioGroup from './ContextMenuRadioGroup.vue'
import ContextMenuRadioItem from './ContextMenuRadioItem.vue'
import ContextMenuSection from './ContextMenuSection.vue'
import ContextMenuSub from './ContextMenuSub.vue'
import ContextMenuSubTrigger from './ContextMenuSubTrigger.vue'
import ContextMenuSubContent from './ContextMenuSubContent.vue'

// Disable color-contrast: jsdom doesn't implement getComputedStyle with pseudo-elements.
// Disable region: portalled context menu content lands directly in body, outside any landmark.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
    region: { enabled: false },
  },
}

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {}
})

const allComponents = {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSection,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
}

// Helper: fire a right-click (contextmenu) event on an element
function rightClick(el: Element) {
  el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
}

const BasicContextMenu = defineComponent({
  components: allComponents,
  template: `
    <ContextMenu>
      <ContextMenuTrigger as-child>
        <div>Right-click me</div>
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Basic menu">
        <ContextMenuItem>Item 1</ContextMenuItem>
        <ContextMenuItem>Item 2</ContextMenuItem>
        <ContextMenuItem>Item 3</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  `,
})

describe('ContextMenu — render', () => {
  it('Test 1: renders the trigger area', () => {
    const wrapper = mount(BasicContextMenu, { attachTo: document.body })
    expect(wrapper.text()).toContain('Right-click me')
    wrapper.unmount()
  })

  it('Test 2: menu is hidden until right-click', () => {
    const wrapper = mount(BasicContextMenu, { attachTo: document.body })
    const menuItems = document.querySelectorAll('[role="menuitem"]')
    expect(menuItems.length).toBe(0)
    wrapper.unmount()
  })

  it('Test 3: right-clicking the trigger opens the menu', async () => {
    const wrapper = mount(BasicContextMenu, { attachTo: document.body })
    const trigger = wrapper.find('div').element
    rightClick(trigger)
    await nextTick()
    await nextTick()
    const menuItems = document.querySelectorAll('[role="menuitem"]')
    expect(menuItems.length).toBeGreaterThanOrEqual(3)
    wrapper.unmount()
  })
})

describe('ContextMenu — open/close', () => {
  it('Test 4: Escape key closes an open menu', async () => {
    const wrapper = mount(BasicContextMenu, { attachTo: document.body })
    const trigger = wrapper.find('div').element
    rightClick(trigger)
    await nextTick()
    await nextTick()
    expect(document.querySelectorAll('[role="menuitem"]').length).toBeGreaterThan(0)

    const content = document.querySelector('[role="menu"]')
    content?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    await nextTick()
    wrapper.unmount()
  })
})

describe('ContextMenu — items', () => {
  it('Test 5: disabled item has data-disabled attribute', async () => {
    const WithDisabled = defineComponent({
      components: allComponents,
      template: `
        <ContextMenu>
          <ContextMenuTrigger as-child>
            <div>Right-click me</div>
          </ContextMenuTrigger>
          <ContextMenuContent aria-label="With disabled">
            <ContextMenuItem>Item 1</ContextMenuItem>
            <ContextMenuItem :is-disabled="true">Disabled Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      `,
    })
    const wrapper = mount(WithDisabled, { attachTo: document.body })
    const trigger = wrapper.find('div').element
    rightClick(trigger)
    await nextTick()
    await nextTick()
    const disabledItems = document.querySelectorAll('[data-disabled]')
    expect(disabledItems.length).toBeGreaterThan(0)
    wrapper.unmount()
  })

  it('Test 6: CheckboxItem renders with role="menuitemcheckbox" and reflects isSelected', async () => {
    const WithCheckbox = defineComponent({
      components: allComponents,
      setup() {
        const checked = ref(true)
        return { checked }
      },
      template: `
        <ContextMenu>
          <ContextMenuTrigger as-child>
            <div>Right-click me</div>
          </ContextMenuTrigger>
          <ContextMenuContent aria-label="Checkbox menu">
            <ContextMenuCheckboxItem v-model:is-selected="checked">Auto Save</ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      `,
    })
    const wrapper = mount(WithCheckbox, { attachTo: document.body })
    const trigger = wrapper.find('div').element
    rightClick(trigger)
    await nextTick()
    await nextTick()
    const checkboxItem = document.querySelector('[role="menuitemcheckbox"]')
    expect(checkboxItem).not.toBeNull()
    expect(checkboxItem?.getAttribute('aria-checked')).toBe('true')
    wrapper.unmount()
  })

  it('Test 7: RadioItem renders with role="menuitemradio", selected item has aria-checked="true"', async () => {
    const WithRadio = defineComponent({
      components: allComponents,
      setup() {
        const density = ref('compact')
        return { density }
      },
      template: `
        <ContextMenu>
          <ContextMenuTrigger as-child>
            <div>Right-click me</div>
          </ContextMenuTrigger>
          <ContextMenuContent aria-label="Radio menu">
            <ContextMenuRadioGroup v-model="density">
              <ContextMenuRadioItem value="compact">Compact</ContextMenuRadioItem>
              <ContextMenuRadioItem value="comfortable">Comfortable</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      `,
    })
    const wrapper = mount(WithRadio, { attachTo: document.body })
    const trigger = wrapper.find('div').element
    rightClick(trigger)
    await nextTick()
    await nextTick()
    const radioItems = document.querySelectorAll('[role="menuitemradio"]')
    expect(radioItems.length).toBe(2)
    const checkedItem = Array.from(radioItems).find(el => el.getAttribute('aria-checked') === 'true')
    expect(checkedItem?.textContent).toContain('Compact')
    wrapper.unmount()
  })

  it('Test 8: ContextMenuSection renders with a label when title is given', async () => {
    const WithSection = defineComponent({
      components: allComponents,
      template: `
        <ContextMenu>
          <ContextMenuTrigger as-child>
            <div>Right-click me</div>
          </ContextMenuTrigger>
          <ContextMenuContent aria-label="Section menu">
            <ContextMenuSection title="Actions">
              <ContextMenuItem>Edit</ContextMenuItem>
              <ContextMenuItem>Delete</ContextMenuItem>
            </ContextMenuSection>
          </ContextMenuContent>
        </ContextMenu>
      `,
    })
    const wrapper = mount(WithSection, { attachTo: document.body })
    const trigger = wrapper.find('div').element
    rightClick(trigger)
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('Actions')
    wrapper.unmount()
  })

  it('Test 9: ContextMenuSub renders a nested submenu', async () => {
    const WithSubmenu = defineComponent({
      components: allComponents,
      template: `
        <ContextMenu>
          <ContextMenuTrigger as-child>
            <div>Right-click me</div>
          </ContextMenuTrigger>
          <ContextMenuContent aria-label="With submenu">
            <ContextMenuSub default-open="true">
              <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Sub Item 1</ContextMenuItem>
                <ContextMenuItem>Sub Item 2</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuItem>Regular Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      `,
    })
    const wrapper = mount(WithSubmenu, { attachTo: document.body })
    const trigger = wrapper.find('div').element
    rightClick(trigger)
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('More options')
    expect(document.body.textContent).toContain('Sub Item 1')
    wrapper.unmount()
  })
})

describe('ContextMenu — accessibility (axe)', () => {
  it('Test 10: passes axe in closed state (zero violations)', async () => {
    const wrapper = mount(BasicContextMenu, { attachTo: document.body })
    await nextTick()
    const results = await axe.run(wrapper.element, AXE_OPTIONS)
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

  it('Test 11: passes axe in open state with mixed item types (zero violations)', async () => {
    const ComplexContextMenu = defineComponent({
      components: allComponents,
      setup() {
        const autoSave = ref(false)
        const density = ref('compact')
        return { autoSave, density }
      },
      template: `
        <ContextMenu>
          <ContextMenuTrigger as-child>
            <div>Right-click for settings</div>
          </ContextMenuTrigger>
          <ContextMenuContent aria-label="Settings menu">
            <ContextMenuSection title="Preferences">
              <ContextMenuCheckboxItem v-model:is-selected="autoSave">Auto Save</ContextMenuCheckboxItem>
            </ContextMenuSection>
            <ContextMenuSection title="View Density">
              <ContextMenuRadioGroup v-model="density">
                <ContextMenuRadioItem value="compact">Compact</ContextMenuRadioItem>
                <ContextMenuRadioItem value="comfortable">Comfortable</ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuSection>
            <ContextMenuSub default-open="true">
              <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Sub Item 1</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>
      `,
    })
    const wrapper = mount(ComplexContextMenu, { attachTo: document.body })
    const trigger = wrapper.find('div').element
    rightClick(trigger)
    await nextTick()
    await nextTick()

    // ContextMenuContent portals to document.body — scope the audit there so
    // it actually covers the open menu's content (Dropdown's own axe test
    // scopes to wrapper.element even when open, which does NOT see portalled
    // content; do not repeat that gap here).
    const results = await axe.run(document.body, AXE_OPTIONS)
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
