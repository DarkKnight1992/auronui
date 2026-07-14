import { forwardRef, useMemo, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { navigationMenuVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface NavigationMenuProps
  extends Omit<ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>, "className"> {
  /** The orientation of the menu. @default 'horizontal' */
  orientation?: "horizontal" | "vertical";
  className?: ClassValue;
}

/**
 * Root NavigationMenu. Ports reka-ui's `NavigationMenuRoot` (Vue) to
 * `@radix-ui/react-navigation-menu`'s `Root`.
 *
 * Deviations from the Vue API surface (Radix 1.2.x has no equivalent knob):
 * - `disableClickTrigger`, `disableHoverTrigger`, `disablePointerLeaveClose`,
 *   `unmountOnHide` are NOT supported — Radix's NavigationMenu has no
 *   corresponding props. `unmountOnHide` is approximated per-Content via
 *   `forceMount` (opposite polarity) on `NavigationMenuContent` instead of a
 *   root-level toggle.
 */
export const NavigationMenu = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(function NavigationMenu({ className, orientation, ...rest }, ref) {
  const slotFns = useMemo(() => navigationMenuVariants(), []);

  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      orientation={orientation}
      className={composeClassName(slotFns.root(), className)}
      {...rest}
    />
  );
});
