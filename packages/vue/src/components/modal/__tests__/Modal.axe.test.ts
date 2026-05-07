import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import axe from 'axe-core'
import Modal from '../Modal.vue'
import ModalTrigger from '../ModalTrigger.vue'
import ModalContent from '../ModalContent.vue'
import ModalHeader from '../ModalHeader.vue'
import ModalBody from '../ModalBody.vue'
import ModalFooter from '../ModalFooter.vue'
import ModalTitle from '../ModalTitle.vue'
import ModalDescription from '../ModalDescription.vue'
import ModalClose from '../ModalClose.vue'

// jsdom does not implement getComputedStyle with pseudo-elements or color-contrast,
// which causes axe color-contrast checks to throw. Disable them for unit tests.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
}

describe('Modal axe audit', () => {
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
          Modal,
          ModalTrigger,
          ModalContent,
          ModalHeader,
          ModalBody,
          ModalFooter,
          ModalTitle,
          ModalDescription,
          ModalClose,
        },
        template: `
          <Modal :default-open="true">
            <ModalTrigger as-child>
              <button>Open Modal</button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Accessible Modal</ModalTitle>
                <ModalDescription>This is a description for the modal dialog.</ModalDescription>
              </ModalHeader>
              <ModalBody>
                <p>Modal body content goes here.</p>
              </ModalBody>
              <ModalFooter>
                <ModalClose as-child>
                  <button>Close</button>
                </ModalClose>
              </ModalFooter>
            </ModalContent>
          </Modal>
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

  it('has role="dialog" and is accessible (aria-labelledby wired) when open', async () => {
    // Note: Reka UI's DialogContent uses aria-hidden + useHideOthers for modal inertness
    // rather than aria-modal="true". The dialog is made accessible via aria-labelledby.
    const wrapper = mount(
      defineComponent({
        components: { Modal, ModalTrigger, ModalContent, ModalTitle, ModalBody },
        template: `
          <Modal :default-open="true">
            <ModalTrigger as-child>
              <button>Open Modal</button>
            </ModalTrigger>
            <ModalContent>
              <ModalTitle>Dialog Title</ModalTitle>
              <ModalBody>
                <p>Content</p>
              </ModalBody>
            </ModalContent>
          </Modal>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const dialogEl = document.body.querySelector('[role="dialog"]')
    expect(dialogEl).not.toBeNull()
    // Reka UI wires aria-labelledby to DialogTitle automatically
    const labelledById = dialogEl?.getAttribute('aria-labelledby')
    expect(labelledById).toBeTruthy()
    // The referenced element should exist in DOM when open
    const titleEl = document.getElementById(labelledById!)
    expect(titleEl).not.toBeNull()
    expect(titleEl?.textContent).toBe('Dialog Title')
  })

  it('passes axe audit when closed', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Modal, ModalTrigger, ModalContent, ModalTitle, ModalBody },
        template: `
          <Modal :default-open="false">
            <ModalTrigger as-child>
              <button>Open Modal</button>
            </ModalTrigger>
            <ModalContent>
              <ModalTitle>Dialog Title</ModalTitle>
              <ModalBody>
                <p>Content</p>
              </ModalBody>
            </ModalContent>
          </Modal>
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
