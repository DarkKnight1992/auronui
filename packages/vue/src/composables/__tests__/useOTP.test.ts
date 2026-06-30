import { describe, it, expect, vi } from 'vitest'
import { useOTP } from '../useOTP'

describe('useOTP', () => {
  it('starts with empty value by default', () => {
    const { value } = useOTP()
    expect(value.value).toBe('')
  })

  it('respects defaultValue', () => {
    const { value } = useOTP({ defaultValue: '123' })
    expect(value.value).toBe('123')
  })

  it('defaults length to 6', () => {
    const { isComplete } = useOTP()
    expect(isComplete.value).toBe(false)
  })

  it('isComplete is true when value length equals configured length', () => {
    const { isComplete, onValueChange } = useOTP({ length: 4 })
    onValueChange('1234')
    expect(isComplete.value).toBe(true)
  })

  it('isComplete is false when value is shorter than length', () => {
    const { isComplete, onValueChange } = useOTP({ length: 6 })
    onValueChange('123')
    expect(isComplete.value).toBe(false)
  })

  it('onValueChange updates the value', () => {
    const { value, onValueChange } = useOTP()
    onValueChange('456')
    expect(value.value).toBe('456')
  })

  it('onValueChange fires onChange callback', () => {
    const onChange = vi.fn()
    const { onValueChange } = useOTP({ onChange })
    onValueChange('789')
    expect(onChange).toHaveBeenCalledWith('789')
  })

  it('onOTPComplete updates the value', () => {
    const { value, onOTPComplete } = useOTP({ length: 4 })
    onOTPComplete('9999')
    expect(value.value).toBe('9999')
  })

  it('onOTPComplete fires onComplete callback', () => {
    const onComplete = vi.fn()
    const { onOTPComplete } = useOTP({ onComplete, length: 4 })
    onOTPComplete('4321')
    expect(onComplete).toHaveBeenCalledWith('4321')
  })

  it('reset clears the value', () => {
    const { value, onValueChange, reset } = useOTP()
    onValueChange('123456')
    reset()
    expect(value.value).toBe('')
  })

  it('isComplete becomes false after reset', () => {
    const { isComplete, onValueChange, reset } = useOTP({ length: 6 })
    onValueChange('123456')
    expect(isComplete.value).toBe(true)
    reset()
    expect(isComplete.value).toBe(false)
  })

  it('uses custom length', () => {
    const { isComplete, onValueChange } = useOTP({ length: 4 })
    onValueChange('12')
    expect(isComplete.value).toBe(false)
    onValueChange('1234')
    expect(isComplete.value).toBe(true)
  })
})
