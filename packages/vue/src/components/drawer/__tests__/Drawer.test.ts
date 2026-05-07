import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Drawer from '../Drawer.vue'
import DrawerTrigger from '../DrawerTrigger.vue'
import DrawerContent from '../DrawerContent.vue'
import DrawerHeader from '../DrawerHeader.vue'
import DrawerBody from '../DrawerBody.vue'
import DrawerFooter from '../DrawerFooter.vue'
import DrawerClose from '../DrawerClose.vue'

// Helper: mount a full Drawer compound in document.body
function mountDrawer(defaultOpen = false, placement: 'top' | 'right' | 'bottom' | 'left' = 'right') {
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
      },
      props: {
        defaultOpen: { type: Boolean, default: false },
        placement: { type: String, default: 'right' },
      },
      template: `
        <Drawer :default-open="defaultOpen" :placement="placement">
          <DrawerTrigger as-child>
            <button class="drawer-trigger">Open Drawer</button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <h2 class="drawer-title">Test Drawer</h2>
            </DrawerHeader>
            <DrawerBody>
              <div class="drawer-body-content">Drawer content here.</div>
            </DrawerBody>
            <DrawerFooter>
              <DrawerClose as-child>
                <button class="drawer-close-btn">Close</button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      `,
    }),
    {
      attachTo: document.body,
      props: { defaultOpen, placement },
    },
  )
  return wrapper
}

describe('Drawer', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(async () => {
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
    await nextTick()
  })

  it('does not render DrawerContent in DOM when closed by default', async () => {
    const wrapper = mountDrawer(false)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    // When closed, AnimatePresence v-if is false so motion.div is not rendered
    const content = document.body.querySelector('.drawer-body-content')
    expect(content).toBeNull()
  })

  it('renders DrawerContent in DOM when defaultOpen=true', async () => {
    const wrapper = mountDrawer(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.drawer-body-content')
    expect(content).not.toBeNull()
  })

  it('clicking DrawerTrigger opens the drawer', async () => {
    const wrapper = mountDrawer(false)
    wrappers.push(wrapper)
    await flushPromises()

    // Confirm closed
    expect(document.body.querySelector('.drawer-body-content')).toBeNull()

    const trigger = document.body.querySelector('.drawer-trigger') as HTMLElement
    expect(trigger).not.toBeNull()
    trigger.click()
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.drawer-body-content')
    expect(content).not.toBeNull()
  })

  it('pressing Escape closes an open drawer', async () => {
    const wrapper = mountDrawer(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    // Verify it's open
    expect(document.body.querySelector('.drawer-body-content')).not.toBeNull()

    // Dispatch Escape on the dialog content element (Reka UI listens for it)
    const dialogEl = document.body.querySelector('[role="dialog"]') as HTMLElement
    if (dialogEl) {
      dialogEl.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }))
    } else {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }))
    }
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.drawer-body-content')
    expect(content).toBeNull()
  })

  it('DrawerClose button closes the drawer', async () => {
    const wrapper = mountDrawer(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    // Drawer should be open
    expect(document.body.querySelector('.drawer-body-content')).not.toBeNull()

    // Click the close button inside the drawer (portalled to body)
    const closeBtn = document.body.querySelector('.drawer-close-btn') as HTMLElement
    expect(closeBtn).not.toBeNull()
    closeBtn.click()
    await flushPromises()
    await nextTick()

    expect(document.body.querySelector('.drawer-body-content')).toBeNull()
  })

  it('v-model:open binding reflects open/close state changes', async () => {
    const openState = ref(false)
    const wrapper = mount(
      defineComponent({
        components: { Drawer, DrawerTrigger, DrawerContent, DrawerBody },
        setup() {
          return { openState }
        },
        template: `
          <Drawer v-model:open="openState">
            <DrawerTrigger as-child>
              <button class="drawer-trigger">Toggle</button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerBody>
                <div class="drawer-body-content">Content</div>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()

    expect(openState.value).toBe(false)

    // Click to open
    const trigger = document.body.querySelector('.drawer-trigger') as HTMLElement
    trigger.click()
    await flushPromises()
    await nextTick()
    expect(openState.value).toBe(true)
  })

  it('placement="right" applies right placement CSS class', async () => {
    const wrapper = mountDrawer(true, 'right')
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const contentEl = document.body.querySelector('[data-placement="right"]')
    expect(contentEl).not.toBeNull()
  })

  it('placement="left" applies left placement CSS class', async () => {
    const wrapper = mountDrawer(true, 'left')
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const contentEl = document.body.querySelector('[data-placement="left"]')
    expect(contentEl).not.toBeNull()
  })

  it('placement="top" applies top placement CSS class', async () => {
    const wrapper = mountDrawer(true, 'top')
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const contentEl = document.body.querySelector('[data-placement="top"]')
    expect(contentEl).not.toBeNull()
  })

  it('placement="bottom" applies bottom placement CSS class', async () => {
    const wrapper = mountDrawer(true, 'bottom')
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const contentEl = document.body.querySelector('[data-placement="bottom"]')
    expect(contentEl).not.toBeNull()
  })
})
