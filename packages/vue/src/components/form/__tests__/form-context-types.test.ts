import { describe, it, expectTypeOf } from 'vitest'
import type { FieldRegistration, FormContext, FormOptions } from '../form.context'
import type { Ref, ComputedRef, MaybeRefOrGetter } from 'vue'

describe('form.context types', () => {
  it('FieldRegistration has valueRef', () => {
    expectTypeOf<FieldRegistration['valueRef']>().toEqualTypeOf<Ref<unknown>>()
  })

  it('FormContext has values as ComputedRef', () => {
    expectTypeOf<FormContext['values']>().toEqualTypeOf<ComputedRef<Record<string, unknown>>>()
  })

  it('FormContext has defaultValues', () => {
    expectTypeOf<FormContext['defaultValues']>().toEqualTypeOf<Record<string, unknown>>()
  })

  it('FormContext has getFieldRef', () => {
    expectTypeOf<FormContext['getFieldRef']>().parameters.toEqualTypeOf<[string]>()
    expectTypeOf<FormContext['getFieldRef']>().returns.toEqualTypeOf<Ref<unknown> | undefined>()
  })

  it('FormContext has handleSubmit', () => {
    expectTypeOf<FormContext['handleSubmit']>().toBeFunction()
  })

  it('FormOptions shape', () => {
    // Widened to a ref/getter so useForm() callers can feed in defaults fetched after mount.
    expectTypeOf<FormOptions>().toHaveProperty('defaultValues').toEqualTypeOf<MaybeRefOrGetter<Record<string, unknown> | undefined>>()
    expectTypeOf<FormOptions>().toHaveProperty('validationMode').toEqualTypeOf<'on-submit' | 'on-blur' | 'on-change' | undefined>()
    expectTypeOf<FormOptions>().toHaveProperty('isDisabled').toEqualTypeOf<boolean | undefined>()
  })
})
