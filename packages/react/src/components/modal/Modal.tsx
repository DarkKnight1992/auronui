import { useId, useMemo, useRef, type ReactNode } from "react";
import type { ModalVariants } from "@auronui/styles";
import { useOverlayState } from "../../hooks";
import { ModalProvider, type ModalPlacement } from "./modal.context";

export interface ModalProps {
  children: ReactNode;
  defaultOpen?: boolean;
  /** Controlled open state. Omit for uncontrolled usage. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: ModalVariants["size"];
  scroll?: ModalVariants["scroll"];
  variant?: ModalVariants["variant"];
  placement?: ModalPlacement;
}

/**
 * Modal root — owns open state (via `useOverlayState`) and threads
 * size/scroll/variant/placement + open/close/toggle down to
 * ModalTrigger/ModalContent/ModalClose via context.
 *
 * Deviation from Vue: Vue's `Modal.vue` wraps reka-ui's `DialogRoot`, which
 * owns open state internally and exposes it to descendants via reka-ui's own
 * dialog context. react-aria-components has an analogous primitive
 * (`DialogTrigger`), but it only wires press/hover interactions onto children
 * that themselves call react-aria's internal hooks (e.g. react-aria-components'
 * own `<Button>`) — a plain `<button>` or Auron's own `<Button>` would not
 * become clickable automatically without extra plumbing. So instead Modal
 * owns state itself (`useOverlayState`, the same primitive documented for
 * Popover/Tooltip/Select/Dropdown) and wires the trigger/close elements
 * explicitly via `cloneElement` in `ModalTrigger`/`ModalClose`. This keeps the
 * same public compound API shape as Vue while working with any element type,
 * matching Vue's `asChild` flexibility, and drives react-aria-components'
 * `ModalOverlay`/`Modal`/`Dialog` primitives as a fully controlled overlay.
 */
export function Modal({
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  size = "md",
  scroll = "inside",
  variant = "opaque",
  placement = "auto",
}: ModalProps) {
  const state = useOverlayState({ value: open, defaultOpen, onOpenChange });
  const triggerRef = useRef<HTMLElement | null>(null);
  const descriptionId = useId();

  const contextValue = useMemo(
    () => ({
      isOpen: state.isOpen,
      open: state.open,
      close: state.close,
      toggle: state.toggle,
      triggerRef,
      size,
      scroll,
      variant,
      placement,
      descriptionId,
    }),
    [state.isOpen, state.open, state.close, state.toggle, size, scroll, variant, placement, descriptionId],
  );

  return <ModalProvider value={contextValue}>{children}</ModalProvider>;
}
