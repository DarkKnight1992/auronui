import type { ComponentPropsWithoutRef } from "react";
import { stepperVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useStepperContext, stepperContextDefaults } from "./stepper.context";

export interface StepperSeparatorOwnProps {
  className?: ClassValue;
}

export type StepperSeparatorProps = StepperSeparatorOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof StepperSeparatorOwnProps>;

export function StepperSeparator({ className, ...rest }: StepperSeparatorProps) {
  const ctx = useStepperContext(stepperContextDefaults);
  const styles = stepperVariants({ orientation: ctx.orientation });

  return (
    <div
      className={composeClassName(styles.separator(), className)}
      role="none"
      data-slot="stepper-separator"
      {...rest}
    />
  );
}
