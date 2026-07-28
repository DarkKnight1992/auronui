import { isValidElement, cloneElement, type ReactElement, type SyntheticEvent } from "react";
import { useModalContext } from "./modal.context";

export interface ModalCloseProps {
  /** A single element (typically Auron's `<Button>`) that becomes the Modal's close trigger. */
  children: ReactElement<Record<string, unknown>>;
}

/**
 * Wraps a single child element and wires it to close the Modal (asChild-style, mirrors Vue's ModalClose.vue).
 * The child's own `onClick` always runs first; if it calls `event.preventDefault()` (e.g. to keep the
 * modal open while an async save is in flight), the close is skipped — call `ctx.close()`/the modal's
 * `onOpenChange` manually once the async work resolves.
 */
export function ModalClose({ children }: ModalCloseProps) {
  const ctx = useModalContext();
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
