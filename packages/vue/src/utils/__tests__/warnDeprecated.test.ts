import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('warnDeprecatedVariant', () => {
  beforeEach(() => {
    vi.stubEnv('DEV', true)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    // Reset the module so the warned Set is cleared between tests
    vi.resetModules()
  })

  it('emits a console.warn with component, deprecated, and canonical names', async () => {
    const { warnDeprecatedVariant } = await import('../warnDeprecated')
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    expect(console.warn).toHaveBeenCalledWith(
      '[AuronUI] Button: variant="outline" is deprecated, use variant="bordered" instead.'
    )
  })

  it('only warns once per unique component+value combination', async () => {
    const { warnDeprecatedVariant } = await import('../warnDeprecated')
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    expect(console.warn).toHaveBeenCalledTimes(1)
  })

  it('warns separately for different components with the same deprecated value', async () => {
    const { warnDeprecatedVariant } = await import('../warnDeprecated')
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    warnDeprecatedVariant('Chip', 'outline', 'bordered')
    expect(console.warn).toHaveBeenCalledTimes(2)
  })

  it('suppresses warning when DEV is false', async () => {
    vi.stubEnv('DEV', false)
    const { warnDeprecatedVariant } = await import('../warnDeprecated')
    warnDeprecatedVariant('Button', 'outline', 'bordered')
    expect(console.warn).not.toHaveBeenCalled()
  })
})
