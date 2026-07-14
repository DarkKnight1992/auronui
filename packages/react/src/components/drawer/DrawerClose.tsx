import { isValidElement, cloneElement, type ReactElement } from "react";
import { useDrawerContext } from "./drawer.context";

export interface DrawerCloseProps {
  /** A single element (typically Auron's `<Button>`) that becomes the Drawer's close trigger. */
  children: ReactElement<Record<string, unknown>>;
}

/** Wraps a single child element and wires it to close the Drawer (asChild-style, mirrors Vue's DrawerClose.vue and this package's ModalClose). Works identically in dock mode and default/inline/hideBackdrop modes — `close()` is the same function either way. */
export function DrawerClose({ children }: DrawerCloseProps) {
  const ctx = useDrawerContext();
  if (!isValidElement(children)) return children;
  const childProps = children.props as { onClick?: (event: unknown) => void };
  return cloneElement(children, {
    onClick: (event: unknown) => {
      childProps.onClick?.(event);
      ctx.close();
    },
  } as Record<string, unknown>);
}
