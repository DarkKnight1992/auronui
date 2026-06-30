<script setup lang="ts">
import { toRef, provide } from 'vue'
import { formContextKey, type FormContext, type ValidationMode } from './form.context'
import { createFormState } from './form.state'

const props = withDefaults(
  defineProps<{
    /** External form handle from useForm(). When provided, Form uses it instead of creating its own state. */
    form?: FormContext
    /** Centralized default values. Field-level defaultValue prop wins if both set. */
    defaultValues?: Record<string, unknown>
    validationMode?: ValidationMode
    isDisabled?: boolean
    class?: string
  }>(),
  {
    form: undefined,
    defaultValues: undefined,
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

const ctx: FormContext = props.form ?? createFormState({
  defaultValues: props.defaultValues,
  validationMode: toRef(props, 'validationMode'),
  isDisabled: toRef(props, 'isDisabled'),
})

provide(formContextKey, ctx)

// Destructure into top-level <script setup> bindings so that:
// 1. Vue's template compiler auto-unwraps refs/computeds in slot prop bindings
// 2. wrapper.findComponent(Form).vm.* access works in tests (reads setup state directly)
const {
  errors,
  isSubmitting,
  isSubmitted,
  submitCount,
  isValid,
  isDirty,
  isTouched,
  values,
  getValues,
  setValue,
  setErrors,
  setError,
  clearErrors,
  trigger,
} = ctx

async function onFormSubmit(): Promise<void> {
  await ctx.handleSubmit(
    (vals) => emit('submit', { values: vals, setErrors }),
    (errs) => emit('invalid', errs),
  )
}

// Named 'reset' (not onFormReset) so vm.reset is accessible via findComponent().vm
function reset(): void {
  ctx.reset()
  emit('reset')
}

defineExpose({
  errors,
  isSubmitting,
  isSubmitted,
  submitCount,
  isValid,
  isDirty,
  isTouched,
  values,
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
    @submit.prevent="onFormSubmit"
  >
    <slot
      :values="values"
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
