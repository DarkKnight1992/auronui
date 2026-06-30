import { ref, readonly } from 'vue'

export interface UseDisclosureReturn {
  /** Whether the element is currently open. */
  isOpen: Readonly<ReturnType<typeof ref<boolean>>>
  /** Open the element. */
  open: () => void
  /** Close the element. */
  close: () => void
  /** Toggle the element open/closed. */
  toggle: () => void
  /**
   * Pass as `@update:open` handler on the component.
   * Keeps `isOpen` in sync when the component closes itself (e.g. Escape key, backdrop click).
   */
  onOpenChange: (value: boolean) => void
}

/**
 * Manages programmatic open/close state for overlay components.
 *
 * Wire the returned refs and handlers directly into the component:
 *
 * @example
 * ```ts
 * const modal = useDisclosure()
 * await saveData()
 * modal.open()
 * ```
 * ```html
 * <Modal :open="modal.isOpen" @update:open="modal.onOpenChange">...</Modal>
 * ```
 */
export function useDisclosure(defaultOpen = false): UseDisclosureReturn {
  const _isOpen = ref(defaultOpen)

  function open(): void {
    _isOpen.value = true
  }

  function close(): void {
    _isOpen.value = false
  }

  function toggle(): void {
    _isOpen.value = !_isOpen.value
  }

  function onOpenChange(value: boolean): void {
    _isOpen.value = value
  }

  return {
    isOpen: readonly(_isOpen),
    open,
    close,
    toggle,
    onOpenChange,
  }
}
