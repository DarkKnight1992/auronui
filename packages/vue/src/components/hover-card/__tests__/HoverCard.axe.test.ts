import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import axe from 'axe-core'
import HoverCard from '../HoverCard.vue'
import HoverCardTrigger from '../HoverCardTrigger.vue'
import HoverCardContent from '../HoverCardContent.vue'

// Disable color-contrast: jsdom doesn't implement getComputedStyle with pseudo-elements.
// Disable region: portalled hover card content lands directly in body, outside any landmark.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
    region: { enabled: false },
  },
}

describe('HoverCard axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(async () => {
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
    await nextTick()
  })

  it('passes axe audit in open state', async () => {
    const wrapper = mount(
      defineComponent({
        components: { HoverCard, HoverCardTrigger, HoverCardContent },
        template: `
          <HoverCard :default-open="true">
            <HoverCardTrigger as-child>
              <a href="#profile">@auronui</a>
            </HoverCardTrigger>
            <HoverCardContent>
              <div>
                <h2>Auron UI</h2>
                <p>Vue 3 component library.</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })

  it('passes axe audit in closed state', async () => {
    const wrapper = mount(
      defineComponent({
        components: { HoverCard, HoverCardTrigger, HoverCardContent },
        template: `
          <HoverCard :default-open="false">
            <HoverCardTrigger as-child>
              <a href="#profile">@auronui</a>
            </HoverCardTrigger>
            <HoverCardContent>
              <div>
                <h2>Auron UI</h2>
                <p>Vue 3 component library.</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })
})
