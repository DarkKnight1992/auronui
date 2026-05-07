import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import axe from 'axe-core'
import Popover from '../Popover.vue'
import PopoverTrigger from '../PopoverTrigger.vue'
import PopoverContent from '../PopoverContent.vue'
import PopoverClose from '../PopoverClose.vue'

// jsdom does not implement getComputedStyle with pseudo-elements or HTMLCanvasElement.getContext,
// which causes axe color-contrast checks to throw. Disable them for unit tests.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
}

describe('Popover axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(async () => {
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
    await nextTick()
  })

  it('passes axe audit in open state', async () => {
    // Use asChild on PopoverTrigger to avoid nested-interactive (<button> inside <button>).
    // Reka renders PopoverTrigger as <button> by default; asChild merges it onto the child.
    const wrapper = mount(
      defineComponent({
        components: { Popover, PopoverTrigger, PopoverContent },
        template: `
          <Popover :default-open="true">
            <PopoverTrigger as-child>
              <button>Open Popover</button>
            </PopoverTrigger>
            <PopoverContent>
              <div>
                <h2>Popover Title</h2>
                <p>This is the popover description text.</p>
              </div>
            </PopoverContent>
          </Popover>
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
        components: { Popover, PopoverTrigger, PopoverContent },
        template: `
          <Popover :default-open="false">
            <PopoverTrigger as-child>
              <button>Open Popover</button>
            </PopoverTrigger>
            <PopoverContent>
              <div>
                <h2>Popover Title</h2>
                <p>This is the popover description text.</p>
              </div>
            </PopoverContent>
          </Popover>
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

  it('passes axe audit with close button inside popover', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Popover, PopoverTrigger, PopoverContent, PopoverClose },
        template: `
          <Popover :default-open="true">
            <PopoverTrigger as-child>
              <button>Open Popover</button>
            </PopoverTrigger>
            <PopoverContent>
              <div>
                <h2>Popover Title</h2>
                <p>Content here.</p>
                <PopoverClose as-child>
                  <button>Close</button>
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>
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
