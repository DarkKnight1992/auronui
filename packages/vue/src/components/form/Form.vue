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
}>()

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const fields = new Map<string, FieldRegistration>()

function registerField(reg: FieldRegistration): void {
  fields.set(reg.name, reg)
}

function unregisterField(name: string): void {
  fields.delete(name)
  const next = { ...errors.value }
  delete next[name]
  errors.value = next
}

async function triggerFieldValidation(name: string): Promise<void> {
  const field = fields.get(name)
  if (!field) return
  const error = await runValidation(field.getValue(), field.rules, field.validate)
  const next = { ...errors.value }
  if (error) {
    next[name] = error
  } else {
    delete next[name]
  }
  errors.value = next
}

function setErrors(newErrors: Record<string, string>): void {
  errors.value = { ...errors.value, ...newErrors }
  isSubmitting.value = false
}

async function handleSubmit(): Promise<void> {
  isSubmitting.value = true

  const results = await Promise.all(
    [...fields.entries()].map(async ([name, field]) => {
      const error = await runValidation(field.getValue(), field.rules, field.validate)
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
    emit('invalid', nextErrors)
    return
  }

  errors.value = {}

  const values: Record<string, unknown> = {}
  for (const [name, field] of fields.entries()) {
    values[name] = field.getValue()
  }

  emit('submit', { values, setErrors })
}

const ctx: FormContext = {
  errors,
  isSubmitting,
  isDisabled: computed(() => props.isDisabled),
  validationMode: computed(() => props.validationMode),
  registerField,
  unregisterField,
  triggerFieldValidation,
  setErrors,
}

provide(formContextKey, ctx)
</script>

<template>
  <form
    :class="props.class"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <slot
      :is-submitting="isSubmitting"
      :is-disabled="props.isDisabled"
      :errors="errors"
    />
  </form>
</template>
