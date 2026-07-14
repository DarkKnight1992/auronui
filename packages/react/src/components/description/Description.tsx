import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { descriptionVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface DescriptionOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type DescriptionProps = DescriptionOwnProps &
  Omit<ComponentPropsWithoutRef<"p">, keyof DescriptionOwnProps>;

export const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(function Description(
  { className, children, ...rest },
  ref,
) {
  const classes = composeClassName(descriptionVariants(), className);

  return (
    <p ref={ref} className={classes} {...rest}>
      {children}
    </p>
  );
});
