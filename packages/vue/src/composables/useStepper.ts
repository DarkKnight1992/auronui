import { ref, computed, type Ref, type ComputedRef } from 'vue'

export type StepStatus = 'completed' | 'current' | 'pending'

export interface UseStepperOptions {
  /** Total number of steps. Ignored when `steps` array is provided. */
  totalSteps?: number
  /** Step items — `totalSteps` is derived from `steps.length` when provided. */
  steps?: unknown[]
  /** Initial step for uncontrolled usage. Defaults to 1. */
  defaultStep?: number
}

export interface UseStepperReturn {
  /** Reactive current step (1-based). */
  step: Ref<number>
  /** Total number of steps. */
  totalSteps: ComputedRef<number>
  /** Whether the stepper is on the first step. */
  isFirst: ComputedRef<boolean>
  /** Whether the stepper is on the last step. */
  isLast: ComputedRef<boolean>
  /** Navigate to a specific step number. Clamps to valid range. */
  goToStep: (step: number) => void
  /** Advance to the next step. No-op on the last step. */
  nextStep: () => void
  /** Go back to the previous step. No-op on the first step. */
  prevStep: () => void
  /** Return to the first step. */
  reset: () => void
  /** Returns the display status for a given step number. */
  getStepStatus: (step: number) => StepStatus
  /**
   * Pass as `@update:model-value` handler on the Stepper component.
   * Keeps `step` in sync when the component changes step internally.
   */
  onStepChange: (step: number) => void
}

/**
 * Manages step navigation state for the Stepper component.
 *
 * @example
 * ```ts
 * const stepper = useStepper({ totalSteps: 4 })
 * ```
 * ```html
 * <Stepper :model-value="stepper.step" :total-steps="stepper.totalSteps" @update:model-value="stepper.onStepChange">
 *   ...
 * </Stepper>
 * ```
 */
export function useStepper(options: UseStepperOptions = {}): UseStepperReturn {
  const step = ref(options.defaultStep ?? 1)

  const totalSteps = computed(() =>
    options.steps ? options.steps.length : (options.totalSteps ?? 0)
  )

  const isFirst = computed(() => step.value <= 1)
  const isLast = computed(() => totalSteps.value > 0 && step.value >= totalSteps.value)

  function goToStep(n: number): void {
    const max = totalSteps.value || Infinity
    step.value = Math.max(1, Math.min(n, max))
  }

  function nextStep(): void {
    if (!isLast.value) goToStep(step.value + 1)
  }

  function prevStep(): void {
    if (!isFirst.value) goToStep(step.value - 1)
  }

  function reset(): void {
    goToStep(1)
  }

  function getStepStatus(n: number): StepStatus {
    if (n < step.value) return 'completed'
    if (n === step.value) return 'current'
    return 'pending'
  }

  function onStepChange(n: number): void {
    goToStep(n)
  }

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
  }
}
