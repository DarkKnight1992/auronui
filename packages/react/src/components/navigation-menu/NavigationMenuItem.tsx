import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

export interface NavigationMenuItemProps
  extends ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item> {
  /**
   * A unique value that associates the item with the active value when the
   * menu is controlled. Managed automatically when uncontrolled.
   */
  value?: string;
}

export const NavigationMenuItem = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Item>,
  NavigationMenuItemProps
>(function NavigationMenuItem(props, ref) {
  return <NavigationMenuPrimitive.Item ref={ref} {...props} />;
});
