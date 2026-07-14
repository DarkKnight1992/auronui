import { isValidElement, cloneElement, type ReactElement } from "react";
import { useModalContext } from "./modal.context";

export interface ModalCloseProps {
  /** A single element (typically Auron's `<Button>`) that becomes the Modal's close trigger. */
  children: ReactElement<Record<string, unknown>>;
}

/** Wraps a single child element and wires it to close the Modal (asChild-style, mirrors Vue's ModalClose.vue). */
export function ModalClose({ children }: ModalCloseProps) {
  const ctx = useModalContext();
  if (!isValidElement(children)) return children;
  const childProps = children.props as { onClick?: (event: unknown) => void };
  return cloneElement(children, {
    onClick: (event: unknown) => {
      childProps.onClick?.(event);
      ctx.close();
    },
  } as Record<string, unknown>);
}
