import { useCallback, useState } from "react";

/**
 * Props accepted by `useOverlayState`.
 *
 * Supports both controlled and uncontrolled usage patterns:
 * - **Controlled**: provide `value` (the parent owns open/close state)
 * - **Uncontrolled**: omit `value`, optionally provide `defaultOpen`
 */
export interface UseOverlayStateProps {
  /**
   * Controlled open state. When provided, `isOpen` reflects this value
   * and calling `setOpen` will NOT mutate internal state — use `onOpenChange`
   * to update the external state instead.
   *
   * Corresponds to a controlled `open` prop on overlay components.
   */
  value?: boolean;

  /**
   * Initial open state for uncontrolled mode. Only applied when `value`
   * is not provided. Defaults to `false`.
   */
  defaultOpen?: boolean;

  /**
   * Callback fired whenever `setOpen` is called, regardless of controlled or
   * uncontrolled mode. In controlled mode, this is the primary way for the
   * parent to react to open/close requests and update its state.
   */
  onOpenChange?: (isOpen: boolean) => void;
}

/**
 * Return value of `useOverlayState`.
 */
export interface UseOverlayStateReturn {
  /** Current open state. */
  isOpen: boolean;
  /**
   * Set the open state to an explicit value.
   * Always fires `onOpenChange`. In uncontrolled mode, also updates internal state.
   * In controlled mode (`value` provided), does NOT mutate internal state.
   */
  setOpen: (next: boolean) => void;
  /** Shorthand: `setOpen(true)` */
  open: () => void;
  /** Shorthand: `setOpen(false)` */
  close: () => void;
  /** Shorthand: `setOpen(!isOpen)` */
  toggle: () => void;
}

/**
 * Hook for controlled/uncontrolled overlay open state.
 *
 * This is the central state primitive for all overlay components in Auron
 * (Popover, Modal, Tooltip, Select, Dropdown, etc.).
 *
 * **Controlled mode** (`value` provided):
 * - `isOpen` mirrors `value`
 * - `setOpen` fires `onOpenChange` but does NOT change internal state
 * - The parent component owns the state; it must update `value` via
 *   its `onOpenChange` handler to reflect the change
 *
 * **Uncontrolled mode** (no `value`):
 * - `isOpen` mirrors internal state
 * - `setOpen(true/false)` mutates internal state directly
 * - `defaultOpen` sets the initial value (defaults to `false`)
 *
 * @example Uncontrolled
 * ```tsx
 * const { isOpen, open, close } = useOverlayState({ defaultOpen: false })
 * ```
 *
 * @example Controlled
 * ```tsx
 * function MyOverlay({ open, onOpenChange }: { open?: boolean; onOpenChange?: (v: boolean) => void }) {
 *   const state = useOverlayState({ value: open, onOpenChange })
 * }
 * ```
 */
export function useOverlayState(props: UseOverlayStateProps = {}): UseOverlayStateReturn {
  const { value, defaultOpen = false, onOpenChange } = props;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isOpen = value !== undefined ? value : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      onOpenChange?.(next);
      if (value === undefined) {
        setInternalOpen(next);
      }
    },
    [value, onOpenChange],
  );

  const open = useCallback(() => setOpen(true), [setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);
  const toggle = useCallback(() => setOpen(!isOpen), [setOpen, isOpen]);

  return { isOpen, setOpen, open, close, toggle };
}
