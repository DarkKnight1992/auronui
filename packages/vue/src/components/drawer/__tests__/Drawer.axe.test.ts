import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import axe from 'axe-core'
import Drawer from '../Drawer.vue'
import DrawerTrigger from '../DrawerTrigger.vue'
import DrawerContent from '../DrawerContent.vue'
import DrawerHeader from '../DrawerHeader.vue'
import DrawerBody from '../DrawerBody.vue'
import DrawerFooter from '../DrawerFooter.vue'
import DrawerClose from '../DrawerClose.vue'
import DrawerTitle from '../DrawerTitle.vue'

// jsdom does not implement getComputedStyle with pseudo-elements or color-contrast,
// which causes axe color-contrast checks to throw. Disable them for unit tests.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
}

describe('Drawer axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(async () => {
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
    await nextTick()
  })

  it('passes axe audit when open with full structure', async () => {
    const wrapper = mount(
      defineComponent({
        components: {
          Drawer,
          DrawerTrigger,
          DrawerContent,
          DrawerHeader,
          DrawerBody,
          DrawerFooter,
          DrawerClose,
          DrawerTitle,
        },
        template: `
          <Drawer :default-open="true">
            <DrawerTrigger as-child>
              <button>Open Drawer</button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Accessible Drawer</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <p>Drawer body content goes here.</p>
              </DrawerBody>
              <DrawerFooter>
                <DrawerClose as-child>
                  <button>Close</button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
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

  it('has role="dialog" present when open', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Drawer, DrawerTrigger, DrawerContent, DrawerBody, DrawerTitle },
        template: `
          <Drawer :default-open="true">
            <DrawerTrigger as-child>
              <button>Open Drawer</button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerBody>
                <p>Content</p>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const dialogEl = document.body.querySelector('[role="dialog"]')
    expect(dialogEl).not.toBeNull()
  })

  it('passes axe audit when closed', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Drawer, DrawerTrigger, DrawerContent, DrawerBody, DrawerTitle },
        template: `
          <Drawer :default-open="false">
            <DrawerTrigger as-child>
              <button>Open Drawer</button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerBody>
                <p>Content</p>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
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
