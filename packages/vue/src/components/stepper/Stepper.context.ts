import type { ComputedRef, InjectionKey } from 'vue'
import type { StepperVariants } from '@auronui/styles'

export type StepStatus = 'pending' | 'current' | 'completed' | 'error'

export interface StepperContext {
  currentStep: ComputedRef<number>
  orientation: ComputedRef<StepperVariants['orientation']>
  size: ComputedRef<StepperVariants['size']>
  color: ComputedRef<StepperVariants['color']>
  totalSteps: ComputedRef<number>
  getStepStatus: (step: number) => StepStatus
}

export const stepperContextKey = Symbol('Stepper') as InjectionKey<StepperContext>
