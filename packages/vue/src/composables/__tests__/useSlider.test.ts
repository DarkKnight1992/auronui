import { describe, it, expect } from 'vitest'
import { useSlider } from '../useSlider'

describe('useSlider', () => {
  it('defaults to min value', () => {
    const { value } = useSlider({ min: 0, max: 100 })
    expect(value.value).toBe(0)
  })

  it('respects defaultValue', () => {
    const { value } = useSlider({ defaultValue: 50 })
    expect(value.value).toBe(50)
  })

  it('supports range mode with array defaultValue', () => {
    const { value } = useSlider({ defaultValue: [20, 80] })
    expect(value.value).toEqual([20, 80])
  })

  it('exposes min, max, step', () => {
    const slider = useSlider({ min: 10, max: 200, step: 5 })
    expect(slider.min).toBe(10)
    expect(slider.max).toBe(200)
    expect(slider.step).toBe(5)
  })

  it('setValue updates value', () => {
    const { value, setValue } = useSlider({ defaultValue: 20 })
    setValue(60)
    expect(value.value).toBe(60)
  })

  it('onValueChange updates value', () => {
    const { value, onValueChange } = useSlider()
    onValueChange(75)
    expect(value.value).toBe(75)
  })

  it('clamp() clamps single value to [min, max]', () => {
    const { clamp } = useSlider({ min: 0, max: 100 })
    expect(clamp(150)).toBe(100)
    expect(clamp(-10)).toBe(0)
    expect(clamp(50)).toBe(50)
  })

  it('clamp() clamps each value in an array', () => {
    const { clamp } = useSlider({ min: 0, max: 100 })
    expect(clamp([-5, 110])).toEqual([0, 100])
  })
})
