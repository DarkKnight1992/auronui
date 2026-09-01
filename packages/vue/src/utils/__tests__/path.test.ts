import { describe, it, expect } from 'vitest'
import { getPath, setPath, flattenPaths, toPathSegments } from '../path'

describe('getPath', () => {
  const source = {
    flat: 1,
    'literal.dotted': 'wins',
    a: { b: { c: { d: 'deep' } } },
    items: [{ name: 'first' }, { name: 'second' }],
    literal: { dotted: 'loses' },
    nullish: null,
  }

  it('reads a flat key', () => expect(getPath(source, 'flat')).toBe(1))
  it('reads a nested path', () => expect(getPath(source, 'a.b')).toEqual({ c: { d: 'deep' } }))
  it('reads a deeply nested leaf', () => expect(getPath(source, 'a.b.c.d')).toBe('deep'))
  it('indexes into arrays', () => expect(getPath(source, 'items.1.name')).toBe('second'))
  it('prefers a literal dotted key over walking', () => expect(getPath(source, 'literal.dotted')).toBe('wins'))
  it('returns undefined for a missing path', () => expect(getPath(source, 'a.b.nope.x')).toBeUndefined())
  it('returns undefined when walking through null', () => expect(getPath(source, 'nullish.x')).toBeUndefined())
  it('returns undefined for a non-object source', () => expect(getPath(42, 'a.b')).toBeUndefined())
  it('refuses prototype keys', () => expect(getPath(source, '__proto__.polluted')).toBeUndefined())
})

describe('setPath', () => {
  it('sets a flat key', () => {
    const t: Record<string, unknown> = {}
    setPath(t, 'a', 1)
    expect(t).toEqual({ a: 1 })
  })

  it('creates intermediate objects at any depth', () => {
    const t: Record<string, unknown> = {}
    setPath(t, 'a.b.c.d', 'deep')
    expect(t).toEqual({ a: { b: { c: { d: 'deep' } } } })
  })

  it('creates an array when the next segment is numeric', () => {
    const t: Record<string, unknown> = {}
    setPath(t, 'items.0.name', 'first')
    setPath(t, 'items.1.name', 'second')
    expect(t).toEqual({ items: [{ name: 'first' }, { name: 'second' }] })
    expect(Array.isArray((t as { items: unknown[] }).items)).toBe(true)
  })

  it('descends into existing containers instead of clobbering', () => {
    const t: Record<string, unknown> = { a: { keep: 1 } }
    setPath(t, 'a.add', 2)
    expect(t).toEqual({ a: { keep: 1, add: 2 } })
  })

  it('refuses to write through prototype keys', () => {
    const t: Record<string, unknown> = {}
    setPath(t, '__proto__.polluted', 'yes')
    setPath(t, 'a.constructor.polluted', 'yes')
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
    expect(Object.prototype).not.toHaveProperty('polluted')
  })
})

describe('flattenPaths', () => {
  it('walks an object to its leaves', () => {
    expect(flattenPaths({ a: { b: 1 }, c: 2 }, 'root')).toEqual([
      { path: 'root.a.b', value: 1 },
      { path: 'root.c', value: 2 },
    ])
  })

  it('treats a scalar as its own leaf', () => {
    expect(flattenPaths(5, 'x')).toEqual([{ path: 'x', value: 5 }])
  })

  it('treats an empty object or array as a leaf', () => {
    expect(flattenPaths({}, 'x')).toEqual([{ path: 'x', value: {} }])
    expect(flattenPaths([], 'x')).toEqual([{ path: 'x', value: [] }])
  })

  it('indexes array entries', () => {
    expect(flattenPaths([{ n: 1 }], 'rows')).toEqual([{ path: 'rows.0.n', value: 1 }])
  })

  it('treats a class instance as a leaf, not a subtree', () => {
    const date = new Date(0)
    expect(flattenPaths({ when: date }, 'r')).toEqual([{ path: 'r.when', value: date }])
  })
})

describe('toPathSegments', () => {
  it('splits on dots', () => expect(toPathSegments('a.b.c')).toEqual(['a', 'b', 'c']))
  it('returns a single segment when there is no dot', () => expect(toPathSegments('a')).toEqual(['a']))
})
