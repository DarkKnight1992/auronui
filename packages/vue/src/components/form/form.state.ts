import { computed, ref, toValue, type Ref, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import { runValidation } from './validation'
import { getPath, setPath, flattenPaths, toPathSegments } from '../../utils/path'
import type { FormContext, FieldRegistration, FieldArrayRegistration, ValidationMode } from './form.context'

// Internal options — callers pass Refs so reactive props (from Form.vue's toRef) stay live
interface FormStateOptions {
  defaultValues?: MaybeRefOrGetter<Record<string, unknown> | undefined>
  validationMode?: Ref<ValidationMode>
  isDisabled?: Ref<boolean>
}

export function createFormState(options: FormStateOptions = {}): FormContext {
  // Read through on every access rather than snapshotting at creation, so
  // defaultValues that arrive after mount (fetched from an API) still land.
  const defaultValuesSource: ComputedRef<Record<string, unknown>> = computed(
    () => toValue(options.defaultValues) ?? {},
  )

  function getDefaultValue(name: string): unknown {
    return getPath(defaultValuesSource.value, name)
  }

  // Kept on the context as a plain-looking object for backwards compatibility,
  // but reads proxy through to the live source so they stay reactive.
  const defaultValues = new Proxy({} as Record<string, unknown>, {
    get: (_target, key) =>
      typeof key === 'string' ? defaultValuesSource.value[key] : undefined,
    has: (_target, key) => typeof key === 'string' && key in defaultValuesSource.value,
    ownKeys: () => Reflect.ownKeys(defaultValuesSource.value),
    getOwnPropertyDescriptor: (_target, key) => {
      const descriptor = Object.getOwnPropertyDescriptor(defaultValuesSource.value, key)
      return descriptor && { ...descriptor, configurable: true }
    },
  })

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
  // A field's registered name is its path in the public value shape, with one
  // exception: field-array rows register under a stable row id
  // ("contacts.contacts-row-0.email") so that reordering never renames — and
  // therefore never remounts — a row's fields. The public shape indexes those
  // rows by position, so a name is translated to a path before it is used.

  /** Registered name → path in the public shape. null when a row id is stale. */
  function resolveValuePath(name: string): string | null {
    if (!name.includes('.')) return name

    const resolved: string[] = []
    let prefix = ''
    for (const segment of toPathSegments(name)) {
      const arrayReg = fieldArrays.get(prefix)
      if (arrayReg) {
        const index = arrayReg.order.value.indexOf(segment)
        if (index === -1) return null
        resolved.push(String(index))
      } else {
        resolved.push(segment)
      }
      prefix = prefix ? `${prefix}.${segment}` : segment
    }
    return resolved.join('.')
  }

  function buildNestedValues(readField: (field: FieldRegistration) => unknown): Record<string, unknown> {
    const root: Record<string, unknown> = {}

    // Pre-seed field arrays so an empty array still appears in the output.
    for (const name of fieldArrays.keys()) {
      const path = resolveValuePath(name)
      if (path !== null) setPath(root, path, [])
    }

    for (const [name, field] of fields.entries()) {
      // Synthetic array-level aggregate field (registered for row-count
      // validation only) — its "value" is the row-id list, not row data.
      if (fieldArrays.has(name)) continue

      const path = resolveValuePath(name)
      if (path === null) continue // row no longer registered; skip stale entry
      setPath(root, path, readField(field))
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

  function getNestedValues(): Record<string, unknown> {
    return buildNestedValues((field) => field.getValue())
  }

  /**
   * Read one field's value by name. The registry is consulted first, so a name
   * that is not a path in the public shape — a field-array row id — still
   * resolves; anything else is read as a path, at any depth.
   */
  function getFieldValue(name: string): unknown {
    const field = fields.get(name)
    if (field) return field.getValue()
    return getPath(getNestedValues(), name)
  }

  /**
   * The context handed to every rule and custom validator. `values` is always
   * the nested shape — the same one getValues() returns — and the nested tree
   * is assembled once per validation pass rather than per field.
   */
  function buildValidationContext(): { values: Record<string, unknown>; getFieldValue(name: string): unknown } {
    const nested = getNestedValues()
    return {
      values: nested,
      getFieldValue: (name: string) => {
        const field = fields.get(name)
        return field ? field.getValue() : getPath(nested, name)
      },
    }
  }

  // ── Validation ───────────────────────────────────────────────────────────────

  async function triggerFieldValidation(name: string): Promise<void> {
    const field = fields.get(name)
    if (!field) return
    const error = await runValidation(
      field.getValue(),
      field.rules,
      field.validate,
      buildValidationContext(),
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
    const context = buildValidationContext()
    const results = await Promise.all(
      [...fields.entries()].map(async ([fieldName, field]) => {
        const error = await runValidation(field.getValue(), field.rules, field.validate, context)
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

  function getValues(): Record<string, unknown>
  function getValues(name: string): unknown
  function getValues(name?: string): unknown {
    return name === undefined ? getNestedValues() : getFieldValue(name)
  }

  function setValue(name: string, value: unknown): void {
    const field = fields.get(name)
    if (field) {
      field.setValue(value)
      return
    }
    // No field registered under that exact name — treat it as a subtree write
    // and fan out to every registered field it covers, so
    // setValue('auth_factor', { force_mfa: true }) reaches 'auth_factor.force_mfa'.
    for (const leaf of flattenPaths(value, name)) {
      fields.get(leaf.path)?.setValue(leaf.value)
    }
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

    const context = buildValidationContext()

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
    getDefaultValue,
    getFieldValue,
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
