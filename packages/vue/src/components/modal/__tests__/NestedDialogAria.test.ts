import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import Modal from '../Modal.vue'
import ModalContent from '../ModalContent.vue'
import ModalTitle from '../ModalTitle.vue'
import ModalHeader from '../ModalHeader.vue'
import ModalBody from '../ModalBody.vue'
import AlertDialog from '../../alert-dialog/AlertDialog.vue'
import AlertDialogContent from '../../alert-dialog/AlertDialogContent.vue'
import AlertDialogTitle from '../../alert-dialog/AlertDialogTitle.vue'

// A dialog opened over another must not sit inside an aria-hidden subtree.
// Regression: the per-dialog wrapper div was teleported to <body> while the
// dialog was still closed, so the outer dialog's hideOthers() marked it
// aria-hidden — and the inner dialog later opened inside it, still hidden.

function hiddenAncestor(el: Element | null): Element | null {
  for (let n = el; n; n = n.parentElement) {
    if (n.getAttribute('aria-hidden') === 'true') return n
  }
  return null
}

async function settle() {
  await flushPromises()
  await nextTick()
  await new Promise(r => setTimeout(r, 0))
  await flushPromises()
}

function mountSiblings(inner: 'modal' | 'alert') {
  const outer = ref(false)
  const innerOpen = ref(false)
  const w = mount(defineComponent({
    components: { Modal, ModalContent, ModalTitle, ModalHeader, ModalBody, AlertDialog, AlertDialogContent, AlertDialogTitle },
    setup: () => ({ outer, innerOpen }),
    template: `
      <div>
        <Modal v-model:open="outer">
          <ModalContent>
            <ModalHeader><ModalTitle>Outer</ModalTitle></ModalHeader>
            <ModalBody>outer body</ModalBody>
          </ModalContent>
        </Modal>
        <Modal v-if="'${inner}' === 'modal'" v-model:open="innerOpen">
          <ModalContent class="inner-dialog">
            <ModalHeader><ModalTitle>Inner</ModalTitle></ModalHeader>
            <ModalBody>inner body</ModalBody>
          </ModalContent>
        </Modal>
        <AlertDialog v-else v-model:open="innerOpen">
          <AlertDialogContent class="inner-dialog">
            <AlertDialogTitle>Inner</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    `,
  }), { attachTo: document.body })
  return { w, outer, innerOpen }
}

describe('nested dialogs stay visible to assistive tech', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it.each(['modal', 'alert'] as const)('a %s opened over an open Modal is not aria-hidden', async (kind) => {
    const { w, outer, innerOpen } = mountSiblings(kind)
    await settle()
    outer.value = true
    await settle()
    innerOpen.value = true
    await settle()
    const inner = document.querySelector('.inner-dialog')
    expect(inner).not.toBeNull()
    expect(hiddenAncestor(inner)).toBeNull()
    w.unmount()
  })

  it('a closed Modal leaves no wrapper element in <body>', async () => {
    const { w } = mountSiblings('modal')
    await settle()
    expect(document.querySelector('.modal__portal')).toBeNull()
    w.unmount()
  })

  it('a closed AlertDialog leaves no wrapper element in <body>', async () => {
    const { w } = mountSiblings('alert')
    await settle()
    expect(document.querySelector('.alert-dialog__container')).toBeNull()
    w.unmount()
  })

  it('removes the Modal wrapper again after closing', async () => {
    const { w, outer } = mountSiblings('modal')
    outer.value = true
    await settle()
    expect(document.querySelector('.modal__portal')).not.toBeNull()
    outer.value = false
    await settle()
    await new Promise(r => setTimeout(r, 50))
    await settle()
    expect(document.querySelector('.modal__portal')).toBeNull()
    w.unmount()
  })
})
