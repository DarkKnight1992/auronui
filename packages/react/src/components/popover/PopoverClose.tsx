import { isValidElement, cloneElement, type ReactElement, type SyntheticEvent } from "react";
import { usePopoverContext } from "./popover.context";

export interface PopoverCloseProps {
  /** A single element (typically Auron's `<Button>`) that becomes the Popover's close trigger. */
  children: ReactElement<Record<string, unknown>>;
}

/**
 * Wraps a single child element and wires it to close the Popover (asChild-style, mirrors Vue's
 * PopoverClose.vue and this package's ModalClose). The child's own `onClick` always runs first;
 * if it calls `event.preventDefault()` (e.g. to keep the popover open while an async action is in
 * flight), the close is skipped — call `ctx.close()` manually once the async work resolves.
 */
export function PopoverClose({ children }: PopoverCloseProps) {
  const ctx = usePopoverContext();
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
