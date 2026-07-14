import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { stepperVariants, type StepperVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { StepperProvider, type StepStatus } from "./stepper.context";
import { StepperItem } from "./StepperItem";
import { StepperIndicator } from "./StepperIndicator";
import { StepperTitle } from "./StepperTitle";
import { StepperDescription } from "./StepperDescription";
import { StepperSeparator } from "./StepperSeparator";
import { StepperContent } from "./StepperContent";

export interface StepperShorthandItem {
  title?: string;
  description?: string;
}

export interface StepperOwnProps {
  /** Current step (controlled) */
  value?: number;
  /** Default step for uncontrolled usage */
  defaultValue?: number;
  totalSteps?: number;
  orientation?: StepperVariants["orientation"];
  size?: StepperVariants["size"];
  color?: StepperVariants["color"];
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    item: ClassValue;
    indicator: ClassValue;
    separator: ClassValue;
    content: ClassValue;
    title: ClassValue;
    description: ClassValue;
  }>;
  /** Shorthand API: render steps from an array instead of the compound children API */
  items?: StepperShorthandItem[];
  onValueChange?: (step: number) => void;
  children?: ReactNode;
}

export type StepperProps = StepperOwnProps & Omit<ComponentPropsWithoutRef<"div">, keyof StepperOwnProps>;

export function Stepper({
  value,
  defaultValue = 1,
  totalSteps = 0,
  orientation = "horizontal",
  size = "md",
  color = "primary",
  className,
  classNames,
  items,
  onValueChange,
  children,
  ...rest
}: StepperProps) {
  // Stepper.vue has no built-in interactive control that advances
  // currentStep — consumers drive it externally (e.g. their own Button
  // wired to `value`/`onValueChange`). `onValueChange` is accepted purely
  // for API parity/future use by such external drivers; nothing in this
  // component itself ever calls it.
  void onValueChange;
  const currentStep = value ?? defaultValue;

  const styles = stepperVariants({ orientation, size, color });

  function getStepStatus(step: number): StepStatus {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "pending";
  }

  const resolvedTotalSteps = items ? items.length : totalSteps;

  const contextValue = {
    currentStep,
    orientation,
    size,
    color,
    totalSteps: resolvedTotalSteps,
    getStepStatus,
  };

  return (
    <div
      className={composeClassName(styles.base(), className, classNames?.base)}
      aria-label={`Step ${currentStep} of ${resolvedTotalSteps}`}
      data-slot="stepper"
      {...rest}
    >
      <StepperProvider value={contextValue}>
        {items ? (
          items.map((item, idx) => (
            <StepperItem key={idx + 1} step={idx + 1} className={classNames?.item}>
              <StepperIndicator className={classNames?.indicator}>{idx + 1}</StepperIndicator>
              {idx < items.length - 1 && <StepperSeparator className={classNames?.separator} />}
              <StepperContent className={classNames?.content}>
                {item.title && <StepperTitle className={classNames?.title}>{item.title}</StepperTitle>}
                {item.description && (
                  <StepperDescription className={classNames?.description}>{item.description}</StepperDescription>
                )}
              </StepperContent>
            </StepperItem>
          ))
        ) : (
          children
        )}
      </StepperProvider>
    </div>
  );
}
