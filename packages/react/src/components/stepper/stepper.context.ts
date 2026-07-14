import type { StepperVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export type StepStatus = "pending" | "current" | "completed" | "error";

export interface StepperContext {
  currentStep: number;
  orientation: StepperVariants["orientation"];
  size: StepperVariants["size"];
  color: StepperVariants["color"];
  totalSteps: number;
  getStepStatus: (step: number) => StepStatus;
}

export const stepperContextDefaults: StepperContext = {
  currentStep: 1,
  orientation: "horizontal",
  size: "md",
  color: "primary",
  totalSteps: 0,
  getStepStatus: () => "pending",
};

export const { Provider: StepperProvider, useStrictContext: useStepperContext } =
  createStrictContext<StepperContext>("Stepper");
