import { provide, ref } from 'vue'
import { formContextKey, type FormContext, type FormOptions } from './form.context'
import { createFormState } from './form.state'

export function useForm(options: FormOptions = {}): FormContext {
  const ctx = createFormState({
    defaultValues: options.defaultValues,
    validationMode: ref(options.validationMode ?? 'on-submit'),
    isDisabled: ref(options.isDisabled ?? false),
  })
  provide(formContextKey, ctx)
  return ctx
}
