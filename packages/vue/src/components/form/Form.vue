<script setup lang="ts">
import type { ClassValue } from '../../utils/composeClassName'
import { toRef, provide } from 'vue'
import { formContextKey, type FormContext, type ValidationMode } from './form.context'
import { createFormState, withDefaultValues } from './form.state'

interface FormSubmitPayload {
  values: Record<string, unknown>
  setErrors: (e: Record<string, string>) => void
}

const props = withDefaults(
  defineProps<{
    /** External form handle from useForm(). When provided, Form uses it instead of creating its own state. */
    form?: FormContext
    /**
     * Centralized default values. Field-level defaultValue prop wins if both set.
     * With `form`, these are layered over the handle's own `defaultValues`.
     */
    defaultValues?: Record<string, unknown>
    validationMode?: ValidationMode
    isDisabled?: boolean
    class?: ClassValue
    /**
     * Submit handler, bound with `@submit`. Declared as a prop rather than an
     * emit so an async handler is awaited: `isSubmitting` stays `true` until
     * the promise it returns settles.
     */
    onSubmit?: (payload: FormSubmitPayload) => void | Promise<void>
  }>(),
  {
    form: undefined,
    defaultValues: undefined,
    validationMode: 'on-submit',
    isDisabled: false,
    class: undefined,
    onSubmit: undefined,
  },
)

const emit = defineEmits<{
  invalid: [errors: Record<string, string>]
  reset: []
}>()

// With a handle, `:default-values` is layered over the handle's own defaults
// rather than silently ignored.
const ctx: FormContext = props.form
  ? withDefaultValues(props.form, toRef(props, 'defaultValues'))
  : createFormState({
  defaultValues: toRef(props, 'defaultValues'),
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
    async (vals) => { await props.onSubmit?.({ values: vals, setErrors }) },
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
