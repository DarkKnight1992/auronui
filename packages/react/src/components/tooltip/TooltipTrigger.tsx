import { cloneElement, type ReactElement } from "react";
import { Focusable } from "react-aria";
import type { FocusableProps as FocusableComponentProps } from "react-aria";
import { tooltipVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface TooltipTriggerProps {
  /** A single focusable element (any Auron component that forwards its ref to a DOM node). */
  children: ReactElement;
  /** Extra classes merged onto the trigger element. */
  className?: ClassValue;
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
 *
 * Also merges `.tooltip__trigger` (cursor + focus-ring affordance from
 * `tooltip.css`) onto the child ourselves before handing it to `Focusable` —
 * without this, a Button trigger looks interactive only because Button
 * supplies its own hover/focus styling; anything else (a plain span/icon)
 * had no visual affordance at all. Mirrors the Vue package's TooltipTrigger.
 */
export function TooltipTrigger({ children, className }: TooltipTriggerProps) {
  const styles = tooltipVariants();
  const styledChild = cloneElement(
    children,
    {
      className: composeClassName(
        styles.trigger(),
        (children.props as { className?: ClassValue }).className,
        className,
      ),
    } as Partial<unknown>,
  );
  return <Focusable>{styledChild as FocusableComponentProps["children"]}</Focusable>;
}
