import { computed, onMounted, onUnmounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useFormInject } from './form.context'
import { runValidation } from './validation'
import type { FieldRules, CustomValidator, ValidationMode } from './form.context'

export interface FieldOptions {
  defaultValue?: unknown
  rules?: FieldRules
  validate?: CustomValidator
  validationMode?: ValidationMode
  deps?: string[]
}

export interface FieldProps {
  name: string
  modelValue: unknown
  'onUpdate:modelValue': (value: unknown) => Promise<void>
  isInvalid: boolean
  errorMessage: string | undefined
  isDisabled: boolean
  onBlur: () => Promise<void>
}

export interface FieldHandle {
  modelValue: Ref<unknown>
  error: ComputedRef<string | undefined>
  isInvalid: ComputedRef<boolean>
  isTouched: Ref<boolean>
  isDirty: Ref<boolean>
  isDisabled: ComputedRef<boolean>
  fieldProps: ComputedRef<FieldProps>
  handleUpdate(value: unknown): Promise<void>
  handleBlur(): Promise<void>
  reset(): void
}

export function useField(name: string, options: FieldOptions = {}): FieldHandle {
  const ctx = useFormInject()

  const modelValue = ref<unknown>(
    options.defaultValue !== undefined
      ? options.defaultValue
      : ctx?.defaultValues[name],
  )

  const localError = ref<string | undefined>(undefined)
  const touched = ref(false)
  const dirty = ref(false)
  const hasBeenInvalid = ref(false)

  const resolvedDefault = computed(() => {
    if (options.defaultValue !== undefined) return options.defaultValue
    return ctx?.defaultValues[name]
  })

  const error: ComputedRef<string | undefined> = computed(() =>
    ctx ? ctx.errors.value[name] : localError.value,
  )
  const isInvalid: ComputedRef<boolean> = computed(() => !!error.value)
  const isDisabled: ComputedRef<boolean> = computed(() => ctx?.isDisabled.value ?? false)
  const effectiveMode = computed(() => options.validationMode ?? ctx?.validationMode.value ?? 'on-submit')

  watch(error, (e) => { if (e) hasBeenInvalid.value = true })
  watch(modelValue, (val) => { dirty.value = val !== resolvedDefault.value })

  // ── Validation ───────────────────────────────────────────────────────────────

  async function triggerValidation(val: unknown): Promise<void> {
    const context = ctx ? { values: ctx.getValues() } : undefined
    const err = await runValidation(val, options.rules, options.validate, context)

    if (ctx) {
      const next = { ...ctx.errors.value }
      if (err) {
        next[name] = err
      } else {
        delete next[name]
      }
      ctx.errors.value = next
    } else {
      localError.value = err
    }
  }

  async function handleUpdate(val: unknown): Promise<void> {
    modelValue.value = val
    // In standalone mode (no form) there is no submit event, so always validate on change.
    // In form mode, respect the configured validation mode.
    if (!ctx || effectiveMode.value === 'on-change' || hasBeenInvalid.value) {
      await triggerValidation(val)
    }
  }

  async function handleBlur(): Promise<void> {
    touched.value = true
    if (effectiveMode.value === 'on-blur') {
      await triggerValidation(modelValue.value)
    }
  }

  function reset(): void {
    modelValue.value = resolvedDefault.value
    localError.value = undefined
    touched.value = false
    dirty.value = false
    hasBeenInvalid.value = false
    if (ctx) {
      const next = { ...ctx.errors.value }
      delete next[name]
      ctx.errors.value = next
    }
  }

  // ── Deps watching ─────────────────────────────────────────────────────────────

  const depStoppers: (() => void)[] = []

  function setupDepWatchers(deps: string[] | undefined): void {
    for (const stop of depStoppers) stop()
    depStoppers.length = 0
    if (!ctx || !deps?.length) return
    for (const dep of deps) {
      const depRef = ctx.getFieldRef(dep)
      if (!depRef) continue
      depStoppers.push(watch(depRef, () => void triggerValidation(modelValue.value)))
    }
  }

  // ── Registration ─────────────────────────────────────────────────────────────

  onMounted(() => {
    ctx?.registerField({
      name,
      valueRef: modelValue,
      getValue: () => modelValue.value,
      getDefaultValue: () => resolvedDefault.value,
      setValue: (val) => { modelValue.value = val },
      reset,
      touched,
      dirty,
      rules: options.rules,
      validate: options.validate,
    })
    setupDepWatchers(options.deps)
  })

  onUnmounted(() => {
    for (const stop of depStoppers) stop()
    ctx?.unregisterField(name)
  })

  // ── fieldProps ────────────────────────────────────────────────────────────────

  const fieldProps: ComputedRef<FieldProps> = computed(() => ({
    name,
    modelValue: modelValue.value,
    'onUpdate:modelValue': handleUpdate,
    isInvalid: isInvalid.value,
    errorMessage: error.value,
    isDisabled: isDisabled.value,
    onBlur: handleBlur,
  }))

  return {
    modelValue,
    error,
    isInvalid,
    isTouched: touched,
    isDirty: dirty,
    isDisabled,
    fieldProps,
    handleUpdate,
    handleBlur,
    reset,
  }
}
