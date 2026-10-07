import { describe, it, expect, vi, afterEach } from 'vitest'
import { safeHref } from '../safeHref'

describe('safeHref', () => {
  afterEach(() => vi.restoreAllMocks())

  it.each([
    'https://example.com', '/relative/path', '#anchor', '?q=1', 'mailto:a@b.c', 'tel:+123',
    'data:image/png;base64,AAAA', 'javascripts/app.js', '',
  ])('keeps %j', (href) => {
    expect(safeHref(href)).toBe(href)
  })

  it('passes undefined through', () => {
    expect(safeHref(undefined)).toBeUndefined()
  })

  it.each([
    'javascript:alert(1)', 'JavaScript:alert(1)', '  javascript:alert(1)', 'java\tscript:alert(1)',
    'java\nscript:alert(1)', '\u0000javascript:alert(1)', 'vbscript:msgbox(1)',
  ])('drops %j (script URL) and warns', (href) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(safeHref(href)).toBeUndefined()
    expect(warn).toHaveBeenCalled()
  })
})
