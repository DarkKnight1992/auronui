import { useMemo, useRef, type ReactNode } from "react";
import { drawerVariants } from "@auronui/styles";
import { useOverlayState } from "../../hooks";
import { DrawerContextProvider, type DrawerContextValue, type DrawerPlacement, type DrawerSize } from "./drawer.context";

export interface DrawerProps {
  children: ReactNode;
  defaultOpen?: boolean;
  /** Controlled open state. Omit for uncontrolled usage. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Edge the drawer panel slides in from. */
  placement?: DrawerPlacement;
  /** Reserved for parity with the Vue package's API; not currently consumed by drawer.styles.ts. */
  size?: DrawerSize;
  /**
   * Renders the panel with `position: absolute` instead of `fixed`, scoped to the nearest
   * positioned ancestor. NOTE: react-aria-components' `Modal` always portals to `document.body`,
   * so unlike the Vue/reka-ui version this does not truly render in the surrounding DOM flow —
   * it still portals, just with the `inline` CSS modifier applied.
   */
  inline?: boolean;
  /** Hides the backdrop and blocks outside-click/Escape dismissal — the close icon becomes the only way out. */
  hideBackdrop?: boolean;
  /** Dock mode: the panel shifts page content in the DOM flow instead of overlaying it (no react-aria-components dialog machinery). */
  dock?: boolean;
}

/**
 * Drawer root — owns open state (via `useOverlayState`) and threads
 * placement/size/inline/hideBackdrop/dock + open/close/toggle down to
 * DrawerTrigger/DrawerContent/DrawerClose via context.
 *
 * Deviation from Vue: Vue's `Drawer.vue` wraps reka-ui's `DialogRoot`, which owns open state
 * internally. react-aria-components' analogous primitive (`DialogTrigger`) only wires press/hover
 * interactions onto children that themselves call react-aria's internal hooks — a plain `<button>`
 * or Auron's own `Button` would not become clickable automatically without extra plumbing. So,
 * matching `Modal`/`HoverCard`, `Drawer` owns state itself (`useOverlayState`) and wires the
 * trigger/close elements explicitly via `cloneElement` in `DrawerTrigger`/`DrawerClose`. Dock mode
 * reuses the exact same `isOpen`/`open`/`close`/`toggle` — it's just a different *rendering* of
 * the same boolean state, with no react-aria-components dialog machinery involved at all.
 */
export function Drawer({
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  placement = "right",
  size = "md",
  inline = false,
  hideBackdrop = false,
  dock = false,
}: DrawerProps) {
  const state = useOverlayState({ value: open, defaultOpen, onOpenChange });
  const triggerRef = useRef<HTMLElement | null>(null);
  const styles = drawerVariants();

  const contextValue = useMemo<DrawerContextValue>(
    () => ({
      isOpen: state.isOpen,
      open: state.open,
      close: state.close,
      toggle: state.toggle,
      triggerRef,
      placement,
      size,
      inline,
      hideBackdrop,
      dock,
    }),
    [state.isOpen, state.open, state.close, state.toggle, placement, size, inline, hideBackdrop, dock],
  );

  if (dock) {
    return (
      <DrawerContextProvider value={contextValue}>
        <div className={styles.dockContainer({ placement })}>{children}</div>
      </DrawerContextProvider>
    );
  }

  return <DrawerContextProvider value={contextValue}>{children}</DrawerContextProvider>;
}
