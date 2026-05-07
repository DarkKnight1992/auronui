import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import axe from 'axe-core'
import AlertDialog from '../AlertDialog.vue'
import AlertDialogTrigger from '../AlertDialogTrigger.vue'
import AlertDialogContent from '../AlertDialogContent.vue'
import AlertDialogTitle from '../AlertDialogTitle.vue'
import AlertDialogDescription from '../AlertDialogDescription.vue'
import AlertDialogAction from '../AlertDialogAction.vue'
import AlertDialogCancel from '../AlertDialogCancel.vue'

// jsdom does not implement getComputedStyle with pseudo-elements or color-contrast,
// which causes axe color-contrast checks to throw. Disable them for unit tests.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
}

describe('AlertDialog axe audit', () => {
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
          AlertDialog,
          AlertDialogTrigger,
          AlertDialogContent,
          AlertDialogTitle,
          AlertDialogDescription,
          AlertDialogAction,
          AlertDialogCancel,
        },
        template: `
          <AlertDialog :default-open="true">
            <AlertDialogTrigger as-child>
              <button>Delete item</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the item.
              </AlertDialogDescription>
              <AlertDialogAction>Confirm Delete</AlertDialogAction>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
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

  it('has role="alertdialog" and is accessible (aria-labelledby wired) when open', async () => {
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
        template: `
          <AlertDialog :default-open="true">
            <AlertDialogTrigger as-child>
              <button>Delete</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Confirm</AlertDialogTitle>
              <AlertDialogDescription>Are you sure?</AlertDialogDescription>
              <AlertDialogAction>Yes</AlertDialogAction>
              <AlertDialogCancel>No</AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        `,
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await flushPromises()
    await nextTick()

    const alertDialogEl = document.body.querySelector('[role="alertdialog"]')
    expect(alertDialogEl).not.toBeNull()

    // Note: Reka UI's AlertDialogContent uses aria-hidden + useHideOthers for modal
    // inertness rather than aria-modal="true" (same pattern as Modal/DialogContent).
    // The alertdialog is made accessible via role="alertdialog" + aria-labelledby.

    // aria-labelledby should be wired to the title
    const labelledById = alertDialogEl?.getAttribute('aria-labelledby')
    expect(labelledById).toBeTruthy()
    const titleEl = document.getElementById(labelledById!)
    expect(titleEl).not.toBeNull()
    expect(titleEl?.textContent?.trim()).toBe('Confirm')

    // aria-describedby should be wired to the description
    const describedById = alertDialogEl?.getAttribute('aria-describedby')
    expect(describedById).toBeTruthy()
    const descEl = document.getElementById(describedById!)
    expect(descEl).not.toBeNull()
  })

  it('passes axe audit when closed', async () => {
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
        template: `
          <AlertDialog :default-open="false">
            <AlertDialogTrigger as-child>
              <button>Delete</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Confirm</AlertDialogTitle>
              <AlertDialogDescription>Are you sure?</AlertDialogDescription>
              <AlertDialogAction>Yes</AlertDialogAction>
              <AlertDialogCancel>No</AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
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
