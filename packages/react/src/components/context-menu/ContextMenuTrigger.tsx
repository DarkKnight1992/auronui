import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { contextMenuVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface ContextMenuTriggerOwnProps {
  /** When true, the context menu does not open on right-click — the native browser context menu is restored. */
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  /**
   * Merge props onto the single child element instead of rendering Radix's own `span`.
   * Radix has no reka-ui-style `as` (arbitrary tag) escape hatch — only `asChild`.
   * @default false
   */
  asChild?: boolean;
  className?: ClassValue;
}

export type ContextMenuTriggerProps = ContextMenuTriggerOwnProps &
  Omit<ComponentPropsWithoutRef<"span">, keyof ContextMenuTriggerOwnProps>;

/**
 * Deviation from the Vue version: the Vue `ContextMenuTrigger` defaults `asChild` to
 * `true` and supports an `as` prop for rendering an arbitrary tag. Radix's context menu
 * trigger only exposes `asChild` (no arbitrary `as` tag) and renders a `<span>` wrapper
 * by default when `asChild` is false — matching this repo's `MenubarTrigger` precedent,
 * `asChild` defaults to `false` here.
 */
export const ContextMenuTrigger = forwardRef<HTMLSpanElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger(
    { isDisabled, disabled, asChild = false, className, children, ...rest },
    ref,
  ) {
    const resolvedDisabled = resolveDeprecatedBooleanProp(
      "ContextMenuTrigger",
      "isDisabled",
      isDisabled,
      "disabled",
      disabled,
    );

    const slots = contextMenuVariants();

    return (
      <ContextMenuPrimitive.Trigger
        ref={ref}
        disabled={resolvedDisabled}
        asChild={asChild}
        className={composeClassName(slots.trigger(), className)}
        {...rest}
      >
        {children}
      </ContextMenuPrimitive.Trigger>
    );
  },
);
