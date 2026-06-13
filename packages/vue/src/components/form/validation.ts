type RuleWithMessage<T> = T | { value: T; message: string }

export interface FieldRules {
  required?: boolean | string
  email?: boolean | string
  pattern?: RuleWithMessage<RegExp>
  minLength?: RuleWithMessage<number>
  maxLength?: RuleWithMessage<number>
  min?: RuleWithMessage<number>
  max?: RuleWithMessage<number>
}

export type CustomValidator = (value: unknown) => string | undefined | Promise<string | undefined>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null || value === '' || value === false) return true
  if (Array.isArray(value) && value.length === 0) return true
  return false
}

function resolveSimpleRule(rule: boolean | string): { enabled: boolean; message: string | undefined } {
  if (typeof rule === 'string') return { enabled: true, message: rule }
  return { enabled: rule, message: undefined }
}

function resolveNumericRule(rule: number | { value: number; message: string }): { value: number; message: string | undefined } {
  if (typeof rule === 'number') return { value: rule, message: undefined }
  return rule
}

function resolvePatternRule(rule: RegExp | { value: RegExp; message: string }): { value: RegExp; message: string | undefined } {
  if (rule instanceof RegExp) return { value: rule, message: undefined }
  return rule
}

export async function runValidation(
  value: unknown,
  rules?: FieldRules,
  validate?: CustomValidator,
): Promise<string | undefined> {
  if (!rules && !validate) return undefined

  if (rules?.required !== undefined) {
    const { enabled, message } = resolveSimpleRule(rules.required)
    if (enabled && isEmpty(value)) return message ?? 'This field is required'
  }

  if (isEmpty(value)) {
    if (validate) return await validate(value)
    return undefined
  }

  if (rules?.email !== undefined) {
    const { enabled, message } = resolveSimpleRule(rules.email)
    if (enabled && !EMAIL_REGEX.test(String(value))) return message ?? 'Enter a valid email address'
  }

  if (rules?.pattern !== undefined) {
    const { value: regex, message } = resolvePatternRule(rules.pattern)
    if (!regex.test(String(value))) return message ?? 'Invalid format'
  }

  if (rules?.minLength !== undefined) {
    const { value: min, message } = resolveNumericRule(rules.minLength)
    const len = Array.isArray(value) ? value.length : String(value).length
    if (len < min) return message ?? `Must be at least ${min} characters`
  }

  if (rules?.maxLength !== undefined) {
    const { value: max, message } = resolveNumericRule(rules.maxLength)
    const len = Array.isArray(value) ? value.length : String(value).length
    if (len > max) return message ?? `Must be at most ${max} characters`
  }

  if (rules?.min !== undefined) {
    const { value: minVal, message } = resolveNumericRule(rules.min)
    if (Number(value) < minVal) return message ?? `Must be at least ${minVal}`
  }

  if (rules?.max !== undefined) {
    const { value: maxVal, message } = resolveNumericRule(rules.max)
    if (Number(value) > maxVal) return message ?? `Must be at most ${maxVal}`
  }

  if (validate) return await validate(value)

  return undefined
}
