import { describe, it, expect } from 'vitest'
import { buttonVariants } from '../button.styles'

describe('buttonVariants (slots)', () => {
  it('returns slot functions for base, startContent, label, endContent, spinner', () => {
    const slots = buttonVariants({})
    expect(typeof slots.base).toBe('function')
    expect(typeof slots.startContent).toBe('function')
    expect(typeof slots.label).toBe('function')
    expect(typeof slots.endContent).toBe('function')
    expect(typeof slots.spinner).toBe('function')
  })

  it('base slot includes "button" class always', () => {
    expect(buttonVariants({}).base()).toContain('button')
  })

  it('primary variant (default)', () => {
    expect(buttonVariants({ variant: 'primary' }).base()).toContain('button--primary')
  })

  it('success variant', () => {
    expect(buttonVariants({ variant: 'success' }).base()).toContain('button--success')
  })

  it('success-soft variant', () => {
    expect(buttonVariants({ variant: 'success-soft' }).base()).toContain('button--success-soft')
  })

  it('warning variant', () => {
    expect(buttonVariants({ variant: 'warning' }).base()).toContain('button--warning')
  })

  it('warning-soft variant', () => {
    expect(buttonVariants({ variant: 'warning-soft' }).base()).toContain('button--warning-soft')
  })

  it('danger variant', () => {
    expect(buttonVariants({ variant: 'danger' }).base()).toContain('button--danger')
  })

  it('danger-soft variant', () => {
    expect(buttonVariants({ variant: 'danger-soft' }).base()).toContain('button--danger-soft')
  })

  it('isLoading=true adds button--loading to base', () => {
    expect(buttonVariants({ isLoading: true }).base()).toContain('button--loading')
  })

  it('isLoading=true adds button__label--loading to label', () => {
    expect(buttonVariants({ isLoading: true }).label()).toContain('button__label--loading')
  })

  it('isLoading=false (default) does not add loading classes', () => {
    const slots = buttonVariants({ isLoading: false })
    expect(slots.base()).not.toContain('button--loading')
    expect(slots.label()).not.toContain('button__label--loading')
  })

  it('startContent slot', () => {
    expect(buttonVariants({}).startContent()).toContain('button__start-content')
  })

  it('endContent slot', () => {
    expect(buttonVariants({}).endContent()).toContain('button__end-content')
  })

  it('spinner slot', () => {
    expect(buttonVariants({}).spinner()).toContain('button__spinner')
  })

  it('fullWidth=true adds button--full-width', () => {
    expect(buttonVariants({ fullWidth: true }).base()).toContain('button--full-width')
  })

  it('isIconOnly=true adds button--icon-only', () => {
    expect(buttonVariants({ isIconOnly: true }).base()).toContain('button--icon-only')
  })
})
