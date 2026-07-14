import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { navigationMenuVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface NavigationMenuIndicatorProps
  extends Omit<ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>, "className"> {
  className?: ClassValue;
  /**
   * Merge props onto child element instead of rendering a wrapper. Radix's
   * typings don't declare `asChild` on `Indicator` but the underlying
   * `Primitive.div` supports it at runtime (spread through `...rest`).
   */
  asChild?: boolean;
}

export const NavigationMenuIndicator = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  NavigationMenuIndicatorProps
>(function NavigationMenuIndicator({ className, ...rest }, ref) {
  const slotFns = navigationMenuVariants();

  return (
    <NavigationMenuPrimitive.Indicator
      ref={ref}
      className={composeClassName(slotFns.indicator(), className)}
      {...rest}
    >
      <div className={slotFns.indicatorArrow()} />
    </NavigationMenuPrimitive.Indicator>
  );
});
