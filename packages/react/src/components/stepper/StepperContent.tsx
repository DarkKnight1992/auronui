import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { stepperVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface StepperContentOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type StepperContentProps = StepperContentOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof StepperContentOwnProps>;

export function StepperContent({ className, children, ...rest }: StepperContentProps) {
  const styles = stepperVariants();

  return (
    <div className={composeClassName(styles.content(), className)} data-slot="stepper-content" {...rest}>
      {children}
    </div>
  );
}
