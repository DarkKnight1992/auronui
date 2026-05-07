import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { Tabs, TabList, Tab, TabPanel, TabIndicator } from '../index'

const wrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  wrappers.forEach(w => w.unmount())
  wrappers.length = 0
})

function makeHarness(props: Record<string, unknown> = {}) {
  const w = mount({
    components: { Tabs, TabList, Tab, TabPanel, TabIndicator },
    props: ['modelValue', 'orientation', 'variant', 'defaultValue'],
    template: `
      <Tabs
        :model-value="modelValue"
        :default-value="defaultValue"
        :orientation="orientation"
        :variant="variant"
      >
        <TabList>
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
          <Tab value="three" disabled>Three</Tab>
          <TabIndicator />
        </TabList>
        <TabPanel value="one">Panel One</TabPanel>
        <TabPanel value="two">Panel Two</TabPanel>
        <TabPanel value="three">Panel Three</TabPanel>
      </Tabs>
    `,
  }, { props, attachTo: document.body })
  wrappers.push(w)
  return w
}

describe('Tabs', () => {
  it('applies base "tabs" class by default', () => {
    const w = makeHarness({ defaultValue: 'one' })
    expect(w.find('.tabs').exists()).toBe(true)
  })

  it('renders TabsList with tabs__list class', () => {
    const w = makeHarness({ defaultValue: 'one' })
    expect(w.find('.tabs__list').exists()).toBe(true)
  })

  it('renders TabsTrigger elements with tabs__tab class', () => {
    const w = makeHarness({ defaultValue: 'one' })
    expect(w.findAll('.tabs__tab').length).toBe(3)
  })

  it('TabIndicator component is present in the component tree', () => {
    // Reka UI TabsIndicator only renders in real browsers (requires offsetWidth layout).
    // In jsdom it renders as <!--v-if-->, so we verify via the Vue component tree.
    const w = makeHarness({ defaultValue: 'one' })
    expect(w.findComponent(TabIndicator).exists()).toBe(true)
  })

  it('variant="secondary" applies tabs--secondary modifier', () => {
    const w = makeHarness({ defaultValue: 'one', variant: 'secondary' })
    expect(w.find('.tabs--secondary').exists()).toBe(true)
  })

  it('orientation="vertical" sets data-orientation attribute', () => {
    const w = makeHarness({ defaultValue: 'one', orientation: 'vertical' })
    expect(w.find('[data-orientation="vertical"]').exists()).toBe(true)
  })

  it('selected panel by defaultValue is rendered', () => {
    const w = makeHarness({ defaultValue: 'two' })
    expect(w.text()).toContain('Panel Two')
  })

  it('disabled Tab has data-disabled attribute from Reka UI', () => {
    const w = makeHarness({ defaultValue: 'one' })
    const triggers = w.findAll('.tabs__tab')
    // Third trigger (value="three") is disabled
    expect(triggers[2].attributes('data-disabled')).toBeDefined()
  })
})
