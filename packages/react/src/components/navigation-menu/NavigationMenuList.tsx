import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { navigationMenuVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface NavigationMenuListProps
  extends Omit<ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>, "className"> {
  className?: ClassValue;
  /**
   * Merge props onto child element instead of rendering a wrapper.
   * Radix's typings don't declare `asChild` on `List` but the underlying
   * `Primitive.ul` supports it at runtime (spread through `...rest`).
   */
  asChild?: boolean;
}

export const NavigationMenuList = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.List>,
  NavigationMenuListProps
>(function NavigationMenuList({ className, ...rest }, ref) {
  const slotFns = navigationMenuVariants();

  return (
    <NavigationMenuPrimitive.List
      ref={ref}
      className={composeClassName(slotFns.list(), className)}
      {...rest}
    />
  );
});
