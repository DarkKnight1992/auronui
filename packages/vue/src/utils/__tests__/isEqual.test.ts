import { describe, it, expect } from 'vitest'
import { isEqual } from '../isEqual'

describe('isEqual', () => {
  it('compares primitives with Object.is', () => {
    expect(isEqual(1, 1)).toBe(true)
    expect(isEqual(NaN, NaN)).toBe(true)
    expect(isEqual('a', 'b')).toBe(false)
    expect(isEqual(undefined, null)).toBe(false)
  })
  it('compares arrays and plain objects structurally', () => {
    expect(isEqual(['a', { b: [1] }], ['a', { b: [1] }])).toBe(true)
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false)
    expect(isEqual({ a: 1 }, { a: 1, b: undefined })).toBe(false)
    expect(isEqual({ a: 1 }, { b: 1 })).toBe(false)
  })
  it('compares Dates by time and class instances by identity', () => {
    expect(isEqual(new Date(5), new Date(5))).toBe(true)
    class P { x = 1 }
    expect(isEqual(new P(), new P())).toBe(false)
    expect(isEqual([], {})).toBe(false)
  })
})
