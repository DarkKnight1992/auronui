import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ElementRef } from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { navigationMenuVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface NavigationMenuViewportProps
  extends Omit<ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>, "className"> {
  className?: ClassValue;
  /**
   * Merge props onto child element instead of rendering a wrapper. Radix's
   * typings don't declare `asChild` on `Viewport` but the underlying
   * `Primitive.div` supports it at runtime (spread through `...rest`).
   */
  asChild?: boolean;
}

/**
 * The stylesheet (`navigation-menu.css`) was authored against reka-ui's
 * (Vue) CSS custom property names — `--reka-navigation-menu-viewport-{width,height}`.
 * Radix (React) exposes the equivalent measurements under a different name,
 * `--radix-navigation-menu-viewport-{width,height}`, set as inline style
 * directly on this same DOM element. Since we can't edit the shared
 * stylesheet from this folder, we alias the names here via inline style —
 * CSS custom properties on the same element resolve against each other
 * regardless of declaration order, so `--reka-...` simply forwards to
 * `--radix-...` for any descendant (including `NavigationMenuContent`,
 * which reads `--reka-navigation-menu-viewport-width` for its `sm:w-(...)`
 * class) to consume.
 *
 * The Indicator's `--reka-navigation-menu-indicator-{position,size}` custom
 * properties need no equivalent alias: Radix's `NavigationMenuIndicator`
 * already sets `transform`/`width` directly as inline style (not via a
 * custom property), which wins over the stylesheet's `var(...)`-based
 * fallback declarations by CSS specificity/origin rules.
 */
const VIEWPORT_VAR_ALIAS: CSSProperties = {
  ["--reka-navigation-menu-viewport-width" as string]: "var(--radix-navigation-menu-viewport-width)",
  ["--reka-navigation-menu-viewport-height" as string]: "var(--radix-navigation-menu-viewport-height)",
};

export const NavigationMenuViewport = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  NavigationMenuViewportProps
>(function NavigationMenuViewport({ className, style, ...rest }, ref) {
  const slotFns = navigationMenuVariants();

  return (
    <div className={slotFns.viewportWrapper()}>
      <NavigationMenuPrimitive.Viewport
        ref={ref}
        style={{ ...VIEWPORT_VAR_ALIAS, ...style }}
        className={composeClassName(slotFns.viewport(), className)}
        {...rest}
      />
    </div>
  );
});
