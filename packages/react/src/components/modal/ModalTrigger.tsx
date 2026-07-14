import { isValidElement, cloneElement, type ReactElement } from "react";
import { useModalContext } from "./modal.context";

export interface ModalTriggerProps {
  /** A single element (typically Auron's `<Button>`) that becomes the Modal's open trigger. */
  children: ReactElement<Record<string, unknown>>;
}

/** Wraps a single child element and wires it to open the Modal (asChild-style, mirrors Vue's ModalTrigger.vue). */
export function ModalTrigger({ children }: ModalTriggerProps) {
  const ctx = useModalContext();
  if (!isValidElement(children)) return children;
  const childProps = children.props as { onClick?: (event: unknown) => void };
  return cloneElement(children, {
    ref: ctx.triggerRef,
    onClick: (event: unknown) => {
      childProps.onClick?.(event);
      ctx.open();
    },
    "aria-haspopup": "dialog",
    "aria-expanded": ctx.isOpen || undefined,
  } as Record<string, unknown>);
}
