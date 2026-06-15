import { describe, it, expect } from 'vitest'
import { runValidation } from '../validation'

describe('runValidation', () => {
  // ── required ────────────────────────────────────────────────────────────────
  it('required: true fails on empty string', async () => {
    expect(await runValidation('', { required: true })).toBe('This field is required')
  })
  it('required: true fails on undefined', async () => {
    expect(await runValidation(undefined, { required: true })).toBe('This field is required')
  })
  it('required: true fails on null', async () => {
    expect(await runValidation(null, { required: true })).toBe('This field is required')
  })
  it('required: true fails on empty array', async () => {
    expect(await runValidation([], { required: true })).toBe('This field is required')
  })
  it('required: true fails on false', async () => {
    expect(await runValidation(false, { required: true })).toBe('This field is required')
  })
  it('required: true passes on non-empty string', async () => {
    expect(await runValidation('hello', { required: true })).toBeUndefined()
  })
  it('required: true passes on 0 (zero is a valid number)', async () => {
    expect(await runValidation(0, { required: true })).toBeUndefined()
  })
  it('required: string uses the string as the error message', async () => {
    expect(await runValidation('', { required: 'Email is required' })).toBe('Email is required')
  })
  it('required: false never fails', async () => {
    expect(await runValidation('', { required: false })).toBeUndefined()
  })

  // ── email ───────────────────────────────────────────────────────────────────
  it('email: true fails on invalid email', async () => {
    expect(await runValidation('notanemail', { email: true })).toBe('Enter a valid email address')
  })
  it('email: true passes on valid email', async () => {
    expect(await runValidation('user@example.com', { email: true })).toBeUndefined()
  })
  it('email: string uses the string as the error message', async () => {
    expect(await runValidation('bad', { email: 'Bad email' })).toBe('Bad email')
  })
  it('email: skips empty value when required not set', async () => {
    expect(await runValidation('', { email: true })).toBeUndefined()
  })

  // ── url ─────────────────────────────────────────────────────────────────────
  it('url: true fails on plain text', async () => {
    expect(await runValidation('notaurl', { url: true })).toBe('Enter a valid URL')
  })
  it('url: true passes on https URL', async () => {
    expect(await runValidation('https://example.com', { url: true })).toBeUndefined()
  })
  it('url: true passes on http URL', async () => {
    expect(await runValidation('http://example.com/path?q=1', { url: true })).toBeUndefined()
  })
  it('url: string uses the string as the error message', async () => {
    expect(await runValidation('bad', { url: 'Invalid URL' })).toBe('Invalid URL')
  })
  it('url: skips empty value when required not set', async () => {
    expect(await runValidation('', { url: true })).toBeUndefined()
  })

  // ── integer ─────────────────────────────────────────────────────────────────
  it('integer: true fails on decimal number', async () => {
    expect(await runValidation('3.14', { integer: true })).toBe('Must be a whole number')
  })
  it('integer: true fails on float', async () => {
    expect(await runValidation(1.5, { integer: true })).toBe('Must be a whole number')
  })
  it('integer: true passes on whole number string', async () => {
    expect(await runValidation('42', { integer: true })).toBeUndefined()
  })
  it('integer: true passes on whole number', async () => {
    expect(await runValidation(0, { integer: true })).toBeUndefined()
  })
  it('integer: string uses the string as the error message', async () => {
    expect(await runValidation('1.1', { integer: 'Whole numbers only' })).toBe('Whole numbers only')
  })

  // ── pattern ─────────────────────────────────────────────────────────────────
  it('pattern: RegExp fails on non-matching string', async () => {
    expect(await runValidation('abc', { pattern: /^\d+$/ })).toBe('Invalid format')
  })
  it('pattern: RegExp passes on matching string', async () => {
    expect(await runValidation('123', { pattern: /^\d+$/ })).toBeUndefined()
  })
  it('pattern: object form uses custom message', async () => {
    const result = await runValidation('abc', { pattern: { value: /^\d+$/, message: 'Digits only' } })
    expect(result).toBe('Digits only')
  })

  // ── minLength ───────────────────────────────────────────────────────────────
  it('minLength: fails when string shorter than minimum', async () => {
    expect(await runValidation('hi', { minLength: 5 })).toBe('Must be at least 5 characters')
  })
  it('minLength: passes when string meets minimum', async () => {
    expect(await runValidation('hello', { minLength: 5 })).toBeUndefined()
  })
  it('minLength: object form uses custom message', async () => {
    const result = await runValidation('hi', { minLength: { value: 5, message: 'Too short' } })
    expect(result).toBe('Too short')
  })

  // ── maxLength ───────────────────────────────────────────────────────────────
  it('maxLength: fails when string longer than maximum', async () => {
    expect(await runValidation('toolongstring', { maxLength: 5 })).toBe('Must be at most 5 characters')
  })
  it('maxLength: passes when string within maximum', async () => {
    expect(await runValidation('hello', { maxLength: 5 })).toBeUndefined()
  })

  // ── min ─────────────────────────────────────────────────────────────────────
  it('min: fails when number below minimum', async () => {
    expect(await runValidation(3, { min: 5 })).toBe('Must be at least 5')
  })
  it('min: passes when number meets minimum', async () => {
    expect(await runValidation(5, { min: 5 })).toBeUndefined()
  })

  // ── max ─────────────────────────────────────────────────────────────────────
  it('max: fails when number above maximum', async () => {
    expect(await runValidation(10, { max: 5 })).toBe('Must be at most 5')
  })
  it('max: passes when number is at maximum', async () => {
    expect(await runValidation(5, { max: 5 })).toBeUndefined()
  })

  // ── matches ─────────────────────────────────────────────────────────────────
  it('matches: fails when value differs from the named field', async () => {
    const result = await runValidation('abc', { matches: 'password' }, undefined, { values: { password: 'xyz' } })
    expect(result).toBe('Must match password')
  })
  it('matches: passes when value equals the named field', async () => {
    const result = await runValidation('secret', { matches: 'password' }, undefined, { values: { password: 'secret' } })
    expect(result).toBeUndefined()
  })
  it('matches: object form uses custom message', async () => {
    const result = await runValidation('a', { matches: { value: 'password', message: 'Passwords must match' } }, undefined, { values: { password: 'b' } })
    expect(result).toBe('Passwords must match')
  })
  it('matches: fails when context is missing', async () => {
    const result = await runValidation('abc', { matches: 'password' })
    expect(result).toBe('Must match password')
  })

  // ── custom validate ─────────────────────────────────────────────────────────
  it('validate: sync — returns error string when invalid', async () => {
    const validate = (v: unknown) => (v === 'bad' ? 'Custom error' : undefined)
    expect(await runValidation('bad', {}, validate)).toBe('Custom error')
  })
  it('validate: async — resolves error string', async () => {
    const validate = async (v: unknown) => (v === 'bad' ? 'Async error' : undefined)
    expect(await runValidation('bad', {}, validate)).toBe('Async error')
  })
  it('validate: returns undefined when valid', async () => {
    const validate = (_v: unknown) => undefined
    expect(await runValidation('good', {}, validate)).toBeUndefined()
  })
  it('validate: runs after built-in rules — wins when it returns a string', async () => {
    const validate = () => 'Custom wins'
    expect(await runValidation('hello', { required: true }, validate)).toBe('Custom wins')
  })
  it('validate: receives context with all form values', async () => {
    let receivedContext: unknown
    const validate = (_v: unknown, ctx: unknown) => { receivedContext = ctx; return undefined }
    await runValidation('x', {}, validate, { values: { other: 'y' } })
    expect(receivedContext).toEqual({ values: { other: 'y' } })
  })

  // ── no rules ────────────────────────────────────────────────────────────────
  it('no rules, no validate — always returns undefined', async () => {
    expect(await runValidation('anything')).toBeUndefined()
  })

  // ── rule ordering ────────────────────────────────────────────────────────────
  it('required fires before email when value is empty', async () => {
    expect(await runValidation('', { required: true, email: true })).toBe('This field is required')
  })
})
