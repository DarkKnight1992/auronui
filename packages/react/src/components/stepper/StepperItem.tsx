import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { stepperVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useStepperContext, stepperContextDefaults, type StepStatus } from "./stepper.context";

export interface StepperItemRenderProps {
  status: StepStatus;
  step: number;
  isCurrent: boolean;
  isCompleted: boolean;
  isError: boolean;
}

export interface StepperItemOwnProps {
  step: number;
  className?: ClassValue;
  children?: ReactNode | ((props: StepperItemRenderProps) => ReactNode);
}

export type StepperItemProps = StepperItemOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof StepperItemOwnProps>;

export function StepperItem({ step, className, children, ...rest }: StepperItemProps) {
  const ctx = useStepperContext(stepperContextDefaults);
  const status = ctx.getStepStatus(step);
  const styles = stepperVariants({ orientation: ctx.orientation, size: ctx.size, color: ctx.color });

  const renderProps: StepperItemRenderProps = {
    status,
    step,
    isCurrent: status === "current",
    isCompleted: status === "completed",
    isError: status === "error",
  };

  return (
    <div
      className={composeClassName(styles.item(), className)}
      data-status={status}
      data-step={step}
      data-slot="stepper-item"
      {...rest}
    >
      {typeof children === "function" ? children(renderProps) : children}
    </div>
  );
}
