import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import Modal from '../Modal.vue'
import ModalTrigger from '../ModalTrigger.vue'
import ModalContent from '../ModalContent.vue'
import ModalBody from '../ModalBody.vue'
import AlertDialog from '../../alert-dialog/AlertDialog.vue'
import AlertDialogTrigger from '../../alert-dialog/AlertDialogTrigger.vue'
import AlertDialogContent from '../../alert-dialog/AlertDialogContent.vue'

// Regression coverage for a bug where Modal, AlertDialog, and Drawer all
// rendered on the exact same static z-index tier (--z-modal-backdrop: 50,
// --z-modal: 100). Same-type nesting (Modal-over-Modal) happened to look
// correct because the newer panel, tied at the same z-index, painted after
// the older one in DOM order and geometrically covered it — but an
// AlertDialog opened over a Modal left the Modal's edges undimmed, since its
// own backdrop (z=50) sat below the Modal's panel (z=100) regardless of
// open order. See useOverlayLayer for the fix.
function mountModalWithAlertDialog() {
  return mount(
    defineComponent({
      components: { Modal, ModalTrigger, ModalContent, ModalBody, AlertDialog, AlertDialogTrigger, AlertDialogContent },
      template: `
        <Modal default-open>
          <ModalTrigger as-child><button>Open Modal</button></ModalTrigger>
          <ModalContent>
            <ModalBody>
              <AlertDialog>
                <AlertDialogTrigger as-child><button class="alert-trigger">Delete</button></AlertDialogTrigger>
                <AlertDialogContent>content</AlertDialogContent>
              </AlertDialog>
            </ModalBody>
          </ModalContent>
        </Modal>
      `,
    }),
    { attachTo: document.body },
  )
}

describe('Modal + AlertDialog stacking', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('gives the AlertDialog a higher z-index than the Modal beneath it, on both backdrop and panel', async () => {
    const wrapper = mountModalWithAlertDialog()
    await flushPromises()
    await nextTick()

    const modalContainer = document.body.querySelector('.modal__container') as HTMLElement
    expect(modalContainer).not.toBeNull()

    ;(document.body.querySelector('.alert-trigger') as HTMLElement).click()
    await flushPromises()
    await nextTick()

    const modalBackdrop = document.body.querySelector('.modal__backdrop') as HTMLElement
    const alertBackdrop = document.body.querySelector('.alert-dialog__backdrop') as HTMLElement
    const alertContainer = document.body.querySelector('.alert-dialog__container') as HTMLElement
    expect(alertBackdrop).not.toBeNull()
    expect(alertContainer).not.toBeNull()

    const modalPanelZ = Number(modalContainer.style.getPropertyValue('--z-modal'))
    const modalBackdropZ = Number(modalBackdrop.style.getPropertyValue('--z-modal-backdrop'))
    const alertBackdropZ = Number(alertBackdrop.style.getPropertyValue('--z-modal-backdrop'))
    const alertPanelZ = Number(alertContainer.style.getPropertyValue('--z-modal'))

    // The alert dialog's backdrop must outrank the modal's own panel —
    // otherwise the modal's panel paints through it wherever the (typically
    // smaller) alert dialog doesn't geometrically cover it.
    expect(alertBackdropZ).toBeGreaterThan(modalPanelZ)
    expect(alertPanelZ).toBeGreaterThan(alertBackdropZ)
    expect(modalPanelZ).toBeGreaterThan(modalBackdropZ)

    wrapper.unmount()
  })
})
