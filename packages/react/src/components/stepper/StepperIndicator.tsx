import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { stepperVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useStepperContext, stepperContextDefaults } from "./stepper.context";

export interface StepperIndicatorOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type StepperIndicatorProps = StepperIndicatorOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof StepperIndicatorOwnProps>;

export function StepperIndicator({ className, children, ...rest }: StepperIndicatorProps) {
  const ctx = useStepperContext(stepperContextDefaults);
  const styles = stepperVariants({ size: ctx.size, color: ctx.color });

  return (
    <div
      className={composeClassName(styles.indicator(), className)}
      aria-hidden="true"
      data-slot="stepper-indicator"
      {...rest}
    >
      {children}
    </div>
  );
}
