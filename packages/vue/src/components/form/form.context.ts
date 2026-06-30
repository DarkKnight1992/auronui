import { inject, type Ref, type ComputedRef } from 'vue'
import { createContext } from '../../utils/context'
import type { FieldRules, CustomValidator } from './validation'

export type { FieldRules, CustomValidator }

export type ValidationMode = 'on-submit' | 'on-blur' | 'on-change'

export interface FieldRegistration {
  name: string
  valueRef: Ref<unknown>          // reactive ref — powers values computed and deps watching
  getValue: () => unknown
  getDefaultValue: () => unknown
  setValue: (value: unknown) => void
  reset: () => void
  touched: Ref<boolean>
  dirty: Ref<boolean>
  rules?: FieldRules
  validate?: CustomValidator
}

export interface FormOptions {
  defaultValues?: Record<string, unknown>
  validationMode?: ValidationMode
  isDisabled?: boolean
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
  values: ComputedRef<Record<string, unknown>>
  defaultValues: Record<string, unknown>
  registerField(reg: FieldRegistration): void
  unregisterField(name: string): void
  triggerFieldValidation(name: string): Promise<void>
  getFieldRef(name: string): Ref<unknown> | undefined
  setErrors(newErrors: Record<string, string>): void
  setError(name: string, message: string): void
  clearErrors(name?: string): void
  getValues(): Record<string, unknown>
  setValue(name: string, value: unknown): void
  trigger(name?: string): Promise<boolean>
  reset(): void
  handleSubmit(
    onValid: (
      values: Record<string, unknown>,
      helpers: { setErrors(errors: Record<string, string>): void },
    ) => void | Promise<void>,
    onInvalid?: (errors: Record<string, string>) => void,
  ): Promise<void>
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
