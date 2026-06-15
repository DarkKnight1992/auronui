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
}>()

const modelValue = defineModel<unknown>({ default: undefined })

const ctx = useFormInject()

// ── Field state ──────────────────────────────────────────────────────────────

const localError = ref<string | undefined>(undefined)
const touched = ref(false)
const dirty = ref(props.defaultValue !== undefined && modelValue.value !== props.defaultValue)

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
  dirty.value = val !== props.defaultValue
})

// ── Registration ─────────────────────────────────────────────────────────────

function resetField(): void {
  modelValue.value = props.defaultValue
  localError.value = undefined
  touched.value = false
  dirty.value = false
  hasBeenInvalid.value = false
}

onMounted(() => {
  ctx?.registerField({
    name: props.name,
    getValue: () => modelValue.value,
    getDefaultValue: () => props.defaultValue,
    setValue: (val: unknown) => { modelValue.value = val },
    reset: resetField,
    touched,
    dirty,
    rules: props.rules,
    validate: props.validate,
  })
})

onUnmounted(() => {
  ctx?.unregisterField(props.name)
})

// ── Validation ───────────────────────────────────────────────────────────────

async function triggerValidation(val: unknown): Promise<void> {
  const context = ctx ? { values: ctx.getValues() } : undefined
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
