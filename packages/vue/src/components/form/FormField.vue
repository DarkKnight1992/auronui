<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useFormInject } from './form.context'
import { runValidation } from './validation'
import type { FieldRules, CustomValidator } from './validation'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  name: string
  defaultValue?: unknown
  rules?: FieldRules
  validate?: CustomValidator
  /** Override validation mode for this field. */
  validationMode?: 'on-submit' | 'on-blur' | 'on-change'
  /** Field names whose changes trigger re-validation of this field. */
  deps?: string[]
}>()

const modelValue = defineModel<unknown>({ default: undefined })

const ctx = useFormInject()

// ── Default value resolution ─────────────────────────────────────────────────
// Priority: field-level defaultValue prop > form-level defaultValues[name] > undefined

const resolvedDefault = computed(() => {
  if (props.defaultValue !== undefined) return props.defaultValue
  return ctx?.getDefaultValue(props.name)
})

// Form-level defaultValues are commonly fetched, so they land after this field
// has already mounted and seeded itself from `undefined`. Adopt the new default
// only while the field still holds whatever the previous default gave it — a
// value the user typed, or one the parent supplied via v-model, always wins.
watch(resolvedDefault, (next, previous) => {
  if (next === undefined || next === modelValue.value) return
  if (modelValue.value !== undefined && modelValue.value !== previous) return
  modelValue.value = next
})

// ── Field state ──────────────────────────────────────────────────────────────

const localError = ref<string | undefined>(undefined)
const touched = ref(false)
const dirty = ref(
  resolvedDefault.value !== undefined && modelValue.value !== resolvedDefault.value,
)

const fieldError = computed<string | undefined>(() =>
  ctx ? ctx.errors.value[props.name] : localError.value,
)

const hasBeenInvalid = ref(false)
watch(fieldError, (error) => { if (error) hasBeenInvalid.value = true })

const isInvalid = computed(() => !!fieldError.value)
const isDisabled = computed(() => ctx?.isDisabled.value ?? false)
const validationMode = computed(() => props.validationMode ?? ctx?.validationMode.value ?? 'on-submit')

// ── Dirty tracking ───────────────────────────────────────────────────────────

watch(modelValue, (val) => {
  dirty.value = val !== resolvedDefault.value
})

// ── Validation ───────────────────────────────────────────────────────────────

async function triggerValidation(val: unknown): Promise<void> {
  const context = ctx
    ? { values: ctx.getValues(), getFieldValue: ctx.getFieldValue }
    : undefined
  const error = await runValidation(val, props.rules, props.validate, context)

  if (ctx) {
    const next = { ...ctx.errors.value }
    if (error) {
      next[props.name] = error
    } else {
      delete next[props.name]
    }
    ctx.errors.value = next
  } else {
    localError.value = error
  }
}

async function handleUpdate(val: unknown): Promise<void> {
  modelValue.value = val
  if (validationMode.value === 'on-change' || hasBeenInvalid.value) {
    await triggerValidation(val)
  }
}

async function handleBlur(): Promise<void> {
  touched.value = true
  if (validationMode.value === 'on-blur') {
    await triggerValidation(modelValue.value)
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

function resetField(): void {
  modelValue.value = resolvedDefault.value
  localError.value = undefined
  touched.value = false
  dirty.value = false
  hasBeenInvalid.value = false
}

onMounted(() => {
  // Initialize to resolved default when no value was passed by the parent
  if (modelValue.value === undefined && resolvedDefault.value !== undefined) {
    modelValue.value = resolvedDefault.value
  }

  ctx?.registerField({
    name: props.name,
    valueRef: modelValue,
    getValue: () => modelValue.value,
    getDefaultValue: () => resolvedDefault.value,
    setValue: (val: unknown) => { modelValue.value = val },
    reset: resetField,
    touched,
    dirty,
    rules: props.rules,
    validate: props.validate,
  })

  setupDepWatchers(props.deps)
})

// Watch a stable string key so the watcher only tears down/rebuilds when the
// dep list contents actually change — not on every re-render where the parent
// passes a new array literal with the same elements (Object.is differs by ref).
watch(
  () => props.deps?.join('\0') ?? '',
  () => setupDepWatchers(props.deps),
)

onUnmounted(() => {
  for (const stop of depStoppers) stop()
  ctx?.unregisterField(props.name)
})

// ── Slot bindings ─────────────────────────────────────────────────────────────

const fieldProps = computed(() => ({
  name: props.name,
  modelValue: modelValue.value,
  'onUpdate:modelValue': handleUpdate,
  isInvalid: isInvalid.value,
  errorMessage: fieldError.value,
  isDisabled: isDisabled.value,
  onBlur: handleBlur,
}))
</script>

<template>
  <slot
    :field-props="fieldProps"
    :touched="touched"
    :dirty="dirty"
    :error="fieldError"
    :is-invalid="isInvalid"
  />
</template>
