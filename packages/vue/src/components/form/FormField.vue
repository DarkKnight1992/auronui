<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useFormInject } from './form.context'
import { runValidation } from './validation'
import type { FieldRules, CustomValidator } from './validation'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  name: string
  rules?: FieldRules
  validate?: CustomValidator
  /** Override validation mode — used in standalone mode (outside <Form>) or to override the Form's mode for a single field. */
  validationMode?: 'on-submit' | 'on-blur' | 'on-change'
}>()

const modelValue = defineModel<unknown>({ default: undefined })

const ctx = useFormInject()

// Standalone mode: local error state when used outside <Form>
const localError = ref<string | undefined>(undefined)

const fieldError = computed<string | undefined>(() =>
  ctx ? ctx.errors.value[props.name] : localError.value,
)

// Once a field has shown an error, validate on every change so errors clear as the user types.
const hasBeenInvalid = ref(false)
watch(fieldError, (error) => { if (error) hasBeenInvalid.value = true })
const isInvalid = computed(() => !!fieldError.value)
const isDisabled = computed(() => ctx?.isDisabled.value ?? false)
const validationMode = computed(() => props.validationMode ?? ctx?.validationMode.value ?? 'on-submit')

onMounted(() => {
  ctx?.registerField({
    name: props.name,
    getValue: () => modelValue.value,
    rules: props.rules,
    validate: props.validate,
  })
})

onUnmounted(() => {
  ctx?.unregisterField(props.name)
})

async function triggerValidation(val: unknown): Promise<void> {
  const error = await runValidation(val, props.rules, props.validate)
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
  if (validationMode.value === 'on-blur') {
    await triggerValidation(modelValue.value)
  }
}

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
  <slot :field-props="fieldProps" />
</template>
