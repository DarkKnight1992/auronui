import { computed, ref, type Ref, type ComputedRef } from 'vue'
import { runValidation } from './validation'
import type { FormContext, FieldRegistration, ValidationMode } from './form.context'

// Internal options — callers pass Refs so reactive props (from Form.vue's toRef) stay live
interface FormStateOptions {
  defaultValues?: Record<string, unknown>
  validationMode?: Ref<ValidationMode>
  isDisabled?: Ref<boolean>
}

export function createFormState(options: FormStateOptions = {}): FormContext {
  const { defaultValues = {} } = options

  const errors = ref<Record<string, string>>({})
  const isSubmitting = ref(false)
  const isSubmitted = ref(false)
  const submitCount = ref(0)
  const fields = new Map<string, FieldRegistration>()
  const fieldCount = ref(0)

  // ── Registration ─────────────────────────────────────────────────────────────

  function registerField(reg: FieldRegistration): void {
    fields.set(reg.name, reg)
    fieldCount.value++
  }

  function unregisterField(name: string): void {
    fields.delete(name)
    fieldCount.value--
    const next = { ...errors.value }
    delete next[name]
    errors.value = next
  }

  // ── Reactive values ─────────────────────────────────────────────────────────

  const values: ComputedRef<Record<string, unknown>> = computed(() => {
    void fieldCount.value // track register/unregister events
    const result: Record<string, unknown> = {}
    for (const [name, field] of fields.entries()) {
      result[name] = field.valueRef.value
    }
    return result
  })

  function getFieldRef(name: string): Ref<unknown> | undefined {
    return fields.get(name)?.valueRef
  }

  // ── Computed state ──────────────────────────────────────────────────────────

  const isValid: ComputedRef<boolean> = computed(() => {
    void fieldCount.value
    return Object.keys(errors.value).length === 0
  })

  const isDirty: ComputedRef<boolean> = computed(() => {
    void fieldCount.value
    for (const field of fields.values()) {
      if (field.dirty.value) return true
    }
    return false
  })

  const isTouched: ComputedRef<boolean> = computed(() => {
    void fieldCount.value
    for (const field of fields.values()) {
      if (field.touched.value) return true
    }
    return false
  })

  const validationMode: ComputedRef<ValidationMode> = computed(
    () => options.validationMode?.value ?? 'on-submit',
  )

  const isDisabled: ComputedRef<boolean> = computed(
    () => options.isDisabled?.value ?? false,
  )

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function getAllValues(): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const [name, field] of fields.entries()) {
      result[name] = field.getValue()
    }
    return result
  }

  // ── Validation ───────────────────────────────────────────────────────────────

  async function triggerFieldValidation(name: string): Promise<void> {
    const field = fields.get(name)
    if (!field) return
    const error = await runValidation(
      field.getValue(),
      field.rules,
      field.validate,
      { values: getAllValues() },
    )
    const next = { ...errors.value }
    if (error) {
      next[name] = error
    } else {
      delete next[name]
    }
    errors.value = next
  }

  async function trigger(name?: string): Promise<boolean> {
    if (name) {
      await triggerFieldValidation(name)
      return !errors.value[name]
    }
    const results = await Promise.all(
      [...fields.entries()].map(async ([fieldName, field]) => {
        const error = await runValidation(
          field.getValue(),
          field.rules,
          field.validate,
          { values: getAllValues() },
        )
        return { name: fieldName, error }
      }),
    )
    const next: Record<string, string> = {}
    for (const { name: fieldName, error } of results) {
      if (error) next[fieldName] = error
    }
    errors.value = next
    return Object.keys(next).length === 0
  }

  // ── Error management ─────────────────────────────────────────────────────────

  function setErrors(newErrors: Record<string, string>): void {
    errors.value = { ...errors.value, ...newErrors }
    isSubmitting.value = false
  }

  function setError(name: string, message: string): void {
    errors.value = { ...errors.value, [name]: message }
  }

  function clearErrors(name?: string): void {
    if (name) {
      const next = { ...errors.value }
      delete next[name]
      errors.value = next
    } else {
      errors.value = {}
    }
  }

  // ── Values ───────────────────────────────────────────────────────────────────

  function getValues(): Record<string, unknown> {
    return getAllValues()
  }

  function setValue(name: string, value: unknown): void {
    const field = fields.get(name)
    if (field) field.setValue(value)
  }

  // ── Reset ────────────────────────────────────────────────────────────────────

  function reset(): void {
    for (const field of fields.values()) {
      field.reset()
    }
    errors.value = {}
    isSubmitting.value = false
    isSubmitted.value = false
    submitCount.value = 0
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  async function handleSubmit(
    onValid: (
      values: Record<string, unknown>,
      helpers: { setErrors(errors: Record<string, string>): void },
    ) => void | Promise<void>,
    onInvalid?: (errors: Record<string, string>) => void,
  ): Promise<void> {
    isSubmitting.value = true
    submitCount.value++

    const currentValues = getAllValues()
    const context = { values: currentValues }

    const results = await Promise.all(
      [...fields.entries()].map(async ([name, field]) => {
        const error = await runValidation(field.getValue(), field.rules, field.validate, context)
        return { name, error }
      }),
    )

    const nextErrors: Record<string, string> = {}
    for (const { name, error } of results) {
      if (error) nextErrors[name] = error
    }

    if (Object.keys(nextErrors).length > 0) {
      errors.value = nextErrors
      isSubmitting.value = false
      isSubmitted.value = true
      onInvalid?.(nextErrors)
      return
    }

    errors.value = {}
    isSubmitted.value = true
    isSubmitting.value = false
    await onValid(currentValues, { setErrors })
  }

  return {
    errors,
    isSubmitting,
    isSubmitted,
    submitCount,
    isDisabled,
    isValid,
    isDirty,
    isTouched,
    validationMode,
    values,
    defaultValues,
    registerField,
    unregisterField,
    triggerFieldValidation,
    getFieldRef,
    setErrors,
    setError,
    clearErrors,
    getValues,
    setValue,
    trigger,
    reset,
    handleSubmit,
  }
}
