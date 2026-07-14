import { isValidElement, cloneElement, type ReactElement } from "react";
import { usePopoverContext } from "./popover.context";

export interface PopoverCloseProps {
  /** A single element (typically Auron's `<Button>`) that becomes the Popover's close trigger. */
  children: ReactElement<Record<string, unknown>>;
}

/** Wraps a single child element and wires it to close the Popover (asChild-style, mirrors Vue's PopoverClose.vue and this package's ModalClose). */
export function PopoverClose({ children }: PopoverCloseProps) {
  const ctx = usePopoverContext();
  if (!isValidElement(children)) return children;
  const childProps = children.props as { onClick?: (event: unknown) => void };
  return cloneElement(children, {
    onClick: (event: unknown) => {
      childProps.onClick?.(event);
      ctx.close();
    },
  } as Record<string, unknown>);
}
