import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useOverlayState } from "../../hooks";
import { HoverCardContextProvider } from "./hover-card.context";

export interface HoverCardProps {
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Delay (ms) before the card opens on hover. @default 700 */
  openDelay?: number;
  /** Delay (ms) before the card closes after the pointer leaves. @default 300 */
  closeDelay?: number;
  children: ReactNode;
}

/**
 * HoverCard root. react-aria-components has no dedicated HoverCard primitive
 * (confirmed: no `HoverCard` export exists in its index), so this hand-rolls
 * hover-driven open state — `useOverlayState` (controlled/uncontrolled `isOpen`)
 * plus its own open/close debounce timers — and hands it to `HoverCardTrigger`/
 * `HoverCardContent` via context. `HoverCardContent` positions itself with
 * react-aria-components' `Popover` used standalone (`isOpen`/`triggerRef` driven
 * externally, as documented on `PopoverProps`), so floating-ui placement/collision
 * logic is reused rather than reimplemented.
 */
export function HoverCard({
  defaultOpen = false,
  open,
  onOpenChange,
  openDelay = 700,
  closeDelay = 300,
  children,
}: HoverCardProps) {
  const state = useOverlayState({ value: open, defaultOpen, onOpenChange });
  const triggerRef = useRef<HTMLElement | null>(null);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const clearOpenTimeout = useCallback(() => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = undefined;
    }
  }, []);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = undefined;
    }
  }, []);

  const scheduleOpen = useCallback(
    (immediate = false) => {
      clearCloseTimeout();
      if (state.isOpen || openTimeoutRef.current) return;
      if (immediate || openDelay <= 0) {
        state.open();
        return;
      }
      openTimeoutRef.current = setTimeout(() => {
        openTimeoutRef.current = undefined;
        state.open();
      }, openDelay);
    },
    [state, openDelay, clearCloseTimeout],
  );

  const scheduleClose = useCallback(
    (immediate = false) => {
      clearOpenTimeout();
      if (immediate || closeDelay <= 0) {
        clearCloseTimeout();
        state.close();
        return;
      }
      if (closeTimeoutRef.current) return;
      closeTimeoutRef.current = setTimeout(() => {
        closeTimeoutRef.current = undefined;
        state.close();
      }, closeDelay);
    },
    [state, closeDelay, clearOpenTimeout, clearCloseTimeout],
  );

  useEffect(
    () => () => {
      clearOpenTimeout();
      clearCloseTimeout();
    },
    [clearOpenTimeout, clearCloseTimeout],
  );

  const contextValue = useMemo(
    () => ({
      isOpen: state.isOpen,
      triggerRef,
      scheduleOpen,
      scheduleClose,
      cancelClose: clearCloseTimeout,
    }),
    [state.isOpen, scheduleOpen, scheduleClose, clearCloseTimeout],
  );

  return <HoverCardContextProvider value={contextValue}>{children}</HoverCardContextProvider>;
}
