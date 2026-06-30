import { describe, it, expect, vi } from 'vitest'
import { useSwatchPicker } from '../useSwatchPicker'

describe('useSwatchPicker', () => {
  it('starts with empty selection by default', () => {
    const { selectedColor } = useSwatchPicker()
    expect(selectedColor.value).toBe('')
  })

  it('respects defaultValue', () => {
    const { selectedColor } = useSwatchPicker({ defaultValue: '#ff0000' })
    expect(selectedColor.value).toBe('#ff0000')
  })

  it('hasSelection is false with empty selection', () => {
    const { hasSelection } = useSwatchPicker()
    expect(hasSelection.value).toBe(false)
  })

  it('hasSelection is true with a selection', () => {
    const { hasSelection } = useSwatchPicker({ defaultValue: '#ff0000' })
    expect(hasSelection.value).toBe(true)
  })

  it('setColor updates selectedColor', () => {
    const { selectedColor, setColor } = useSwatchPicker()
    setColor('#00ff00')
    expect(selectedColor.value).toBe('#00ff00')
  })

  it('setColor fires onChange callback', () => {
    const onChange = vi.fn()
    const { setColor } = useSwatchPicker({ onChange })
    setColor('#0000ff')
    expect(onChange).toHaveBeenCalledWith('#0000ff')
  })

  it('clearSelection resets to empty string', () => {
    const { selectedColor, setColor, clearSelection } = useSwatchPicker()
    setColor('#ff0000')
    clearSelection()
    expect(selectedColor.value).toBe('')
  })

  it('hasSelection becomes false after clearSelection', () => {
    const { hasSelection, setColor, clearSelection } = useSwatchPicker()
    setColor('#ff0000')
    expect(hasSelection.value).toBe(true)
    clearSelection()
    expect(hasSelection.value).toBe(false)
  })

  it('isSelected returns true for the active color', () => {
    const { isSelected, setColor } = useSwatchPicker()
    setColor('#ff0000')
    expect(isSelected('#ff0000')).toBe(true)
  })

  it('isSelected returns false for other colors', () => {
    const { isSelected, setColor } = useSwatchPicker()
    setColor('#ff0000')
    expect(isSelected('#00ff00')).toBe(false)
  })

  it('onColorChange updates selectedColor', () => {
    const { selectedColor, onColorChange } = useSwatchPicker()
    onColorChange('#ffffff')
    expect(selectedColor.value).toBe('#ffffff')
  })

  it('onColorChange fires onChange callback', () => {
    const onChange = vi.fn()
    const { onColorChange } = useSwatchPicker({ onChange })
    onColorChange('#123456')
    expect(onChange).toHaveBeenCalledWith('#123456')
  })

  it('can switch selection between colors', () => {
    const { selectedColor, setColor, isSelected } = useSwatchPicker()
    setColor('#ff0000')
    expect(isSelected('#ff0000')).toBe(true)
    setColor('#0000ff')
    expect(isSelected('#ff0000')).toBe(false)
    expect(isSelected('#0000ff')).toBe(true)
    expect(selectedColor.value).toBe('#0000ff')
  })
})
