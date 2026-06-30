import { describe, it, expect, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { createFormState } from '../form.state'

function makeField(name: string, initial: unknown = '') {
  const valueRef = ref(initial)
  return {
    reg: {
      name,
      valueRef,
      getValue: () => valueRef.value,
      getDefaultValue: () => '',
      setValue: (v: unknown) => { valueRef.value = v },
      reset: () => { valueRef.value = '' },
      touched: ref(false),
      dirty: ref(false),
    },
    valueRef,
  }
}

describe('createFormState — initial state', () => {
  it('returns a FormContext with empty errors and values', () => {
    const ctx = createFormState({})
    expect(ctx.errors.value).toEqual({})
    expect(ctx.values.value).toEqual({})
    expect(ctx.isSubmitting.value).toBe(false)
    expect(ctx.isSubmitted.value).toBe(false)
    expect(ctx.submitCount.value).toBe(0)
    expect(ctx.defaultValues).toEqual({})
  })

  it('defaultValues from options is accessible on ctx.defaultValues', () => {
    const ctx = createFormState({ defaultValues: { email: 'foo@bar.com', age: 30 } })
    expect(ctx.defaultValues).toEqual({ email: 'foo@bar.com', age: 30 })
  })

  it('validationMode defaults to on-submit', () => {
    expect(createFormState({}).validationMode.value).toBe('on-submit')
  })

  it('isDisabled defaults to false', () => {
    expect(createFormState({}).isDisabled.value).toBe(false)
  })
})

describe('createFormState — reactive values', () => {
  it('values is empty when no fields are registered', () => {
    const ctx = createFormState({})
    expect(ctx.values.value).toEqual({})
  })

  it('values includes registered field values', async () => {
    const ctx = createFormState({})
    const { reg } = makeField('email', 'hello@example.com')
    ctx.registerField(reg)
    await nextTick()
    expect(ctx.values.value.email).toBe('hello@example.com')
  })

  it('values updates when a field valueRef changes', async () => {
    const ctx = createFormState({})
    const { reg, valueRef } = makeField('name', 'Alice')
    ctx.registerField(reg)
    valueRef.value = 'Bob'
    await nextTick()
    expect(ctx.values.value.name).toBe('Bob')
  })

  it('values removes field after unregister', async () => {
    const ctx = createFormState({})
    const { reg } = makeField('city', 'NYC')
    ctx.registerField(reg)
    ctx.unregisterField('city')
    await nextTick()
    expect('city' in ctx.values.value).toBe(false)
  })

  it('values tracks multiple fields independently', async () => {
    const ctx = createFormState({})
    const a = makeField('a', 1)
    const b = makeField('b', 2)
    ctx.registerField(a.reg)
    ctx.registerField(b.reg)
    a.valueRef.value = 10
    await nextTick()
    expect(ctx.values.value).toEqual({ a: 10, b: 2 })
  })
})

describe('createFormState — getFieldRef', () => {
  it('returns the registered valueRef', () => {
    const ctx = createFormState({})
    const { reg, valueRef } = makeField('country')
    ctx.registerField(reg)
    expect(ctx.getFieldRef('country')).toBe(valueRef)
  })

  it('returns undefined for an unknown field', () => {
    const ctx = createFormState({})
    expect(ctx.getFieldRef('unknown')).toBeUndefined()
  })
})

describe('createFormState — handleSubmit', () => {
  it('calls onValid with all field values when no errors', async () => {
    const ctx = createFormState({})
    const { reg } = makeField('name', 'Alice')
    ctx.registerField(reg)
    const onValid = vi.fn()
    await ctx.handleSubmit(onValid)
    expect(onValid).toHaveBeenCalledWith(
      { name: 'Alice' },
      expect.objectContaining({ setErrors: expect.any(Function) }),
    )
  })

  it('calls onInvalid when a required field is empty', async () => {
    const ctx = createFormState({})
    const valueRef = ref('')
    ctx.registerField({
      name: 'field',
      valueRef,
      getValue: () => valueRef.value,
      getDefaultValue: () => '',
      setValue: (v) => { valueRef.value = String(v) },
      reset: () => { valueRef.value = '' },
      touched: ref(false),
      dirty: ref(false),
      rules: { required: true },
    })
    const onValid = vi.fn()
    const onInvalid = vi.fn()
    await ctx.handleSubmit(onValid, onInvalid)
    expect(onValid).not.toHaveBeenCalled()
    expect(onInvalid).toHaveBeenCalledWith({ field: 'Enter a value' })
  })

  it('sets isSubmitting to false and isSubmitted to true after submit completes', async () => {
    const ctx = createFormState({})
    await ctx.handleSubmit(vi.fn())
    expect(ctx.isSubmitting.value).toBe(false)
    expect(ctx.isSubmitted.value).toBe(true)
    expect(ctx.submitCount.value).toBe(1)
  })

  it('setErrors helper from onValid merges server errors', async () => {
    const ctx = createFormState({})
    const { reg } = makeField('email', 'taken@example.com')
    ctx.registerField(reg)
    await ctx.handleSubmit(async (_, { setErrors }) => {
      setErrors({ email: 'Already taken' })
    })
    expect(ctx.errors.value.email).toBe('Already taken')
  })

  it('increments submitCount on each call', async () => {
    const ctx = createFormState({})
    await ctx.handleSubmit(vi.fn())
    await ctx.handleSubmit(vi.fn())
    expect(ctx.submitCount.value).toBe(2)
  })
})

describe('createFormState — reset', () => {
  it('reset() calls field.reset() for all registered fields', () => {
    const ctx = createFormState({})
    const resetFn = vi.fn()
    const { reg } = makeField('x', 'dirty')
    reg.reset = resetFn
    ctx.registerField(reg)
    ctx.reset()
    expect(resetFn).toHaveBeenCalledOnce()
    expect(ctx.errors.value).toEqual({})
    expect(ctx.isSubmitted.value).toBe(false)
    expect(ctx.submitCount.value).toBe(0)
  })
})

describe('createFormState — validationMode and isDisabled reactivity', () => {
  it('validationMode reflects the passed Ref', async () => {
    const modeRef = ref<'on-submit' | 'on-blur' | 'on-change'>('on-blur')
    const ctx = createFormState({ validationMode: modeRef })
    expect(ctx.validationMode.value).toBe('on-blur')
    modeRef.value = 'on-change'
    await nextTick()
    expect(ctx.validationMode.value).toBe('on-change')
  })

  it('isDisabled reflects the passed Ref', async () => {
    const disabledRef = ref(false)
    const ctx = createFormState({ isDisabled: disabledRef })
    expect(ctx.isDisabled.value).toBe(false)
    disabledRef.value = true
    await nextTick()
    expect(ctx.isDisabled.value).toBe(true)
  })
})
