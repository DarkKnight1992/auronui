import { describe, it, expect } from 'vitest'
import { useStepper } from '../useStepper'

describe('useStepper', () => {
  it('starts at step 1 by default', () => {
    const { step } = useStepper({ totalSteps: 3 })
    expect(step.value).toBe(1)
  })

  it('respects defaultStep option', () => {
    const { step } = useStepper({ totalSteps: 5, defaultStep: 3 })
    expect(step.value).toBe(3)
  })

  it('derives totalSteps from steps array', () => {
    const { totalSteps } = useStepper({ steps: ['a', 'b', 'c'] })
    expect(totalSteps.value).toBe(3)
  })

  it('isFirst is true at step 1', () => {
    const { isFirst } = useStepper({ totalSteps: 3 })
    expect(isFirst.value).toBe(true)
  })

  it('isLast is true at final step', () => {
    const { isLast } = useStepper({ totalSteps: 3, defaultStep: 3 })
    expect(isLast.value).toBe(true)
  })

  it('nextStep advances by 1', () => {
    const { step, nextStep } = useStepper({ totalSteps: 3 })
    nextStep()
    expect(step.value).toBe(2)
  })

  it('nextStep is a no-op on last step', () => {
    const { step, nextStep } = useStepper({ totalSteps: 3, defaultStep: 3 })
    nextStep()
    expect(step.value).toBe(3)
  })

  it('prevStep goes back by 1', () => {
    const { step, prevStep } = useStepper({ totalSteps: 3, defaultStep: 2 })
    prevStep()
    expect(step.value).toBe(1)
  })

  it('prevStep is a no-op on first step', () => {
    const { step, prevStep } = useStepper({ totalSteps: 3 })
    prevStep()
    expect(step.value).toBe(1)
  })

  it('reset returns to step 1', () => {
    const { step, nextStep, reset } = useStepper({ totalSteps: 3 })
    nextStep()
    nextStep()
    reset()
    expect(step.value).toBe(1)
  })

  it('goToStep clamps to valid range', () => {
    const { step, goToStep } = useStepper({ totalSteps: 3 })
    goToStep(99)
    expect(step.value).toBe(3)
    goToStep(-1)
    expect(step.value).toBe(1)
  })

  it('getStepStatus returns correct status', () => {
    const { getStepStatus, nextStep } = useStepper({ totalSteps: 3 })
    nextStep()
    expect(getStepStatus(1)).toBe('completed')
    expect(getStepStatus(2)).toBe('current')
    expect(getStepStatus(3)).toBe('pending')
  })

  it('onStepChange updates step', () => {
    const { step, onStepChange } = useStepper({ totalSteps: 3 })
    onStepChange(2)
    expect(step.value).toBe(2)
  })
})
