import { describe, it, expect } from 'vitest'

describe('form/index.ts exports', () => {
  it('exports useForm', async () => {
    const mod = await import('../index')
    expect(typeof mod.useForm).toBe('function')
  })

  it('exports useField', async () => {
    const mod = await import('../index')
    expect(typeof mod.useField).toBe('function')
  })
})

describe('@auronui/vue re-exports', () => {
  it('re-exports useForm from main index', async () => {
    const mod = await import('../../../index')
    expect(typeof mod.useForm).toBe('function')
  }, 30_000)

  it('re-exports useField from main index', async () => {
    const mod = await import('../../../index')
    expect(typeof mod.useField).toBe('function')
  }, 30_000)
})
