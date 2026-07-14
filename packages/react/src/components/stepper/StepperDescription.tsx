import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { stepperVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface StepperDescriptionOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type StepperDescriptionProps = StepperDescriptionOwnProps &
  Omit<ComponentPropsWithoutRef<"p">, keyof StepperDescriptionOwnProps>;

export function StepperDescription({ className, children, ...rest }: StepperDescriptionProps) {
  const styles = stepperVariants();

  return (
    <p className={composeClassName(styles.description(), className)} data-slot="stepper-description" {...rest}>
      {children}
    </p>
  );
}
