import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { headerVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface HeaderOwnProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: ClassValue;
  children?: ReactNode;
}

export type HeaderProps = HeaderOwnProps & Omit<ComponentPropsWithoutRef<"h2">, keyof HeaderOwnProps>;

export const Header = forwardRef<HTMLHeadingElement, HeaderProps>(function Header(
  { as: As = "h2", className, children, ...rest },
  ref,
) {
  const classes = composeClassName(headerVariants(), className);
  const Comp = As;

  return (
    <Comp ref={ref} className={classes} {...rest}>
      {children}
    </Comp>
  );
});
