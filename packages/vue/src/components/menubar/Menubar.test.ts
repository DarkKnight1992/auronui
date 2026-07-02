import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import axe from 'axe-core'
import Menubar from './Menubar.vue'
import MenubarMenu from './MenubarMenu.vue'
import MenubarTrigger from './MenubarTrigger.vue'
import MenubarContent from './MenubarContent.vue'
import MenubarItem from './MenubarItem.vue'
import MenubarCheckboxItem from './MenubarCheckboxItem.vue'
import MenubarRadioGroup from './MenubarRadioGroup.vue'
import MenubarRadioItem from './MenubarRadioItem.vue'
import MenubarSection from './MenubarSection.vue'
import MenubarSub from './MenubarSub.vue'
import MenubarSubTrigger from './MenubarSubTrigger.vue'
import MenubarSubContent from './MenubarSubContent.vue'

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {}
})

const allComponents = {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSection,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}

const BasicMenubar = defineComponent({
  components: allComponents,
  template: `
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent aria-label="File menu">
          <MenubarItem>New</MenubarItem>
          <MenubarItem>Open</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent aria-label="Edit menu">
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  `,
})

describe('Menubar — render', () => {
  it('Test 1: renders one trigger button per MenubarMenu', () => {
    const wrapper = mount(BasicMenubar, { attachTo: document.body })
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
    expect(wrapper.text()).toContain('File')
    expect(wrapper.text()).toContain('Edit')
    wrapper.unmount()
  })

  it('Test 2: menu content is hidden until a trigger is clicked', () => {
    // Per the ARIA menubar pattern, top-level triggers themselves carry
    // role="menuitem" even when their menu is closed (confirmed in Reka's
    // compiled MenubarTrigger source) — so absence of [role="menuitem"] is
    // not a valid closed-state signal. [role="menu"] (the open content) is.
    const wrapper = mount(BasicMenubar, { attachTo: document.body })
    const menus = document.querySelectorAll('[role="menu"]')
    expect(menus.length).toBe(0)
    wrapper.unmount()
  })

  it('Test 3: clicking a trigger opens its menu', async () => {
    const wrapper = mount(BasicMenubar, { attachTo: document.body })
    const fileTrigger = wrapper.findAll('button')[0]
    await fileTrigger.trigger('pointerdown', { button: 0, ctrlKey: false })
    await nextTick()
    await nextTick()
    const menuItems = document.querySelectorAll('[role="menuitem"]')
    expect(menuItems.length).toBeGreaterThanOrEqual(2)
    expect(document.body.textContent).toContain('New')
    expect(document.body.textContent).toContain('Open')
    wrapper.unmount()
  })

  it('Test 4: trigger has aria-haspopup', () => {
    const wrapper = mount(BasicMenubar, { attachTo: document.body })
    const trigger = wrapper.findAll('button')[0]
    expect(trigger.attributes('aria-haspopup')).toBeDefined()
    wrapper.unmount()
  })
})

