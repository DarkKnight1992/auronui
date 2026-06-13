import { inject, type Ref, type ComputedRef } from 'vue'
import { createContext } from '../../utils/context'
import type { FieldRules, CustomValidator } from './validation'

export type { FieldRules, CustomValidator }

export type ValidationMode = 'on-submit' | 'on-blur' | 'on-change'

export interface FieldRegistration {
  name: string
  getValue: () => unknown
  rules?: FieldRules
  validate?: CustomValidator
}

export interface FormContext {
  errors: Ref<Record<string, string>>
  isSubmitting: Ref<boolean>
  isDisabled: ComputedRef<boolean>
  validationMode: ComputedRef<ValidationMode>
  registerField(reg: FieldRegistration): void
  unregisterField(name: string): void
  triggerFieldValidation(name: string): Promise<void>
  setErrors(newErrors: Record<string, string>): void
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
