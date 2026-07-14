import type { ReactElement } from "react";
import { Focusable } from "react-aria";
import type { FocusableProps as FocusableComponentProps } from "react-aria";

export interface TooltipTriggerProps {
  /** A single focusable element (any Auron component that forwards its ref to a DOM node). */
  children: ReactElement;
}

/**
 * Wraps the trigger element with react-aria's `Focusable`, which reads the
 * `FocusableContext` supplied by the parent `Tooltip` (react-aria-components'
 * `TooltipTrigger`) and merges its hover/focus/press DOM handlers onto the
 * child via `cloneElement` — the RAC equivalent of Reka UI's `asChild`.
 *
 * `Focusable`'s children type is pinned to native DOM-tag elements (Reka's own
 * `asChild` has the same runtime requirement — the target must forward its ref
 * to a real DOM node); Auron components like `Button` satisfy that at runtime
 * but aren't typed as string-element `ReactElement`s, hence the cast.
 */
export function TooltipTrigger({ children }: TooltipTriggerProps) {
  return <Focusable>{children as FocusableComponentProps["children"]}</Focusable>;
}
