import { isValidElement, cloneElement, type ReactElement, type SyntheticEvent } from "react";
import { useDrawerContext } from "./drawer.context";

export interface DrawerCloseProps {
  /** A single element (typically Auron's `<Button>`) that becomes the Drawer's close trigger. */
  children: ReactElement<Record<string, unknown>>;
}

/**
 * Wraps a single child element and wires it to close the Drawer (asChild-style, mirrors Vue's
 * DrawerClose.vue and this package's ModalClose). Works identically in dock mode and
 * default/inline/hideBackdrop modes — `close()` is the same function either way.
 * The child's own `onClick` always runs first; if it calls `event.preventDefault()` (e.g. to keep
 * the drawer open while an async save is in flight), the close is skipped — call `ctx.close()`
 * manually once the async work resolves.
 */
export function DrawerClose({ children }: DrawerCloseProps) {
  const ctx = useDrawerContext();
  if (!isValidElement(children)) return children;
  const childProps = children.props as { onClick?: (event: SyntheticEvent) => void };
  return cloneElement(children, {
    onClick: (event: SyntheticEvent) => {
      childProps.onClick?.(event);
      if (event.defaultPrevented) return;
      ctx.close();
    },
  } as Record<string, unknown>);
}
