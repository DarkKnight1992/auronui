import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { linkVariants, type LinkVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface NavigationMenuLinkProps
  extends Omit<ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>, "className" | "onSelect"> {
  /** Identifies this link as the currently active page. */
  active?: boolean;
  color?: LinkVariants["color"];
  underline?: LinkVariants["underline"];
  className?: ClassValue;
  onSelect?: (event: Event) => void;
  /**
   * Merge props onto child element instead of rendering a wrapper — e.g. to
   * swap in Auron's `Link` component. Radix's typings don't declare
   * `asChild` on `Link` but the underlying `Primitive.a` supports it at
   * runtime (spread through `...rest`).
   */
  asChild?: boolean;
}

/**
 * Mirrors the Vue original: this does NOT delegate to Auron's `Link`
 * component internally (it reimplements `linkVariants` styling directly on
 * top of reka-ui/Radix's own `NavigationMenuLink` primitive, since it needs
 * that primitive's active-item tracking / dismiss-on-select wiring). Pass
 * `asChild` and render Auron's `<Link>` as the child if you need Link's own
 * extra features (e.g. `isExternal`).
 */
export const NavigationMenuLink = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Link>,
  NavigationMenuLinkProps
>(function NavigationMenuLink({ color, underline, className, ...rest }, ref) {
  const slotFns = linkVariants({ color, underline });

  return (
    <NavigationMenuPrimitive.Link
      ref={ref}
      className={composeClassName(slotFns.base(), className)}
      {...rest}
    />
  );
});
