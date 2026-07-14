import { useCallback, useState } from "react";

export type StepStatus = "completed" | "current" | "pending";

export interface UseStepperOptions {
  /** Total number of steps. Ignored when `steps` array is provided. */
  totalSteps?: number;
  /** Step items — `totalSteps` is derived from `steps.length` when provided. */
  steps?: unknown[];
  /** Initial step for uncontrolled usage. Defaults to 1. */
  defaultStep?: number;
}

export interface UseStepperReturn {
  /** Current step (1-based). */
  step: number;
  /** Total number of steps. */
  totalSteps: number;
  /** Whether the stepper is on the first step. */
  isFirst: boolean;
  /** Whether the stepper is on the last step. */
  isLast: boolean;
  /** Navigate to a specific step number. Clamps to valid range. */
  goToStep: (step: number) => void;
  /** Advance to the next step. No-op on the last step. */
  nextStep: () => void;
  /** Go back to the previous step. No-op on the first step. */
  prevStep: () => void;
  /** Return to the first step. */
  reset: () => void;
  /** Returns the display status for a given step number. */
  getStepStatus: (step: number) => StepStatus;
  /**
   * Pass as the `onValueChange` handler on the Stepper component.
   * Keeps `step` in sync when the component changes step internally.
   */
  onStepChange: (step: number) => void;
}

/**
 * Manages step navigation state for the Stepper component.
 *
 * @example
 * ```tsx
 * const stepper = useStepper({ totalSteps: 4 })
 * ```
 * ```tsx
 * <Stepper value={stepper.step} totalSteps={stepper.totalSteps} onValueChange={stepper.onStepChange}>
 *   ...
 * </Stepper>
 * ```
 */
export function useStepper(options: UseStepperOptions = {}): UseStepperReturn {
  const [step, setStep] = useState(options.defaultStep ?? 1);

  const totalSteps = options.steps ? options.steps.length : (options.totalSteps ?? 0);

  const isFirst = step <= 1;
  const isLast = totalSteps > 0 && step >= totalSteps;

  const goToStep = useCallback(
    (n: number): void => {
      const max = totalSteps || Infinity;
      setStep(Math.max(1, Math.min(n, max)));
    },
    [totalSteps],
  );

  const nextStep = useCallback((): void => {
    if (!isLast) goToStep(step + 1);
  }, [isLast, goToStep, step]);

  const prevStep = useCallback((): void => {
    if (!isFirst) goToStep(step - 1);
  }, [isFirst, goToStep, step]);

  const reset = useCallback((): void => {
    goToStep(1);
  }, [goToStep]);

  const getStepStatus = useCallback(
    (n: number): StepStatus => {
      if (n < step) return "completed";
      if (n === step) return "current";
      return "pending";
    },
    [step],
  );

  const onStepChange = useCallback(
    (n: number): void => {
      goToStep(n);
    },
    [goToStep],
  );

  return {
    step,
    totalSteps,
    isFirst,
    isLast,
    goToStep,
    nextStep,
    prevStep,
    reset,
    getStepStatus,
    onStepChange,
  };
}