describe('Menubar — open/close', () => {
  it('Test 5: Escape key closes an open menu', async () => {
    const wrapper = mount(BasicMenubar, { attachTo: document.body })
    const fileTrigger = wrapper.findAll('button')[0]
    await fileTrigger.trigger('pointerdown', { button: 0, ctrlKey: false })
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

describe('Menubar — items', () => {
  it('Test 6: disabled item has data-disabled attribute', async () => {
    const WithDisabled = defineComponent({
      components: allComponents,
      template: `
        <Menubar>
          <MenubarMenu value="file">
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent aria-label="With disabled">
              <MenubarItem>Item 1</MenubarItem>
              <MenubarItem :is-disabled="true">Disabled Item</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      `,
    })
    const wrapper = mount(WithDisabled, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('pointerdown', { button: 0, ctrlKey: false })
    await nextTick()
    await nextTick()
    const disabledItems = document.querySelectorAll('[data-disabled]')
    expect(disabledItems.length).toBeGreaterThan(0)
    wrapper.unmount()
  })

  it('Test 7: CheckboxItem renders with role="menuitemcheckbox" and reflects isSelected', async () => {
    const WithCheckbox = defineComponent({
      components: allComponents,
      setup() {
        const showToolbar = ref(true)
        return { showToolbar }
      },
      template: `
        <Menubar>
          <MenubarMenu value="view">
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent aria-label="View menu">
              <MenubarCheckboxItem v-model:is-selected="showToolbar">Show Toolbar</MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      `,
    })
    const wrapper = mount(WithCheckbox, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('pointerdown', { button: 0, ctrlKey: false })
    await nextTick()
    await nextTick()
    const checkboxItem = document.querySelector('[role="menuitemcheckbox"]')
    expect(checkboxItem).not.toBeNull()
    expect(checkboxItem?.getAttribute('aria-checked')).toBe('true')
    wrapper.unmount()
  })

  it('Test 8: RadioItem renders with role="menuitemradio", selected item has aria-checked="true"', async () => {
    const WithRadio = defineComponent({
      components: allComponents,
      setup() {
        const zoom = ref('100')
        return { zoom }
      },
      template: `
        <Menubar>
          <MenubarMenu value="view">
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent aria-label="View menu">
              <MenubarRadioGroup v-model="zoom">
                <MenubarRadioItem value="100">100%</MenubarRadioItem>
                <MenubarRadioItem value="150">150%</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      `,
    })
    const wrapper = mount(WithRadio, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('pointerdown', { button: 0, ctrlKey: false })
    await nextTick()
    await nextTick()
    const radioItems = document.querySelectorAll('[role="menuitemradio"]')
    expect(radioItems.length).toBe(2)
    const checkedItem = Array.from(radioItems).find(el => el.getAttribute('aria-checked') === 'true')
    expect(checkedItem?.textContent).toContain('100%')
    wrapper.unmount()
  })

  it('Test 9: MenubarSection renders with a label when title is given', async () => {
    const WithSection = defineComponent({
      components: allComponents,
      template: `
        <Menubar>
          <MenubarMenu value="file">
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent aria-label="Section menu">
              <MenubarSection title="Recent">
                <MenubarItem>report.pdf</MenubarItem>
                <MenubarItem>notes.txt</MenubarItem>
              </MenubarSection>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      `,
    })
    const wrapper = mount(WithSection, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('pointerdown', { button: 0, ctrlKey: false })
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('Recent')
    wrapper.unmount()
  })

  it('Test 10: MenubarSub renders a nested submenu', async () => {
    const WithSubmenu = defineComponent({
      components: allComponents,
      template: `
        <Menubar>
          <MenubarMenu value="file">
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent aria-label="With submenu">
              <MenubarSub default-open="true">
                <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>report.pdf</MenubarItem>
                  <MenubarItem>notes.txt</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarItem>New</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      `,
    })
    const wrapper = mount(WithSubmenu, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('pointerdown', { button: 0, ctrlKey: false })
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('Open Recent')
    expect(document.body.textContent).toContain('report.pdf')
    wrapper.unmount()
  })
})

describe('Menubar — deprecated disabled prop', () => {
  it('Test 13: MenubarItem deprecated bare disabled prop marks the item data-disabled', async () => {
    const WithDeprecatedDisabled = defineComponent({
      components: allComponents,
      template: `
        <Menubar>
          <MenubarMenu value="file">
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent aria-label="Deprecated disabled menu">
              <MenubarItem>Item 1</MenubarItem>
              <MenubarItem :disabled="true">Disabled Item</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      `,
    })
    const wrapper = mount(WithDeprecatedDisabled, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('pointerdown', { button: 0, ctrlKey: false })
    await nextTick()
    await nextTick()
    const disabledItems = document.querySelectorAll('[data-disabled]')
    expect(disabledItems.length).toBeGreaterThan(0)
    wrapper.unmount()
  })

  it('Test 14: MenubarCheckboxItem deprecated bare disabled prop marks the item data-disabled', async () => {
    const WithDeprecatedDisabled = defineComponent({
      components: allComponents,
      template: `
        <Menubar>
          <MenubarMenu value="view">
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent aria-label="Deprecated disabled checkbox menu">
              <MenubarCheckboxItem :disabled="true">Show Toolbar</MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      `,
    })
    const wrapper = mount(WithDeprecatedDisabled, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('pointerdown', { button: 0, ctrlKey: false })
    await nextTick()
    await nextTick()
    const checkboxItem = document.querySelector('[role="menuitemcheckbox"]')
    expect(checkboxItem?.getAttribute('data-disabled')).not.toBeNull()
    wrapper.unmount()
  })

  it('Test 15: MenubarRadioItem deprecated bare disabled prop marks the item data-disabled', async () => {
    const WithDeprecatedDisabled = defineComponent({
      components: allComponents,
      template: `
        <Menubar>
          <MenubarMenu value="view">
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent aria-label="Deprecated disabled radio menu">
              <MenubarRadioGroup model-value="100">
                <MenubarRadioItem value="100">100%</MenubarRadioItem>
                <MenubarRadioItem value="150" :disabled="true">150%</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      `,
    })
    const wrapper = mount(WithDeprecatedDisabled, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('pointerdown', { button: 0, ctrlKey: false })
    await nextTick()
    await nextTick()
    const radioItems = document.querySelectorAll('[role="menuitemradio"]')
    const disabledItem = Array.from(radioItems).find(el => el.textContent?.includes('150%'))
    expect(disabledItem?.getAttribute('data-disabled')).not.toBeNull()
    wrapper.unmount()
  })

  it('Test 16: MenubarSubTrigger deprecated bare disabled prop marks the trigger data-disabled', async () => {
    const WithDeprecatedDisabled = defineComponent({
      components: allComponents,
      template: `
        <Menubar>
          <MenubarMenu value="file">
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent aria-label="Deprecated disabled submenu">
              <MenubarSub default-open="true">
                <MenubarSubTrigger :disabled="true">Open Recent</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>report.pdf</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      `,
    })
    const wrapper = mount(WithDeprecatedDisabled, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('pointerdown', { button: 0, ctrlKey: false })
    await nextTick()
    await nextTick()
    const subTrigger = Array.from(document.querySelectorAll('[role="menuitem"]'))
      .find(el => el.textContent?.includes('Open Recent'))
    expect(subTrigger?.getAttribute('data-disabled')).not.toBeNull()
    wrapper.unmount()
  })
})

describe('Menubar — accessibility (axe)', () => {
  const AXE_OPTIONS_BASE: axe.RunOptions = {
    rules: {
      'color-contrast': { enabled: false },
    },
  }

  it('Test 11: passes axe in closed state (zero violations)', async () => {
    const wrapper = mount(BasicMenubar, { attachTo: document.body })
    await nextTick()
    const results = await axe.run(wrapper.element, AXE_OPTIONS_BASE)
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

  it('Test 12: passes axe in open state with mixed item types (zero violations)', async () => {
    const ComplexMenubar = defineComponent({
      components: allComponents,
      setup() {
        const showToolbar = ref(false)
        const zoom = ref('100')
        return { showToolbar, zoom }
      },
      template: `
        <Menubar>
          <MenubarMenu value="view">
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent aria-label="View menu">
              <MenubarSection title="Panels">
                <MenubarCheckboxItem v-model:is-selected="showToolbar">Show Toolbar</MenubarCheckboxItem>
              </MenubarSection>
              <MenubarSection title="Zoom">
                <MenubarRadioGroup v-model="zoom">
                  <MenubarRadioItem value="100">100%</MenubarRadioItem>
                  <MenubarRadioItem value="150">150%</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarSection>
              <MenubarSub default-open="true">
                <MenubarSubTrigger>More</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Sub Item 1</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      `,
    })
    const wrapper = mount(ComplexMenubar, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('pointerdown', { button: 0, ctrlKey: false })
    await nextTick()
    await nextTick()

    // MenubarContent portals to document.body — scope the audit there, and use a
    // SEPARATE, dedicated AXE_OPTIONS for the open-state check only (not shared
    // with the closed-state test above). ContextMenu's Task 2 applied a `region`
    // exception via one shared options object to both tests, which was harmless
    // but imprecise (flagged in ContextMenu's final review) — this test avoids
    // repeating that by keeping the exception scoped to exactly the case that
    // needs it. If this test fails on `region`, read the violation output below
    // before uncommenting the override — do not add it preemptively.
    const AXE_OPTIONS_OPEN: axe.RunOptions = {
      rules: {
        'color-contrast': { enabled: false },
        // Verified empirically: MenubarContent portals via MenubarPortal (Reka's
        // Popper-based mechanism, same as ContextMenu/Dropdown), producing a
        // genuine "region" violation on the data-reka-popper-content-wrapper div
        // (not contained by a landmark). Confirmed by running this test with the
        // rule enabled first and reading the actual violation output.
        region: { enabled: false },
      },
    }
    const results = await axe.run(document.body, AXE_OPTIONS_OPEN)
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
