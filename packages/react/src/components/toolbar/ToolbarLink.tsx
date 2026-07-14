import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { composeClassName, type ClassValue } from "../../utils";

export interface ToolbarLinkOwnProps {
  href?: string;
  asChild?: boolean;
  className?: ClassValue;
  children?: ReactNode;
}

export type ToolbarLinkProps = ToolbarLinkOwnProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof ToolbarLinkOwnProps>;

export const ToolbarLink = forwardRef<HTMLAnchorElement, ToolbarLinkProps>(function ToolbarLink(
  { href, asChild, className, children, ...rest },
  ref,
) {
  return (
    <ToolbarPrimitive.Link
      ref={ref}
      href={href}
      asChild={asChild}
      className={composeClassName("link", className)}
      {...rest}
    >
      {children}
    </ToolbarPrimitive.Link>
  );
});
