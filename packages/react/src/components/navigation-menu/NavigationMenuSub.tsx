import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

export type NavigationMenuSubProps = ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Sub>;

export const NavigationMenuSub = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Sub>,
  NavigationMenuSubProps
>(function NavigationMenuSub(props, ref) {
  return <NavigationMenuPrimitive.Sub ref={ref} {...props} />;
});
