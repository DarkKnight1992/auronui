import { isValidElement, cloneElement, type ReactElement } from "react";
import { useDrawerContext } from "./drawer.context";

export interface DrawerTriggerProps {
  /** A single element (typically Auron's `<Button>`) that becomes the Drawer's open trigger. */
  children: ReactElement<Record<string, unknown>>;
}

/** Wraps a single child element and wires it to toggle the Drawer (asChild-style, mirrors Vue's DrawerTrigger.vue and this package's ModalTrigger). */
export function DrawerTrigger({ children }: DrawerTriggerProps) {
  const ctx = useDrawerContext();
  if (!isValidElement(children)) return children;
  const childProps = children.props as { onClick?: (event: unknown) => void };
  return cloneElement(children, {
    ref: ctx.triggerRef,
    onClick: (event: unknown) => {
      childProps.onClick?.(event);
      ctx.toggle();
    },
    "aria-haspopup": "dialog",
    "aria-expanded": ctx.isOpen || undefined,
  } as Record<string, unknown>);
}
