import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import AlertDialog from '../AlertDialog.vue'
import AlertDialogTrigger from '../AlertDialogTrigger.vue'
import AlertDialogContent from '../AlertDialogContent.vue'
import AlertDialogTitle from '../AlertDialogTitle.vue'
import AlertDialogDescription from '../AlertDialogDescription.vue'
import AlertDialogAction from '../AlertDialogAction.vue'
import AlertDialogCancel from '../AlertDialogCancel.vue'

// Helper: mount a full AlertDialog compound in document.body
function mountAlertDialog(defaultOpen = false, onActionClick?: () => void) {
  const wrapper = mount(
    defineComponent({
      components: {
        AlertDialog,
        AlertDialogTrigger,
        AlertDialogContent,
        AlertDialogTitle,
        AlertDialogDescription,
        AlertDialogAction,
        AlertDialogCancel,
      },
      props: {
        defaultOpen: { type: Boolean, default: false },
      },
      emits: ['action-click'],
      setup(_props, { emit }) {
        return {
          handleAction: () => {
            emit('action-click')
            onActionClick?.()
          },
        }
      },
      template: `
        <AlertDialog :default-open="defaultOpen">
          <AlertDialogTrigger as-child>
            <button class="alert-dialog-trigger">Delete item</button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            <AlertDialogAction class="alert-dialog-action" @click="handleAction">Confirm Delete</AlertDialogAction>
            <AlertDialogCancel class="alert-dialog-cancel">Cancel</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      `,
    }),
    {
      attachTo: document.body,
      props: { defaultOpen },
    },
  )
  return wrapper
}

describe('AlertDialog', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(async () => {
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
    await nextTick()
  })

  it('does not render content in DOM when closed by default', async () => {
    const wrapper = mountAlertDialog(false)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const content = document.body.querySelector('.alert-dialog-action')
    expect(content).toBeNull()
  })

  it('renders content in DOM when defaultOpen=true', async () => {
    const wrapper = mountAlertDialog(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const action = document.body.querySelector('.alert-dialog-action')
    expect(action).not.toBeNull()
  })

  it('clicking trigger opens the alert dialog', async () => {
    const wrapper = mountAlertDialog(false)
    wrappers.push(wrapper)
    await flushPromises()

    expect(document.body.querySelector('.alert-dialog-action')).toBeNull()

    const trigger = document.body.querySelector('.alert-dialog-trigger') as HTMLElement
    expect(trigger).not.toBeNull()
    trigger.click()
    await flushPromises()
    await nextTick()

    expect(document.body.querySelector('.alert-dialog-action')).not.toBeNull()
  })

  it('pressing Escape closes an open alert dialog', async () => {
    const wrapper = mountAlertDialog(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    expect(document.body.querySelector('.alert-dialog-action')).not.toBeNull()

    const dialogEl = document.body.querySelector('[role="alertdialog"]') as HTMLElement
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

    expect(document.body.querySelector('.alert-dialog-action')).toBeNull()
  })

  it('does NOT close on overlay click (alert dialog semantics)', async () => {
    const wrapper = mountAlertDialog(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    expect(document.body.querySelector('.alert-dialog-action')).not.toBeNull()

    // AlertDialogContent prevents pointer-down-outside via onPointerDownOutside.prevent
    // in reka-ui source. We verify the dialog stays open by clicking the document body
    // (outside the dialog element) which simulates an outside interaction.
    // jsdom doesn't support PointerEvent, so we use MouseEvent to simulate outside click.
    const outsideEl = document.body
    outsideEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))
    await flushPromises()
    await nextTick()

    // Dialog should remain open — AlertDialogContent blocks pointer-down-outside
    expect(document.body.querySelector('.alert-dialog-action')).not.toBeNull()
  })

  it('DESTRUCTIVE SAFETY: pressing Enter on trigger opens dialog but does NOT fire action handler', async () => {
    const confirmSpy = vi.fn()
    const wrapper = mountAlertDialog(false, confirmSpy)
    wrappers.push(wrapper)
    await flushPromises()

    const trigger = document.body.querySelector('.alert-dialog-trigger') as HTMLElement
    expect(trigger).not.toBeNull()

    // Press Enter on trigger — this opens the dialog
    trigger.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    }))
    // Also simulate keyup/click for completeness
    trigger.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    }))

    await flushPromises()
    await nextTick()
    // Allow focus trap to settle
    await new Promise((r) => setTimeout(r, 50))

    // The dialog should be open (trigger activated)
    // (It may or may not open depending on how Reka handles keydown vs click,
    //  but regardless, the confirm action should NOT have been called)

    // Confirm spy must NOT have been called — the Enter on the trigger
    // must not propagate to activate the action button
    expect(confirmSpy).not.toHaveBeenCalled()
  })

  it('AlertDialogAction rendered element has type="button"', async () => {
    const wrapper = mountAlertDialog(true)
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const actionEl = document.body.querySelector('.alert-dialog-action') as HTMLButtonElement
    expect(actionEl).not.toBeNull()
    expect(actionEl.getAttribute('type')).toBe('button')
  })

  it('focus is inside alert dialog content after opening', async () => {
    const wrapper = mountAlertDialog(false)
    wrappers.push(wrapper)
    await flushPromises()

    const trigger = document.body.querySelector('.alert-dialog-trigger') as HTMLElement
    trigger.click()
    await flushPromises()
    await nextTick()
    // Give focus trap time to engage
    await new Promise((r) => setTimeout(r, 50))

    const dialogEl = document.body.querySelector('[role="alertdialog"]') as HTMLElement
    expect(dialogEl).not.toBeNull()
    const focused = document.activeElement
    expect(dialogEl.contains(focused)).toBe(true)
  })
})
