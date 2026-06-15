import { inject, type Ref, type ComputedRef } from 'vue'
import { createContext } from '../../utils/context'
import type { FieldRules, CustomValidator } from './validation'

export type { FieldRules, CustomValidator }

export type ValidationMode = 'on-submit' | 'on-blur' | 'on-change'

export interface FieldRegistration {
  name: string
  getValue: () => unknown
  getDefaultValue: () => unknown
  setValue: (value: unknown) => void
  reset: () => void
  touched: Ref<boolean>
  dirty: Ref<boolean>
  rules?: FieldRules
  validate?: CustomValidator
}

export interface FormContext {
  errors: Ref<Record<string, string>>
  isSubmitting: Ref<boolean>
  isSubmitted: Ref<boolean>
  submitCount: Ref<number>
  isDisabled: ComputedRef<boolean>
  isValid: ComputedRef<boolean>
  isDirty: ComputedRef<boolean>
  isTouched: ComputedRef<boolean>
  validationMode: ComputedRef<ValidationMode>
  registerField(reg: FieldRegistration): void
  unregisterField(name: string): void
  triggerFieldValidation(name: string): Promise<void>
  setErrors(newErrors: Record<string, string>): void
  setError(name: string, message: string): void
  clearErrors(name?: string): void
  getValues(): Record<string, unknown>
  setValue(name: string, value: unknown): void
  trigger(name?: string): Promise<boolean>
  reset(): void
}

export const {
  useProvide: useFormProvide,
  useInject: _useFormInjectStrict,
  key: formContextKey,
} = createContext<FormContext>('Form')

/**
 * Inject Form context. Returns null when called outside a <Form> — callers
 * handle standalone mode themselves.
 */
export function useFormInject(): FormContext | null {
  return inject(formContextKey, null)
}
