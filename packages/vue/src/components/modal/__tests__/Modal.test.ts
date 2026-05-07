import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Modal from '../Modal.vue'
import ModalTrigger from '../ModalTrigger.vue'
import ModalContent from '../ModalContent.vue'
import ModalHeader from '../ModalHeader.vue'
import ModalBody from '../ModalBody.vue'
import ModalFooter from '../ModalFooter.vue'
import ModalTitle from '../ModalTitle.vue'
import ModalClose from '../ModalClose.vue'

// Helper: mount a full Modal compound in document.body
function mountModal(defaultOpen = false) {
  const wrapper = mount(
    defineComponent({
      components: {
        Modal,
        ModalTrigger,
        ModalContent,
        ModalHeader,
        ModalBody,
        ModalFooter,
        ModalTitle,
        ModalClose,
      },
      props: {
        defaultOpen: { type: Boolean, default: false },
      },
      template: `
        <Modal :default-open="defaultOpen">
          <ModalTrigger as-child>
            <button class="modal-trigger">Open Modal</button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Test Modal</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div class="modal-body-content">Modal content here.</div>
            </ModalBody>
            <ModalFooter>
              <ModalClose as-child>
                <button class="modal-close-btn">Close</button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      `,
    }),
    {
      attachTo: document.body,
      props: { defaultOpen },
    },
  )
  return wrapper
}

describe('Modal', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(async () => {
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
    await nextTick()
  })

  it('does not render ModalContent in DOM when closed by default', async () => {
    const wrapper = mountModal(false)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    // When closed, AnimatePresence v-if is false so motion.div is not rendered
    const content = document.body.querySelector('.modal-body-content')
    expect(content).toBeNull()
  })

  it('renders ModalContent in DOM when defaultOpen=true', async () => {
    const wrapper = mountModal(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.modal-body-content')
    expect(content).not.toBeNull()
  })

  it('clicking ModalTrigger opens the modal', async () => {
    const wrapper = mountModal(false)
    wrappers.push(wrapper)
    await flushPromises()

    // Confirm closed
    expect(document.body.querySelector('.modal-body-content')).toBeNull()

    const trigger = document.body.querySelector('.modal-trigger') as HTMLElement
    expect(trigger).not.toBeNull()
    trigger.click()
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.modal-body-content')
    expect(content).not.toBeNull()
  })

  it('pressing Escape closes an open modal', async () => {
    const wrapper = mountModal(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    // Verify it's open
    expect(document.body.querySelector('.modal-body-content')).not.toBeNull()

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

    const content = document.body.querySelector('.modal-body-content')
    expect(content).toBeNull()
  })

  it('v-model:open binding reflects open/close state changes', async () => {
    const openState = ref(false)
    const wrapper = mount(
      defineComponent({
        components: { Modal, ModalTrigger, ModalContent, ModalBody },
        setup() {
          return { openState }
        },
        template: `
          <Modal v-model:open="openState">
            <ModalTrigger as-child>
              <button class="modal-trigger">Toggle</button>
            </ModalTrigger>
            <ModalContent>
              <ModalBody>
                <div class="modal-body-content">Content</div>
              </ModalBody>
            </ModalContent>
          </Modal>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()

    expect(openState.value).toBe(false)

    // Click to open
    const trigger = document.body.querySelector('.modal-trigger') as HTMLElement
    trigger.click()
    await flushPromises()
    await nextTick()
    expect(openState.value).toBe(true)
  })

  it('ModalClose button closes the modal', async () => {
    const wrapper = mountModal(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    // Modal should be open
    expect(document.body.querySelector('.modal-body-content')).not.toBeNull()

    // Click the close button inside the modal (portalled to body)
    const closeBtn = document.body.querySelector('.modal-close-btn') as HTMLElement
    expect(closeBtn).not.toBeNull()
    closeBtn.click()
    await flushPromises()
    await nextTick()

    expect(document.body.querySelector('.modal-body-content')).toBeNull()
  })

  it('focus is inside modal content after opening', async () => {
    const wrapper = mountModal(false)
    wrappers.push(wrapper)
    await flushPromises()

    const trigger = document.body.querySelector('.modal-trigger') as HTMLElement
    trigger.click()
    await flushPromises()
    await nextTick()
    // Give focus trap time to engage
    await new Promise((r) => setTimeout(r, 50))

    // Focus should be trapped inside the dialog
    const dialogEl = document.body.querySelector('[role="dialog"]') as HTMLElement
    expect(dialogEl).not.toBeNull()
    // After opening, focus should be within the dialog element
    const focused = document.activeElement
    expect(dialogEl.contains(focused)).toBe(true)
  })
})
