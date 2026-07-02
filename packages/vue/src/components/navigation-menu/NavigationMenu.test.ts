import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import axe from 'axe-core'
import NavigationMenu from './NavigationMenu.vue'
import NavigationMenuList from './NavigationMenuList.vue'
import NavigationMenuItem from './NavigationMenuItem.vue'
import NavigationMenuTrigger from './NavigationMenuTrigger.vue'
import NavigationMenuContent from './NavigationMenuContent.vue'
import NavigationMenuLink from './NavigationMenuLink.vue'
import NavigationMenuViewport from './NavigationMenuViewport.vue'
import NavigationMenuIndicator from './NavigationMenuIndicator.vue'
import NavigationMenuSub from './NavigationMenuSub.vue'

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {}
})

const allComponents = {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  NavigationMenuSub,
}

const BasicNavigationMenu = defineComponent({
  components: allComponents,
  template: `
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/products/one">Product One</NavigationMenuLink>
            <NavigationMenuLink href="/products/two">Product Two</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="docs">
          <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  `,
})

describe('NavigationMenu — render', () => {
  it('Test 1: renders a nav element with one trigger and one plain link', () => {
    const wrapper = mount(BasicNavigationMenu, { attachTo: document.body })
    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.findAll('button').length).toBeGreaterThanOrEqual(1)
    const links = wrapper.findAll('a')
    expect(links.some(a => a.attributes('href') === '/docs')).toBe(true)
    wrapper.unmount()
  })

  it('Test 2: flyout content is hidden until its trigger is clicked', () => {
    const wrapper = mount(BasicNavigationMenu, { attachTo: document.body })
    expect(document.body.textContent).not.toContain('Product One')
    wrapper.unmount()
  })

  it('Test 3: clicking a trigger opens its flyout content', async () => {
    const wrapper = mount(BasicNavigationMenu, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('Product One')
    expect(document.body.textContent).toContain('Product Two')
    wrapper.unmount()
  })

  it('Test 4: trigger has aria-expanded reflecting open state', async () => {
    const wrapper = mount(BasicNavigationMenu, { attachTo: document.body })
    const trigger = wrapper.find('button')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    await trigger.trigger('click')
    await nextTick()
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })

  it('Test 5: clicking an open trigger again closes its flyout content', async () => {
    const wrapper = mount(BasicNavigationMenu, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('Product One')
    await trigger.trigger('click')
    await nextTick()
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})

describe('NavigationMenu — links', () => {
  it('Test 6: NavigationMenuLink renders a real anchor with the given href', () => {
    const wrapper = mount(BasicNavigationMenu, { attachTo: document.body })
    const docsLink = wrapper.findAll('a').find(a => a.text() === 'Docs')
    expect(docsLink).toBeDefined()
    expect(docsLink?.attributes('href')).toBe('/docs')
    wrapper.unmount()
  })

  it('Test 7: NavigationMenuLink with active prop sets data-active', () => {
    const WithActive = defineComponent({
      components: allComponents,
      template: `
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="docs">
              <NavigationMenuLink href="/docs" :active="true">Docs</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuViewport />
        </NavigationMenu>
      `,
    })
    const wrapper = mount(WithActive, { attachTo: document.body })
    const link = wrapper.find('a')
    expect(link.attributes('data-active')).toBeDefined()
    wrapper.unmount()
  })
})

describe('NavigationMenu — indicator and submenu', () => {
  it('Test 8: NavigationMenuIndicator renders inside the list once a trigger is open', async () => {
    const WithIndicator = defineComponent({
      components: allComponents,
      template: `
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="products">
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/products/one">Product One</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuIndicator />
          </NavigationMenuList>
          <NavigationMenuViewport />
        </NavigationMenu>
      `,
    })
    const wrapper = mount(WithIndicator, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await nextTick()
    await nextTick()
    // Indicator teleports into the List's own root element — assert an
    // element with data-state="visible" now exists somewhere in the list region.
    const indicatorEl = document.querySelector('[data-state="visible"][aria-hidden="true"]')
    expect(indicatorEl).not.toBeNull()
    wrapper.unmount()
  })

  it('Test 9: NavigationMenuSub renders a nested navigation menu', async () => {
    const WithSub = defineComponent({
      components: allComponents,
      template: `
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="products">
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuSub>
                  <NavigationMenuList>
                    <NavigationMenuItem value="sub-one">
                      <NavigationMenuLink href="/products/one">Sub Product One</NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenuSub>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuViewport />
        </NavigationMenu>
      `,
    })
    const wrapper = mount(WithSub, { attachTo: document.body })
    // NavigationMenuSub itself has no open/close gating of its own, but it is
    // nested inside NavigationMenuContent, which defaults unmountOnHide=true —
    // its children (including Sub) aren't in the tree until the parent
    // trigger is clicked open.
    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await nextTick()
    await nextTick()
    expect(wrapper.findComponent(NavigationMenuSub).exists()).toBe(true)
    wrapper.unmount()
  })
})

describe('NavigationMenu — accessibility (axe)', () => {
  const AXE_OPTIONS_BASE: axe.RunOptions = {
    rules: {
      'color-contrast': { enabled: false },
    },
  }

  it('Test 10: passes axe in closed state (zero violations)', async () => {
    const wrapper = mount(BasicNavigationMenu, { attachTo: document.body })
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

  it('Test 11: passes axe in open state with flyout content visible (zero violations)', async () => {
    const wrapper = mount(BasicNavigationMenu, { attachTo: document.body })
    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('Product One')

    // NavigationMenuContent always teleports (to the Viewport, present in this
    // test, or to document.body otherwise) — scope the audit there, via a
    // SEPARATE, dedicated AXE_OPTIONS for the open-state check only (not shared
    // with the closed-state test above), per this plan's explicit constraint
    // to avoid the over-broad-exception imprecision flagged in ContextMenu's
    // final review. If this test fails on `region`, read the violation output
        // below before uncommenting the override — do not add it preemptively.
    const AXE_OPTIONS_OPEN: axe.RunOptions = {
      rules: {
        'color-contrast': { enabled: false },
        // region: { enabled: false },
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
