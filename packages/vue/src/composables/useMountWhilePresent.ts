import { nextTick, onScopeDispose, ref, watch, type Ref } from 'vue'
import { useMutationObserver } from '@vueuse/core'

/**
 * Keeps a dialog's teleported wrapper element out of `<body>` while the dialog
 * is closed.
 *
 * Modal and AlertDialog wrap their overlay + content in one element (for
 * stacking) that sits outside reka's own presence checks. Teleported at mount
 * time, that empty wrapper is a `<body>` child when *another* dialog opens, so
 * reka's `hideOthers()` marks it `aria-hidden="true"` — and a dialog later
 * opened inside it stays invisible to screen readers, because `hideOthers()`
 * never un-hides the target's own ancestors. Inserting the wrapper only when
 * the dialog opens puts it in `<body>` *after* any outer dialog has hidden the
 * page, which is what reka's own examples get by putting the portal content
 * behind `Presence`.
 *
 * On close the wrapper stays until its children have finished their exit
 * animations: reka's `Presence` removes each child once its own exit animation
 * ends, and a mutation observer drops the wrapper when no element child is
 * left. A timeout backs that up for animations that never fire an end event.
 */
export function useMountWhilePresent(
  open: Ref<boolean>,
  wrapper: Readonly<Ref<HTMLElement | null>>,
  options: { forceMount?: () => boolean, fallbackMs?: number } = {},
) {
  const { fallbackMs = 1000 } = options
  const closing = ref(false)
  let fallback: ReturnType<typeof setTimeout> | undefined

  function finish() {
    clearTimeout(fallback)
    closing.value = false
  }

  /** Unmount the wrapper once its children are gone. */
  function settle() {
    if (!closing.value || open.value) return
    if (!wrapper.value || wrapper.value.childElementCount === 0) finish()
  }

  useMutationObserver(wrapper, settle, { childList: true })

  watch(open, (isOpen, wasOpen) => {
    if (isOpen) {
      finish()
    } else if (wasOpen) {
      closing.value = true
      clearTimeout(fallback)
      fallback = setTimeout(finish, fallbackMs)
      nextTick(settle)
    }
  })

  onScopeDispose(() => clearTimeout(fallback))

  const isMounted = () => open.value || closing.value || !!options.forceMount?.()

  return { isMounted }
}
