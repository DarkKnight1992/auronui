import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { stepperVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useStepperContext, stepperContextDefaults } from "./stepper.context";

export interface StepperTitleOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type StepperTitleProps = StepperTitleOwnProps &
  Omit<ComponentPropsWithoutRef<"p">, keyof StepperTitleOwnProps>;

export function StepperTitle({ className, children, ...rest }: StepperTitleProps) {
  const ctx = useStepperContext(stepperContextDefaults);
  const styles = stepperVariants({ size: ctx.size });

  return (
    <p className={composeClassName(styles.title(), className)} data-slot="stepper-title" {...rest}>
      {children}
    </p>
  );
}
