import { useCallback, useState } from "react";

export interface UseDisclosureReturn {
  /** Whether the element is currently open. */
  isOpen: boolean;
  /** Open the element. */
  open: () => void;
  /** Close the element. */
  close: () => void;
  /** Toggle the element open/closed. */
  toggle: () => void;
  /**
   * Pass as the `onOpenChange` handler on the component.
   * Keeps `isOpen` in sync when the component closes itself (e.g. Escape key, backdrop click).
   */
  onOpenChange: (value: boolean) => void;
}

/**
 * Manages programmatic open/close state for overlay components.
 *
 * @example
 * ```tsx
 * const modal = useDisclosure()
 * await saveData()
 * modal.open()
 * ```
 * ```tsx
 * <Modal open={modal.isOpen} onOpenChange={modal.onOpenChange}>...</Modal>
 * ```
 */
export function useDisclosure(defaultOpen = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const onOpenChange = useCallback((value: boolean) => setIsOpen(value), []);

  return { isOpen, open, close, toggle, onOpenChange };
}
