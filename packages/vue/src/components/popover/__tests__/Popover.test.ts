import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Popover from '../Popover.vue'
import PopoverTrigger from '../PopoverTrigger.vue'
import PopoverContent from '../PopoverContent.vue'
import PopoverClose from '../PopoverClose.vue'

// Helper: mount a full Popover compound in document.body
function mountPopover(defaultOpen = false) {
  const wrapper = mount(
    defineComponent({
      components: { Popover, PopoverTrigger, PopoverContent },
      props: {
        defaultOpen: { type: Boolean, default: false },
      },
      template: `
        <Popover :default-open="defaultOpen">
          <PopoverTrigger>
            <button>Open Popover</button>
          </PopoverTrigger>
          <PopoverContent>
            <div class="popover-body">
              <h2>Popover Title</h2>
              <p>Popover content here.</p>
            </div>
          </PopoverContent>
        </Popover>
      `,
    }),
    {
      attachTo: document.body,
      props: { defaultOpen },
    },
  )
  return wrapper
}

describe('Popover', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(async () => {
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
    // Clean up any portal content left in body
    document.body.innerHTML = ''
    await nextTick()
  })

  it('does not render PopoverContent in DOM when closed by default', async () => {
    const wrapper = mountPopover(false)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    // When closed, AnimatePresence v-if is false so motion.div is not in DOM
    const content = document.body.querySelector('.popover-body')
    expect(content).toBeNull()
  })

  it('renders PopoverContent in DOM when defaultOpen=true', async () => {
    const wrapper = mountPopover(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.popover-body')
    expect(content).not.toBeNull()
  })

  it('clicking PopoverTrigger opens the popover content', async () => {
    const wrapper = mountPopover(false)
    wrappers.push(wrapper)
    await flushPromises()

    // Confirm closed
    expect(document.body.querySelector('.popover-body')).toBeNull()

    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.popover-body')
    expect(content).not.toBeNull()
  })

  it('pressing Escape closes an open popover', async () => {
    const wrapper = mountPopover(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    // Verify it's open
    expect(document.body.querySelector('.popover-body')).not.toBeNull()

    // Find the popover content element and dispatch Escape on it
    // Reka UI PopoverContent listens for escape-key-down on the content root
    const popoverContentEl = document.body.querySelector('[data-state]') as HTMLElement
    if (popoverContentEl) {
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      })
      popoverContentEl.dispatchEvent(escapeEvent)
    } else {
      // Fallback: dispatch on document
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }))
    }
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.popover-body')
    expect(content).toBeNull()
  })

  it('v-model:open binding reflects open/close state changes', async () => {
    const openState = ref(false)
    const wrapper = mount(
      defineComponent({
        components: { Popover, PopoverTrigger, PopoverContent },
        setup() {
          return { openState }
        },
        template: `
          <Popover v-model:open="openState">
            <PopoverTrigger>
              <button>Toggle</button>
            </PopoverTrigger>
            <PopoverContent>
              <div class="popover-body">Content</div>
            </PopoverContent>
          </Popover>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()

    expect(openState.value).toBe(false)

    // Click to open
    await wrapper.find('button').trigger('click')
    await flushPromises()
    await nextTick()
    expect(openState.value).toBe(true)

    // Click trigger again to close (toggle)
    await wrapper.find('button').trigger('click')
    await flushPromises()
    await nextTick()
    expect(openState.value).toBe(false)
  })

  it('PopoverClose button closes the popover', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Popover, PopoverTrigger, PopoverContent, PopoverClose },
        template: `
          <Popover :default-open="true">
            <PopoverTrigger>
              <button>Open</button>
            </PopoverTrigger>
            <PopoverContent>
              <div class="popover-body">
                <p>Content</p>
                <PopoverClose>
                  <button class="close-btn">Close</button>
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

    // Popover should be open
    expect(document.body.querySelector('.popover-body')).not.toBeNull()

    // Click the close button inside the popover (portalled to body)
    const closeBtn = document.body.querySelector('.close-btn') as HTMLElement
    expect(closeBtn).not.toBeNull()
    closeBtn.click()
    await flushPromises()
    await nextTick()

    expect(document.body.querySelector('.popover-body')).toBeNull()
  })
})
