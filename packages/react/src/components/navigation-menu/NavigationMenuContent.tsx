import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { navigationMenuVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface NavigationMenuContentProps
  extends Omit<ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>, "className"> {
  className?: ClassValue;
  /**
   * Merge props onto child element instead of rendering a wrapper. Radix's
   * typings don't declare `asChild` on `Content` but the underlying
   * `Primitive.div` supports it at runtime (spread through `...rest`).
   */
  asChild?: boolean;
}

/**
 * `escape-key-down` / `pointer-down-outside` / `focus-outside` /
 * `interact-outside` events from the Vue version map 1:1 to Radix's own
 * `onEscapeKeyDown` / `onPointerDownOutside` / `onFocusOutside` /
 * `onInteractOutside` props, which are already part of
 * `ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>` — no
 * extra plumbing needed.
 */
export const NavigationMenuContent = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Content>,
  NavigationMenuContentProps
>(function NavigationMenuContent({ className, ...rest }, ref) {
  const slotFns = navigationMenuVariants();

  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={composeClassName(slotFns.content(), className)}
      {...rest}
    />
  );
});
