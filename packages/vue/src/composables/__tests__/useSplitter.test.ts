import { describe, it, expect } from 'vitest'
import { useSplitter } from '../useSplitter'

describe('useSplitter', () => {
  it('starts with empty sizes by default', () => {
    const { sizes } = useSplitter()
    expect(sizes.value).toEqual([])
  })

  it('respects defaultSizes', () => {
    const { sizes } = useSplitter({ defaultSizes: [30, 70] })
    expect(sizes.value).toEqual([30, 70])
  })

  it('onLayout updates sizes', () => {
    const { sizes, onLayout } = useSplitter({ defaultSizes: [50, 50] })
    onLayout([35, 65])
    expect(sizes.value).toEqual([35, 65])
  })

  it('setSizes replaces sizes directly', () => {
    const { sizes, setSizes } = useSplitter({ defaultSizes: [30, 70] })
    setSizes([60, 40])
    expect(sizes.value).toEqual([60, 40])
  })

  it('resetSizes restores defaultSizes', () => {
    const { sizes, onLayout, resetSizes } = useSplitter({ defaultSizes: [30, 70] })
    onLayout([80, 20])
    resetSizes()
    expect(sizes.value).toEqual([30, 70])
  })

  it('resetSizes gives empty array when no defaultSizes', () => {
    const { sizes, setSizes, resetSizes } = useSplitter()
    setSizes([50, 50])
    resetSizes()
    expect(sizes.value).toEqual([])
  })

  it('setSizes does not mutate defaultSizes', () => {
    const defaults = [30, 70]
    const { setSizes, resetSizes, sizes } = useSplitter({ defaultSizes: defaults })
    setSizes([10, 90])
    resetSizes()
    expect(sizes.value).toEqual([30, 70])
  })
})
