<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { formContextKey } from './form.context'
import { runValidation } from './validation'
import type { ValidationMode, FieldRegistration, FormContext } from './form.context'

const props = withDefaults(
  defineProps<{
    validationMode?: ValidationMode
    isDisabled?: boolean
    class?: string
  }>(),
  {
    validationMode: 'on-submit',
    isDisabled: false,
    class: undefined,
  },
)

const emit = defineEmits<{
  submit: [payload: { values: Record<string, unknown>; setErrors: (e: Record<string, string>) => void }]
  invalid: [errors: Record<string, string>]
  reset: []
}>()

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const submitCount = ref(0)
const fields = new Map<string, FieldRegistration>()

// Reactive field count so computed properties re-evaluate when fields register/unregister
const fieldCount = ref(0)

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

// ── Computed state ──────────────────────────────────────────────────────────

const isValid = computed(() => {
  void fieldCount.value // track reactivity
  return Object.keys(errors.value).length === 0
})

const isDirty = computed(() => {
  void fieldCount.value
  for (const field of fields.values()) {
    if (field.dirty.value) return true
  }
  return false
})

const isTouched = computed(() => {
  void fieldCount.value
  for (const field of fields.values()) {
    if (field.touched.value) return true
  }
  return false
})

// ── Helpers ─────────────────────────────────────────────────────────────────

function getAllValues(): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  for (const [name, field] of fields.entries()) {
    values[name] = field.getValue()
  }
  return values
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
  emit('reset')
}

// ── Submit ───────────────────────────────────────────────────────────────────

async function handleSubmit(): Promise<void> {
  isSubmitting.value = true
  submitCount.value++

  const values = getAllValues()
  const context = { values }

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
    emit('invalid', nextErrors)
    return
  }

  errors.value = {}
  isSubmitted.value = true
  isSubmitting.value = false
  emit('submit', { values, setErrors })
}

// ── Context ──────────────────────────────────────────────────────────────────

const ctx: FormContext = {
  errors,
  isSubmitting,
  isSubmitted,
  submitCount,
  isDisabled: computed(() => props.isDisabled),
  isValid,
  isDirty,
  isTouched,
  validationMode: computed(() => props.validationMode),
  registerField,
  unregisterField,
  triggerFieldValidation,
  setErrors,
  setError,
  clearErrors,
  getValues,
  setValue,
  trigger,
  reset,
}

provide(formContextKey, ctx)

defineExpose({
  errors,
  isSubmitting,
  isSubmitted,
  submitCount,
  isValid,
  isDirty,
  isTouched,
  getValues,
  setValue,
  setErrors,
  setError,
  clearErrors,
  trigger,
  reset,
})
</script>

<template>
  <form
    :class="props.class"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <slot
      :is-submitting="isSubmitting"
      :is-submitted="isSubmitted"
      :submit-count="submitCount"
      :is-disabled="props.isDisabled"
      :is-valid="isValid"
      :is-dirty="isDirty"
      :is-touched="isTouched"
      :errors="errors"
      :get-values="getValues"
      :set-value="setValue"
      :set-errors="setErrors"
      :set-error="setError"
      :clear-errors="clearErrors"
      :trigger="trigger"
      :reset="reset"
    />
  </form>
</template>
