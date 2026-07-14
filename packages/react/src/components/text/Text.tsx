import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { textVariants, type TextVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface TextOwnProps {
  as?: ElementType;
  size?: TextVariants["size"];
  variant?: TextVariants["variant"];
  className?: ClassValue;
  children?: ReactNode;
}

export type TextProps = TextOwnProps & Omit<ComponentPropsWithoutRef<"p">, keyof TextOwnProps>;

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as: As = "p", size = "base", variant = "default", className, children, ...rest },
  ref,
) {
  const classes = composeClassName(textVariants({ size, variant }), className);
  const Comp = As as ElementType;

  return (
    <Comp ref={ref} className={classes} {...rest}>
      {children}
    </Comp>
  );
});
