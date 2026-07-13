import { computed, ref, type Ref, type ComputedRef } from 'vue'
import { runValidation } from './validation'
import type { FormContext, FieldRegistration, FieldArrayRegistration, ValidationMode } from './form.context'

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
  const fieldArrays = new Map<string, FieldArrayRegistration>()
  const fieldArrayCount = ref(0)

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

  function registerFieldArray(reg: FieldArrayRegistration): void {
    fieldArrays.set(reg.name, reg)
    fieldArrayCount.value++
  }

  function unregisterFieldArray(name: string): void {
    fieldArrays.delete(name)
    fieldArrayCount.value--
  }

  // ── Nested value assembly ────────────────────────────────────────────────────
  // Field arrays register rows under dotted, id-based names (e.g.
  // "contacts.contacts-row-0.email"). Building the public values shape means
  // walking those dotted paths and, wherever a path segment is a row id
  // belonging to a registered field array, placing that row's data at the
  // id's CURRENT position (order.value.indexOf(id)) rather than treating the
  // id as a literal object key — so reordering/removing rows never scrambles
  // the assembled array.

  function ensureArrayContainer(root: Record<string, unknown>, path: string[]): void {
    let container = root as Record<string, unknown>
    for (let i = 0; i < path.length; i++) {
      const segment = path[i]
      if (i === path.length - 1) {
        if (container[segment] === undefined) container[segment] = []
      } else {
        if (container[segment] === undefined) container[segment] = {}
        container = container[segment] as Record<string, unknown>
      }
    }
  }

  function buildNestedValues(getFieldValue: (field: FieldRegistration) => unknown): Record<string, unknown> {
    const root: Record<string, unknown> = {}

    // Pre-seed field arrays so an empty array still appears in the output.
    for (const name of fieldArrays.keys()) {
      ensureArrayContainer(root, name.split('.'))
    }

    for (const [name, field] of fields.entries()) {
      // Synthetic array-level aggregate field (registered for row-count
      // validation only) — its "value" is a row count, not row data.
      if (fieldArrays.has(name)) continue

      const segments = name.split('.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic path-walking; shape is validated by construction, not by the type system
      let container: any = root
      let prefix = ''

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        const isLast = i === segments.length - 1
        const arrayReg = fieldArrays.get(prefix)

        if (arrayReg) {
          const idx = arrayReg.order.value.indexOf(segment)
          if (idx === -1) break // row no longer registered; skip stale entry
          if (isLast) {
            container[idx] = getFieldValue(field)
          } else {
            if (container[idx] === undefined) container[idx] = {}
            container = container[idx]
          }
        } else {
          if (isLast) {
            container[segment] = getFieldValue(field)
          } else {
            const nextPrefix = prefix ? `${prefix}.${segment}` : segment
            if (container[segment] === undefined) container[segment] = fieldArrays.has(nextPrefix) ? [] : {}
            container = container[segment]
          }
        }

        prefix = prefix ? `${prefix}.${segment}` : segment
      }
    }

    return root
  }

  // ── Reactive values ─────────────────────────────────────────────────────────

  const values: ComputedRef<Record<string, unknown>> = computed(() => {
    void fieldCount.value // track register/unregister events
    void fieldArrayCount.value
    for (const reg of fieldArrays.values()) void reg.order.value // track row reordering
    return buildNestedValues((field) => field.valueRef.value)
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

  // Flat, keyed by literal field name — used ONLY as internal validation
  // context so cross-field rules (matches, deps, custom validate) can look up
  // a sibling by its exact registered name, including dotted row names. The
  // public-facing shape (getValues()/values) is nested — see getNestedValues().
  function getAllValues(): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const [name, field] of fields.entries()) {
      result[name] = field.getValue()
    }
    return result
  }

  function getNestedValues(): Record<string, unknown> {
    return buildNestedValues((field) => field.getValue())
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
    return getNestedValues()
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
    for (const fieldArray of fieldArrays.values()) {
      fieldArray.reset()
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
    await onValid(getNestedValues(), { setErrors })
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
    registerFieldArray,
    unregisterFieldArray,
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
