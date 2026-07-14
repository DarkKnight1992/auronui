import { useMemo, useRef, type ReactNode } from "react";
import { useOverlayState } from "../../hooks";
import { PopoverContextProvider, type PopoverContextValue } from "./popover.context";

export interface PopoverProps {
  children: ReactNode;
  defaultOpen?: boolean;
  /** Controlled open state. Omit for uncontrolled usage. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Whether the popover behaves like a modal (traps focus, blocks outside interaction) rather
   * than a typical dismissable popover. Maps to react-aria-components' `Popover`'s
   * `isNonModal={!modal}`. Defaults to `false`, matching reka-ui's `PopoverRoot`.
   */
  modal?: boolean;
}

/**
 * Popover root — owns open state (via `useOverlayState`) and threads `modal` +
 * open/close/toggle + trigger/anchor refs down to PopoverTrigger/PopoverAnchor/PopoverContent/
 * PopoverClose via context.
 *
 * Deviation from Vue: matching `Modal`/`HoverCard`, this owns state itself instead of relying on
 * react-aria-components' `DialogTrigger` (which only auto-wires press interactions onto children
 * that call react-aria's internal hooks, not a plain `<button>`/Auron's own `Button`).
 * `PopoverContent` drives react-aria-components' `Popover` standalone (`isOpen`/`triggerRef`
 * supplied externally), same recipe as `HoverCardContent`.
 */
export function Popover({ children, defaultOpen = false, open, onOpenChange, modal = false }: PopoverProps) {
  const state = useOverlayState({ value: open, defaultOpen, onOpenChange });
  const triggerRef = useRef<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);

  const contextValue = useMemo<PopoverContextValue>(
    () => ({
      isOpen: state.isOpen,
      open: state.open,
      close: state.close,
      toggle: state.toggle,
      triggerRef,
      anchorRef,
      modal,
    }),
    [state.isOpen, state.open, state.close, state.toggle, modal],
  );

  return <PopoverContextProvider value={contextValue}>{children}</PopoverContextProvider>;
}
