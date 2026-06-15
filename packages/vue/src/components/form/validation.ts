type RuleWithMessage<T> = T | { value: T; message: string }

export interface FieldRules {
  required?: boolean | string
  email?: boolean | string
  url?: boolean | string
  integer?: boolean | string
  pattern?: RuleWithMessage<RegExp>
  minLength?: RuleWithMessage<number>
  maxLength?: RuleWithMessage<number>
  min?: RuleWithMessage<number>
  max?: RuleWithMessage<number>
  /** Match the value of another field by name (e.g. confirm password). */
  matches?: RuleWithMessage<string>
}

export interface ValidationContext {
  /** All current form field values — available for cross-field rules and custom validators. */
  values: Record<string, unknown>
}

export type CustomValidator = (
  value: unknown,
  context?: ValidationContext,
) => string | undefined | Promise<string | undefined>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i

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

function resolveStringRule(rule: string | { value: string; message: string }): { value: string; message: string | undefined } {
  if (typeof rule === 'string') return { value: rule, message: undefined }
  return rule
}

export async function runValidation(
  value: unknown,
  rules?: FieldRules,
  validate?: CustomValidator,
  context?: ValidationContext,
): Promise<string | undefined> {
  if (!rules && !validate) return undefined

  if (rules?.required !== undefined) {
    const { enabled, message } = resolveSimpleRule(rules.required)
    if (enabled && isEmpty(value)) return message ?? 'This field is required'
  }

  if (isEmpty(value)) {
    if (validate) return await validate(value, context)
    return undefined
  }

  if (rules?.email !== undefined) {
    const { enabled, message } = resolveSimpleRule(rules.email)
    if (enabled && !EMAIL_REGEX.test(String(value))) return message ?? 'Enter a valid email address'
  }

  if (rules?.url !== undefined) {
    const { enabled, message } = resolveSimpleRule(rules.url)
    if (enabled && !URL_REGEX.test(String(value))) return message ?? 'Enter a valid URL'
  }

  if (rules?.integer !== undefined) {
    const { enabled, message } = resolveSimpleRule(rules.integer)
    if (enabled && !Number.isInteger(Number(value))) return message ?? 'Must be a whole number'
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

  if (rules?.matches !== undefined) {
    const { value: fieldName, message } = resolveStringRule(rules.matches)
    const otherValue = context?.values[fieldName]
    if (value !== otherValue) return message ?? `Must match ${fieldName}`
  }

  if (validate) return await validate(value, context)

  return undefined
}
