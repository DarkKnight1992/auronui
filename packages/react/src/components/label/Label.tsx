import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { labelVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface LabelOwnProps {
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  className?: ClassValue;
}

export type LabelProps = LabelOwnProps &
  Omit<ComponentPropsWithoutRef<"label">, keyof LabelOwnProps>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { isDisabled = false, isInvalid = false, isRequired = false, className, children, ...rest },
  ref,
) {
  const classes = composeClassName(
    labelVariants({ isDisabled, isInvalid, isRequired }),
    className,
  );

  return (
    <label ref={ref} className={classes} {...rest}>
      {children}
    </label>
  );
});
