import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import axe from 'axe-core'
import Tooltip from '../Tooltip.vue'
import TooltipProvider from '../TooltipProvider.vue'
import TooltipTrigger from '../TooltipTrigger.vue'
import TooltipContent from '../TooltipContent.vue'

// Disable color-contrast: jsdom doesn't implement getComputedStyle with pseudo-elements.
// Disable region: portalled tooltip content lands directly in body, outside any landmark.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
    region: { enabled: false },
  },
}

describe('Tooltip axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(async () => {
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
    await nextTick()
  })

  it('passes axe audit in open state and content has role=tooltip', async () => {
    const wrapper = mount(
      defineComponent({
        components: { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent },
        template: `
          <TooltipProvider :delay-duration="0">
            <Tooltip :default-open="true">
              <TooltipTrigger as-child>
                <button aria-label="Show tooltip">Hover me</button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Tooltip description text</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    // Verify role=tooltip is present in DOM (Reka applies it to TooltipContent)
    const tooltipEl = document.body.querySelector('[role="tooltip"]')
    expect(tooltipEl).not.toBeNull()

    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })

  it('passes axe audit in closed state', async () => {
    const wrapper = mount(
      defineComponent({
        components: { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent },
        template: `
          <TooltipProvider :delay-duration="0">
            <Tooltip :default-open="false">
              <TooltipTrigger as-child>
                <button>Hover me</button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Tooltip description text</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
