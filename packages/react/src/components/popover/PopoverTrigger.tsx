import { isValidElement, cloneElement, type ReactElement } from "react";
import { usePopoverContext } from "./popover.context";

export interface PopoverTriggerProps {
  /** A single element (typically Auron's `<Button>`) that becomes the Popover's open trigger. */
  children: ReactElement<Record<string, unknown>>;
}

/** Wraps a single child element and wires it to toggle the Popover (asChild-style, mirrors Vue's PopoverTrigger.vue and this package's ModalTrigger). */
export function PopoverTrigger({ children }: PopoverTriggerProps) {
  const ctx = usePopoverContext();
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
