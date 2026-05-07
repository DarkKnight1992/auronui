import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { Tabs, TabList, Tab, TabPanel, TabIndicator } from '../index'

describe('Tabs axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []
  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  async function run(props: Record<string, unknown> = {}) {
    const w = mount({
      components: { Tabs, TabList, Tab, TabPanel, TabIndicator },
      template: `
        <Tabs default-value="one" v-bind="$attrs">
          <TabList>
            <Tab value="one">One</Tab>
            <Tab value="two">Two</Tab>
            <TabIndicator />
          </TabList>
          <TabPanel value="one">Panel One</TabPanel>
          <TabPanel value="two">Panel Two</TabPanel>
        </Tabs>
      `,
    }, { attachTo: document.body, attrs: props })
    wrappers.push(w)
    const results = await axe.run(w.element as HTMLElement)
    expect(results.violations).toEqual([])
  }

  it('horizontal primary tabs pass axe', async () => { await run() })
  it('vertical tabs pass axe', async () => { await run({ orientation: 'vertical' }) })
  it('secondary variant tabs pass axe', async () => { await run({ variant: 'secondary' }) })
})
