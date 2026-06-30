import { describe, it, expect } from 'vitest'
import { useRadioGroup } from '../useRadioGroup'

describe('useRadioGroup', () => {
  it('starts with undefined value', () => {
    const { value } = useRadioGroup()
    expect(value.value).toBeUndefined()
  })

  it('respects defaultValue', () => {
    const { value } = useRadioGroup({ defaultValue: 'option-a' })
    expect(value.value).toBe('option-a')
  })

  it('setValue updates value', () => {
    const { value, setValue } = useRadioGroup()
    setValue('option-b')
    expect(value.value).toBe('option-b')
  })

  it('setValue replaces existing value', () => {
    const { value, setValue } = useRadioGroup({ defaultValue: 'option-a' })
    setValue('option-b')
    expect(value.value).toBe('option-b')
  })

  it('clear() resets to undefined', () => {
    const { value, clear } = useRadioGroup({ defaultValue: 'option-a' })
    clear()
    expect(value.value).toBeUndefined()
  })

  it('onValueChange updates value', () => {
    const { value, onValueChange } = useRadioGroup()
    onValueChange('option-c')
    expect(value.value).toBe('option-c')
  })
})
