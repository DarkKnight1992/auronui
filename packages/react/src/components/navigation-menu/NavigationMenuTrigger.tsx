import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { navigationMenuVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface NavigationMenuTriggerProps
  extends Omit<ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>, "className" | "disabled"> {
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  className?: ClassValue;
  /**
   * Merge props onto child element instead of rendering a wrapper. Radix's
   * typings don't declare `asChild` on `Trigger` but the underlying
   * `Primitive.button` supports it at runtime (spread through `...rest`).
   */
  asChild?: boolean;
}

export const NavigationMenuTrigger = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  NavigationMenuTriggerProps
>(function NavigationMenuTrigger({ isDisabled, disabled, className, children, ...rest }, ref) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "NavigationMenuTrigger",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const slotFns = navigationMenuVariants();

  return (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      disabled={resolvedDisabled || undefined}
      className={composeClassName(slotFns.trigger(), className)}
      {...rest}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        data-slot="navigation-menu-trigger--chevron"
        className={slotFns.chevron()}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </NavigationMenuPrimitive.Trigger>
  );
});
