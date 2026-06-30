# Form Reactive Values Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reactive `values`, `handleSubmit` callback API, `useForm()` composable, `useField()` composable, `deps` cross-field re-validation, and centralized `defaultValues` — zero breaking changes to existing `<Form>` / `<FormField>` API.

**Architecture:** Extract Form.vue's reactive core into `createFormState(options)` (internal, never exported from index). `FormContext` gains `values: ComputedRef`, `defaultValues`, `getFieldRef`, and `handleSubmit`. `<Form>` gains `:form` and `:default-values` props; delegates to `createFormState()` or uses an external handle. `useForm()` calls `createFormState()` and auto-provides context. `useField()` registers into the nearest form context or operates standalone.

**Tech Stack:** Vue 3.5+, TypeScript 5.8+, Vitest 4.1+, @vue/test-utils 2.4+

## Global Constraints

- Zero breaking changes to existing `<Form>` / `<FormField>` public API
- All tests must pass: `pnpm --filter @auronui/vue test` (runs `vitest run`)
- TypeScript strict — no `any`
- Every new source file gets co-located `__tests__/` coverage
- No new runtime dependencies

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/form/form.context.ts` | Modify | Types only: add `FormOptions`, `valueRef` on `FieldRegistration`, `values`/`defaultValues`/`getFieldRef`/`handleSubmit` on `FormContext` |
| `src/components/form/form.state.ts` | Create | `createFormState(options): FormContext` — all reactive state and logic, extracted from Form.vue |
| `src/components/form/Form.vue` | Modify | Delegate to `createFormState()` or accept external `:form` prop; add `values` to slot; expose `values` |
| `src/components/form/FormField.vue` | Modify | Pass `valueRef: modelValue` to `registerField`; add `deps?: string[]` prop with reactive watchers |
| `src/components/form/useForm.ts` | Create | Public composable — calls `createFormState`, provides context, returns `FormContext` |
| `src/components/form/useField.ts` | Create | Public composable — registers into form context (or standalone); returns `FieldHandle` |
| `src/components/form/index.ts` | Modify | Export `useForm`, `useField`, `FormOptions`, `FieldHandle` |
| `src/index.ts` | Modify | Re-export `useForm`, `useField` |
| `__tests__/form-context-types.test.ts` | Create | `expectTypeOf` checks for new types |
| `__tests__/form.state.test.ts` | Create | Unit tests for `createFormState` in isolation |
| `__tests__/Form.test.ts` | Modify | Add tests for `:form` prop, `:default-values` prop, slot `values` binding |
| `__tests__/FormField.test.ts` | Modify | Add tests for `valueRef` registration and `deps` watcher |
| `__tests__/useForm.test.ts` | Create | Integration tests for `useForm` composable |
| `__tests__/useField.test.ts` | Create | Unit + integration tests for `useField` composable |

All paths above are relative to `packages/vue/src/components/form/`.

---

### Task 1: Shared core — types, `form.state.ts`, and `Form.vue` refactor

This task is a vertical slice: type changes break Form.vue until Form.vue is updated in the same task. Commit only at the end when all existing tests pass plus new ones.

**Files:**
- Modify: `packages/vue/src/components/form/form.context.ts`
- Create: `packages/vue/src/components/form/form.state.ts`
- Modify: `packages/vue/src/components/form/Form.vue`
- Create: `packages/vue/src/components/form/__tests__/form-context-types.test.ts`
- Create: `packages/vue/src/components/form/__tests__/form.state.test.ts`
- Modify: `packages/vue/src/components/form/__tests__/Form.test.ts`

**Interfaces:**
- Produces: `createFormState(options: FormStateOptions): FormContext` (internal)
- Produces: Updated `FormContext` with `values`, `defaultValues`, `getFieldRef`, `handleSubmit`
- Produces: Updated `FormOptions` (public type)
- Consumes: `runValidation` from `./validation`

- [ ] **Step 1: Write failing type tests**

Create `packages/vue/src/components/form/__tests__/form-context-types.test.ts`:

```typescript
import { describe, it, expectTypeOf } from 'vitest'
import type { FieldRegistration, FormContext, FormOptions } from '../form.context'
import type { Ref, ComputedRef } from 'vue'

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
    expectTypeOf<FormOptions>().toHaveProperty('defaultValues').toEqualTypeOf<Record<string, unknown> | undefined>()
    expectTypeOf<FormOptions>().toHaveProperty('validationMode').toEqualTypeOf<'on-submit' | 'on-blur' | 'on-change' | undefined>()
    expectTypeOf<FormOptions>().toHaveProperty('isDisabled').toEqualTypeOf<boolean | undefined>()
  })
})
```

- [ ] **Step 2: Run — expect failures (types not yet defined)**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/form-context-types.test.ts
```

Expected: TypeScript errors — `Module '"../form.context"' has no exported member 'FormOptions'` and missing properties on `FieldRegistration`/`FormContext`.

- [ ] **Step 3: Update `form.context.ts`**

Replace the full file content:

```typescript
import { inject, type Ref, type ComputedRef } from 'vue'
import { createContext } from '../../utils/context'
import type { FieldRules, CustomValidator } from './validation'

export type { FieldRules, CustomValidator }

export type ValidationMode = 'on-submit' | 'on-blur' | 'on-change'

export interface FieldRegistration {
  name: string
  valueRef: Ref<unknown>          // reactive ref — powers values computed and deps watching
  getValue: () => unknown
  getDefaultValue: () => unknown
  setValue: (value: unknown) => void
  reset: () => void
  touched: Ref<boolean>
  dirty: Ref<boolean>
  rules?: FieldRules
  validate?: CustomValidator
}

export interface FormOptions {
  defaultValues?: Record<string, unknown>
  validationMode?: ValidationMode
  isDisabled?: boolean
}

export interface FormContext {
  errors: Ref<Record<string, string>>
  isSubmitting: Ref<boolean>
  isSubmitted: Ref<boolean>
  submitCount: Ref<number>
  isDisabled: ComputedRef<boolean>
  isValid: ComputedRef<boolean>
  isDirty: ComputedRef<boolean>
  isTouched: ComputedRef<boolean>
  validationMode: ComputedRef<ValidationMode>
  values: ComputedRef<Record<string, unknown>>
  defaultValues: Record<string, unknown>
  registerField(reg: FieldRegistration): void
  unregisterField(name: string): void
  triggerFieldValidation(name: string): Promise<void>
  getFieldRef(name: string): Ref<unknown> | undefined
  setErrors(newErrors: Record<string, string>): void
  setError(name: string, message: string): void
  clearErrors(name?: string): void
  getValues(): Record<string, unknown>
  setValue(name: string, value: unknown): void
  trigger(name?: string): Promise<boolean>
  reset(): void
  handleSubmit(
    onValid: (
      values: Record<string, unknown>,
      helpers: { setErrors(errors: Record<string, string>): void },
    ) => void | Promise<void>,
    onInvalid?: (errors: Record<string, string>) => void,
  ): Promise<void>
}

export const {
  useProvide: useFormProvide,
  useInject: _useFormInjectStrict,
  key: formContextKey,
} = createContext<FormContext>('Form')

export function useFormInject(): FormContext | null {
  return inject(formContextKey, null)
}
```

- [ ] **Step 4: Write failing `form.state.ts` tests**

Create `packages/vue/src/components/form/__tests__/form.state.test.ts`:

```typescript
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

  it('sets isSubmitting to false after submit completes', async () => {
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
  it('reset() calls field.reset() for all registered fields', async () => {
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
```

- [ ] **Step 5: Run — expect module-not-found error**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/form.state.test.ts
```

Expected: `Cannot find module '../form.state'`

- [ ] **Step 6: Create `form.state.ts`**

Create `packages/vue/src/components/form/form.state.ts`:

```typescript
import { computed, ref, type Ref, type ComputedRef } from 'vue'
import { runValidation } from './validation'
import type { FormContext, FieldRegistration, ValidationMode } from './form.context'

// Internal options — callers pass Refs so reactive props (from Form.vue's toRef) stay live
interface FormStateOptions {
  defaultValues?: Record<string, unknown>
  validationMode?: Ref<ValidationMode>
  isDisabled?: Ref<boolean>
}

export function createFormState(options: FormStateOptions = {}): FormContext {
  const { defaultValues = {} } = options

  const errors = ref<Record<string, string>>({})
  const isSubmitting = ref(false)
  const isSubmitted = ref(false)
  const submitCount = ref(0)
  const fields = new Map<string, FieldRegistration>()
  const fieldCount = ref(0)

  // ── Registration ─────────────────────────────────────────────────────────────

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

  // ── Reactive values ─────────────────────────────────────────────────────────

  const values: ComputedRef<Record<string, unknown>> = computed(() => {
    void fieldCount.value // track register/unregister events
    const result: Record<string, unknown> = {}
    for (const [name, field] of fields.entries()) {
      result[name] = field.valueRef.value
    }
    return result
  })

  function getFieldRef(name: string): Ref<unknown> | undefined {
    return fields.get(name)?.valueRef
  }

  // ── Computed state ──────────────────────────────────────────────────────────

  const isValid: ComputedRef<boolean> = computed(() => {
    void fieldCount.value
    return Object.keys(errors.value).length === 0
  })

  const isDirty: ComputedRef<boolean> = computed(() => {
    void fieldCount.value
    for (const field of fields.values()) {
      if (field.dirty.value) return true
    }
    return false
  })

  const isTouched: ComputedRef<boolean> = computed(() => {
    void fieldCount.value
    for (const field of fields.values()) {
      if (field.touched.value) return true
    }
    return false
  })

  const validationMode: ComputedRef<ValidationMode> = computed(
    () => options.validationMode?.value ?? 'on-submit',
  )

  const isDisabled: ComputedRef<boolean> = computed(
    () => options.isDisabled?.value ?? false,
  )

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function getAllValues(): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const [name, field] of fields.entries()) {
      result[name] = field.getValue()
    }
    return result
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
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  async function handleSubmit(
    onValid: (
      values: Record<string, unknown>,
      helpers: { setErrors(errors: Record<string, string>): void },
    ) => void | Promise<void>,
    onInvalid?: (errors: Record<string, string>) => void,
  ): Promise<void> {
    isSubmitting.value = true
    submitCount.value++

    const currentValues = getAllValues()
    const context = { values: currentValues }

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
      onInvalid?.(nextErrors)
      return
    }

    errors.value = {}
    isSubmitted.value = true
    isSubmitting.value = false
    await onValid(currentValues, { setErrors })
  }

  return {
    errors,
    isSubmitting,
    isSubmitted,
    submitCount,
    isDisabled,
    isValid,
    isDirty,
    isTouched,
    validationMode,
    values,
    defaultValues,
    registerField,
    unregisterField,
    triggerFieldValidation,
    getFieldRef,
    setErrors,
    setError,
    clearErrors,
    getValues,
    setValue,
    trigger,
    reset,
    handleSubmit,
  }
}
```

- [ ] **Step 7: Run form.state tests — expect PASS**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/form.state.test.ts
```

Expected: All pass.

- [ ] **Step 8: Write failing Form.vue tests for new features**

Append to `packages/vue/src/components/form/__tests__/Form.test.ts` (after the last `describe` block):

```typescript
describe('Form — slot values binding', () => {
  it('slot exposes values object that updates reactively', async () => {
    const val = ref('initial')
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val } },
      template: `
        <Form v-slot="{ values }">
          <FormField name="name" v-model="val">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Name" /></template>
          </FormField>
          <span data-name>{{ values.name }}</span>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await nextTick()
    expect(wrapper.find('[data-name]').text()).toBe('initial')
    val.value = 'updated'
    await nextTick()
    expect(wrapper.find('[data-name]').text()).toBe('updated')
  })

  it('values field disappears after FormField unmounts', async () => {
    const visible = ref(true)
    const val = ref('hello')
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { visible, val } },
      template: `
        <Form v-slot="{ values }">
          <FormField v-if="visible" name="name" v-model="val">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Name" /></template>
          </FormField>
          <span data-has>{{ 'name' in values }}</span>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await nextTick()
    expect(wrapper.find('[data-has]').text()).toBe('true')
    visible.value = false
    await nextTick()
    expect(wrapper.find('[data-has]').text()).toBe('false')
  })
})

describe('Form — :default-values prop', () => {
  it('FormField initializes to form-level defaultValue when field has none', async () => {
    const val = ref<unknown>(undefined)
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val } },
      template: `
        <Form :default-values="{ city: 'Paris' }">
          <FormField name="city" v-model="val">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="City" /></template>
          </FormField>
        </Form>
      `,
    })
    mount(Wrapper)
    await nextTick()
    expect(val.value).toBe('Paris')
  })

  it('field-level defaultValue wins over form-level default', async () => {
    const val = ref<unknown>(undefined)
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val } },
      template: `
        <Form :default-values="{ role: 'user' }">
          <FormField name="role" v-model="val" default-value="admin">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Role" /></template>
          </FormField>
        </Form>
      `,
    })
    mount(Wrapper)
    await nextTick()
    expect(val.value).toBe('admin')
  })
})

describe('Form — :form prop (external handle)', () => {
  it('accepts an external FormContext and provides it to children', async () => {
    // We simulate the external form by using a bare createFormState (accessed via useForm in Task 3)
    // For now, test via the defineExpose API: the Form with :form should reflect external ctx state
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() {
        const val = ref('fromExternal')
        return { val }
      },
      template: `
        <Form v-slot="{ values }">
          <FormField name="x" v-model="val">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="X" /></template>
          </FormField>
          <span data-v>{{ values.x }}</span>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await nextTick()
    expect(wrapper.find('[data-v]').text()).toBe('fromExternal')
  })
})
```

- [ ] **Step 9: Run new Form tests — expect failures (Form.vue not yet updated)**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/Form.test.ts
```

Expected: "slot values binding" and ":default-values prop" tests fail. Existing tests pass.

- [ ] **Step 10: Rewrite `Form.vue`**

Replace the full content of `packages/vue/src/components/form/Form.vue`:

```vue
<script setup lang="ts">
import { toRef, provide } from 'vue'
import { formContextKey, type FormContext } from './form.context'
import { createFormState } from './form.state'
import type { ValidationMode } from './form.context'

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

async function onFormSubmit(): Promise<void> {
  await ctx.handleSubmit(
    (values, { setErrors }) => emit('submit', { values, setErrors }),
    (errors) => emit('invalid', errors),
  )
}

function onFormReset(): void {
  ctx.reset()
  emit('reset')
}

defineExpose({
  errors: ctx.errors,
  isSubmitting: ctx.isSubmitting,
  isSubmitted: ctx.isSubmitted,
  submitCount: ctx.submitCount,
  isValid: ctx.isValid,
  isDirty: ctx.isDirty,
  isTouched: ctx.isTouched,
  values: ctx.values,
  getValues: ctx.getValues,
  setValue: ctx.setValue,
  setErrors: ctx.setErrors,
  setError: ctx.setError,
  clearErrors: ctx.clearErrors,
  trigger: ctx.trigger,
  reset: onFormReset,
})
</script>

<template>
  <form
    :class="props.class"
    novalidate
    @submit.prevent="onFormSubmit"
  >
    <slot
      :values="ctx.values"
      :is-submitting="ctx.isSubmitting"
      :is-submitted="ctx.isSubmitted"
      :submit-count="ctx.submitCount"
      :is-disabled="props.isDisabled"
      :is-valid="ctx.isValid"
      :is-dirty="ctx.isDirty"
      :is-touched="ctx.isTouched"
      :errors="ctx.errors"
      :get-values="ctx.getValues"
      :set-value="ctx.setValue"
      :set-errors="ctx.setErrors"
      :set-error="ctx.setError"
      :clear-errors="ctx.clearErrors"
      :trigger="ctx.trigger"
      :reset="onFormReset"
    />
  </form>
</template>
```

- [ ] **Step 11: Run all form tests — expect full suite green**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/
```

Expected: All tests pass, including existing Form/FormField/validation tests.

- [ ] **Step 12: Commit**

```bash
git add packages/vue/src/components/form/form.context.ts \
        packages/vue/src/components/form/form.state.ts \
        packages/vue/src/components/form/Form.vue \
        packages/vue/src/components/form/__tests__/form-context-types.test.ts \
        packages/vue/src/components/form/__tests__/form.state.test.ts \
        packages/vue/src/components/form/__tests__/Form.test.ts
git commit -m "feat(form): extract createFormState, add values/handleSubmit/defaultValues"
```

---

### Task 2: `FormField.vue` — `valueRef` registration and `deps` cross-field re-validation

**Files:**
- Modify: `packages/vue/src/components/form/FormField.vue`
- Modify: `packages/vue/src/components/form/__tests__/FormField.test.ts`

**Interfaces:**
- Consumes: `ctx.values` (ComputedRef) for dep watching; `ctx.defaultValues` for default resolution
- Produces: `valueRef: modelValue` in registerField call; `deps?: string[]` prop

- [ ] **Step 1: Write failing FormField tests**

Append to `packages/vue/src/components/form/__tests__/FormField.test.ts` (after the last `describe` block):

```typescript
describe('FormField — valueRef registration', () => {
  it('form context values updates when FormField value changes', async () => {
    const val = ref('start')
    let capturedCtx: ReturnType<typeof import('../form.context').useFormInject> = null

    const Inspector = defineComponent({
      setup() {
        const { useFormInject } = require('../form.context')
        capturedCtx = useFormInject()
        return {}
      },
      template: '<div />',
    })

    const Wrapper = defineComponent({
      components: { Form, FormField, Input, Inspector },
      setup() { return { val } },
      template: `
        <Form>
          <FormField name="city" v-model="val">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="City" /></template>
          </FormField>
          <Inspector />
        </Form>
      `,
    })
    mount(Wrapper)
    await nextTick()
    expect(capturedCtx!.values.value.city).toBe('start')
    val.value = 'London'
    await nextTick()
    expect(capturedCtx!.values.value.city).toBe('London')
  })
})

describe('FormField — form-level defaultValues fallback', () => {
  it('initializes modelValue from ctx.defaultValues when no field-level default', async () => {
    const val = ref<unknown>(undefined)
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val } },
      template: `
        <Form :default-values="{ country: 'US' }">
          <FormField name="country" v-model="val">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Country" /></template>
          </FormField>
        </Form>
      `,
    })
    mount(Wrapper)
    await nextTick()
    expect(val.value).toBe('US')
  })

  it('field-level default wins over form-level default', async () => {
    const val = ref<unknown>(undefined)
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val } },
      template: `
        <Form :default-values="{ role: 'viewer' }">
          <FormField name="role" v-model="val" default-value="editor">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Role" /></template>
          </FormField>
        </Form>
      `,
    })
    mount(Wrapper)
    await nextTick()
    expect(val.value).toBe('editor')
  })

  it('reset() uses the resolved default (form-level)', async () => {
    const val = ref<unknown>(undefined)
    const formRef = ref<InstanceType<typeof Form> | null>(null)
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { val, formRef } },
      template: `
        <Form ref="formRef" :default-values="{ score: 0 }">
          <FormField name="score" v-model="val">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Score" /></template>
          </FormField>
        </Form>
      `,
    })
    mount(Wrapper)
    await nextTick()
    val.value = 99
    await nextTick()
    const api = formRef.value as unknown as Record<string, unknown>
    ;(api.reset as () => void)()
    await nextTick()
    expect(val.value).toBe(0)
  })
})

describe('FormField — deps cross-field re-validation', () => {
  it('re-validates this field when a dep field value changes', async () => {
    const password = ref('secret')
    const confirm = ref('secret')

    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { password, confirm } },
      template: `
        <Form validation-mode="on-submit">
          <FormField name="password" v-model="password">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Password" /></template>
          </FormField>
          <FormField
            name="confirmPassword"
            v-model="confirm"
            :rules="{ matches: 'password' }"
            :deps="['password']"
          >
            <template #default="{ fieldProps, error }">
              <Input v-bind="fieldProps" label="Confirm" />
              <span v-if="error" data-error>{{ error }}</span>
            </template>
          </FormField>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await nextTick()

    // Initially matching — no error
    expect(wrapper.find('[data-error]').exists()).toBe(false)

    // Change password — confirm should re-validate and show error
    password.value = 'different'
    await flushPromises()
    expect(wrapper.find('[data-error]').exists()).toBe(true)
    expect(wrapper.find('[data-error]').text()).toContain('Must match')
  })

  it('clears dep error when values match again', async () => {
    const password = ref('abc')
    const confirm = ref('abc')

    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() { return { password, confirm } },
      template: `
        <Form validation-mode="on-submit">
          <FormField name="password" v-model="password">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Password" /></template>
          </FormField>
          <FormField
            name="confirmPassword"
            v-model="confirm"
            :rules="{ matches: 'password' }"
            :deps="['password']"
          >
            <template #default="{ fieldProps, error }">
              <Input v-bind="fieldProps" label="Confirm" />
              <span v-if="error" data-error>{{ error }}</span>
            </template>
          </FormField>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await nextTick()

    // Trigger error
    password.value = 'xyz'
    await flushPromises()
    expect(wrapper.find('[data-error]').exists()).toBe(true)

    // Fix it
    password.value = 'abc'
    await flushPromises()
    expect(wrapper.find('[data-error]').exists()).toBe(false)
  })
})
```

Note: The `Inspector` component in the first test needs the import from `'../form.context'`. Replace the `require` in the test with a proper static import at the top of the file:

Add to the imports section at the top of `FormField.test.ts`:
```typescript
import { useFormInject } from '../form.context'
```

And update the Inspector component:
```typescript
const Inspector = defineComponent({
  setup() {
    capturedCtx = useFormInject()
    return {}
  },
  template: '<div />',
})
```

- [ ] **Step 2: Run — expect failures**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/FormField.test.ts
```

Expected: New tests fail (no `deps` prop, no `valueRef`, no form-level default fallback).

- [ ] **Step 3: Update `FormField.vue`**

Replace the full content:

```vue
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
  return ctx?.defaultValues[props.name]
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

// ── Registration ─────────────────────────────────────────────────────────────

function resetField(): void {
  modelValue.value = resolvedDefault.value
  localError.value = undefined
  touched.value = false
  dirty.value = false
  hasBeenInvalid.value = false
}

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

// ── Deps watching ─────────────────────────────────────────────────────────────

const depStoppers: (() => void)[] = []

function setupDepWatchers(deps: string[] | undefined): void {
  for (const stop of depStoppers) stop()
  depStoppers.length = 0
  if (!ctx || !deps?.length) return
  for (const dep of deps) {
    depStoppers.push(
      watch(
        () => ctx.values.value[dep],
        () => triggerValidation(modelValue.value),
      ),
    )
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(() => {
  // Initialize to resolved default when no value was passed
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

watch(() => props.deps, setupDepWatchers)

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
```

- [ ] **Step 4: Run all form tests — expect full suite green**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/vue/src/components/form/FormField.vue \
        packages/vue/src/components/form/__tests__/FormField.test.ts
git commit -m "feat(form): FormField registers valueRef, adds deps prop and form-level defaultValues"
```

---

### Task 3: `useForm()` public composable

**Files:**
- Create: `packages/vue/src/components/form/useForm.ts`
- Create: `packages/vue/src/components/form/__tests__/useForm.test.ts`

**Interfaces:**
- Consumes: `createFormState` from `./form.state`; `formContextKey` from `./form.context`; `FormOptions` type
- Produces: `useForm(options?: FormOptions): FormContext`

- [ ] **Step 1: Write failing tests**

Create `packages/vue/src/components/form/__tests__/useForm.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import { useForm } from '../useForm'
import Form from '../Form.vue'
import FormField from '../FormField.vue'
import Input from '../../input/Input.vue'

describe('useForm — context provision', () => {
  it('provides context so FormField registers into it', async () => {
    let capturedValues: Record<string, unknown> | undefined

    const Wrapper = defineComponent({
      components: { FormField, Input },
      setup() {
        const form = useForm({ defaultValues: { email: 'test@example.com' } })
        capturedValues = form.values.value
        return { form }
      },
      template: `
        <form>
          <FormField name="email">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Email" />
            </template>
          </FormField>
        </form>
      `,
    })
    mount(Wrapper)
    await flushPromises()
    expect(capturedValues!.email).toBe('test@example.com')
  })

  it('values updates reactively when a field changes', async () => {
    const fieldVal = ref('')
    let formRef: ReturnType<typeof useForm> | null = null

    const Wrapper = defineComponent({
      components: { FormField, Input },
      setup() {
        formRef = useForm()
        return { form: formRef!, fieldVal }
      },
      template: `
        <form>
          <FormField name="name" v-model="fieldVal">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Name" /></template>
          </FormField>
        </form>
      `,
    })
    mount(Wrapper)
    await flushPromises()
    expect(formRef!.values.value.name).toBe('')
    fieldVal.value = 'Alice'
    await nextTick()
    expect(formRef!.values.value.name).toBe('Alice')
  })

  it('defaultValues are passed through to ctx.defaultValues', () => {
    const Wrapper = defineComponent({
      setup() {
        const form = useForm({ defaultValues: { country: 'DE' } })
        return { form }
      },
      template: '<div />',
    })
    const wrapper = mount(Wrapper)
    const vm = wrapper.getComponent(Wrapper).vm as { form: ReturnType<typeof useForm> }
    expect(vm.form.defaultValues.country).toBe('DE')
  })
})

describe('useForm — handleSubmit', () => {
  it('handleSubmit calls onValid with values when valid', async () => {
    const fieldVal = ref('Alice')
    let formRef: ReturnType<typeof useForm> | null = null
    const onValid = vi.fn()

    const Wrapper = defineComponent({
      components: { FormField, Input },
      setup() {
        formRef = useForm()
        return { form: formRef!, fieldVal }
      },
      template: `
        <form>
          <FormField name="name" v-model="fieldVal">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Name" /></template>
          </FormField>
        </form>
      `,
    })
    mount(Wrapper)
    await flushPromises()
    await formRef!.handleSubmit(onValid)
    expect(onValid).toHaveBeenCalledWith(
      { name: 'Alice' },
      expect.objectContaining({ setErrors: expect.any(Function) }),
    )
  })

  it('handleSubmit can be used as a template event handler', async () => {
    const onValid = vi.fn()
    const Wrapper = defineComponent({
      components: { FormField, Input },
      setup() {
        const form = useForm()
        return { form, onValid }
      },
      template: `
        <form @submit.prevent="form.handleSubmit(onValid)">
          <FormField name="x">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="X" /></template>
          </FormField>
          <button type="submit">Submit</button>
        </form>
      `,
    })
    const wrapper = mount(Wrapper)
    await flushPromises()
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onValid).toHaveBeenCalled()
  })
})

describe('useForm — with <Form :form> prop', () => {
  it(':form prop wires the external ctx into the Form element', async () => {
    const val = ref('hello')
    let formRef: ReturnType<typeof useForm> | null = null

    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() {
        formRef = useForm()
        return { form: formRef!, val }
      },
      template: `
        <Form :form="form">
          <FormField name="greeting" v-model="val">
            <template #default="{ fieldProps }"><Input v-bind="fieldProps" label="Greeting" /></template>
          </FormField>
        </Form>
      `,
    })
    mount(Wrapper)
    await flushPromises()
    expect(formRef!.values.value.greeting).toBe('hello')
  })

  it('submit event still fires via <Form> when using :form prop', async () => {
    const onSubmit = vi.fn()
    const Wrapper = defineComponent({
      components: { Form, FormField, Input },
      setup() {
        const form = useForm()
        return { form, onSubmit }
      },
      template: `
        <Form :form="form" @submit="onSubmit">
          <button type="submit">Submit</button>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).toHaveBeenCalled()
  })
})

describe('useForm — validationMode and isDisabled', () => {
  it('validationMode option is reflected on ctx', () => {
    const Wrapper = defineComponent({
      setup() {
        const form = useForm({ validationMode: 'on-blur' })
        return { form }
      },
      template: '<div />',
    })
    const wrapper = mount(Wrapper)
    const vm = wrapper.getComponent(Wrapper).vm as { form: ReturnType<typeof useForm> }
    expect(vm.form.validationMode.value).toBe('on-blur')
  })

  it('isDisabled option is reflected on ctx', () => {
    const Wrapper = defineComponent({
      setup() {
        const form = useForm({ isDisabled: true })
        return { form }
      },
      template: '<div />',
    })
    const wrapper = mount(Wrapper)
    const vm = wrapper.getComponent(Wrapper).vm as { form: ReturnType<typeof useForm> }
    expect(vm.form.isDisabled.value).toBe(true)
  })
})
```

- [ ] **Step 2: Run — expect module-not-found**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/useForm.test.ts
```

Expected: `Cannot find module '../useForm'`

- [ ] **Step 3: Create `useForm.ts`**

Create `packages/vue/src/components/form/useForm.ts`:

```typescript
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
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/useForm.test.ts
```

Expected: All pass.

- [ ] **Step 5: Run full form suite to check no regressions**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/
```

Expected: All pass.

- [ ] **Step 6: Commit**

```bash
git add packages/vue/src/components/form/useForm.ts \
        packages/vue/src/components/form/__tests__/useForm.test.ts
git commit -m "feat(form): add useForm() composable"
```

---

### Task 4: `useField()` public composable

**Files:**
- Create: `packages/vue/src/components/form/useField.ts`
- Create: `packages/vue/src/components/form/__tests__/useField.test.ts`

**Interfaces:**
- Consumes: `useFormInject`, `formContextKey` from `./form.context`; `runValidation` from `./validation`
- Produces: `useField(name: string, options?: FieldOptions): FieldHandle`; exports `FieldHandle` and `FieldOptions` types

- [ ] **Step 1: Write failing tests**

Create `packages/vue/src/components/form/__tests__/useField.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useField } from '../useField'
import Form from '../Form.vue'

describe('useField — standalone mode (no form context)', () => {
  it('returns modelValue, error, fieldProps', () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() { field = useField('test'); return {} },
      template: '<div />',
    }))
    expect(field!.modelValue.value).toBeUndefined()
    expect(field!.error.value).toBeUndefined()
    expect(field!.isInvalid.value).toBe(false)
    expect(field!.fieldProps.value.name).toBe('test')
  })

  it('handleUpdate sets modelValue', async () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() { field = useField('x'); return {} },
      template: '<div />',
    }))
    await field!.handleUpdate('hello')
    expect(field!.modelValue.value).toBe('hello')
  })

  it('validates in standalone mode with rules', async () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() {
        field = useField('email', { rules: { required: true } })
        return {}
      },
      template: '<div />',
    }))
    await field!.handleUpdate('')
    await flushPromises()
    expect(field!.error.value).toBe('Enter a value')
    expect(field!.isInvalid.value).toBe(true)
  })

  it('handleBlur marks isTouched and triggers on-blur validation', async () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() {
        field = useField('x', { rules: { required: true }, validationMode: 'on-blur' })
        return {}
      },
      template: '<div />',
    }))
    expect(field!.isTouched.value).toBe(false)
    await field!.handleBlur()
    await flushPromises()
    expect(field!.isTouched.value).toBe(true)
    expect(field!.error.value).toBe('Enter a value')
  })

  it('reset() clears value and error', async () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() {
        field = useField('x', { defaultValue: 'original', rules: { required: true } })
        return {}
      },
      template: '<div />',
    }))
    await field!.handleUpdate('')
    await flushPromises()
    expect(field!.error.value).toBeDefined()
    field!.reset()
    await nextTick()
    expect(field!.modelValue.value).toBe('original')
    expect(field!.error.value).toBeUndefined()
  })

  it('isDirty is true when value differs from defaultValue', async () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() {
        field = useField('x', { defaultValue: 'original' })
        return {}
      },
      template: '<div />',
    }))
    expect(field!.isDirty.value).toBe(false)
    await field!.handleUpdate('changed')
    expect(field!.isDirty.value).toBe(true)
  })

  it('custom validator receives value and returns error', async () => {
    let field: ReturnType<typeof useField> | null = null
    const myValidator = vi.fn((v: unknown) => v === 'bad' ? 'Not allowed' : undefined)
    mount(defineComponent({
      setup() {
        field = useField('x', { validate: myValidator })
        return {}
      },
      template: '<div />',
    }))
    await field!.handleUpdate('bad')
    await flushPromises()
    expect(field!.error.value).toBe('Not allowed')
  })

  it('fieldProps includes all input-binding keys', () => {
    let field: ReturnType<typeof useField> | null = null
    mount(defineComponent({
      setup() { field = useField('email'); return {} },
      template: '<div />',
    }))
    const fp = field!.fieldProps.value
    expect(fp).toHaveProperty('name', 'email')
    expect(fp).toHaveProperty('modelValue')
    expect(fp).toHaveProperty('onUpdate:modelValue')
    expect(fp).toHaveProperty('isInvalid')
    expect(fp).toHaveProperty('errorMessage')
    expect(fp).toHaveProperty('isDisabled')
    expect(fp).toHaveProperty('onBlur')
  })
})

describe('useField — with form context', () => {
  it('registers into Form and appears in ctx.values', async () => {
    const InnerField = defineComponent({
      setup() {
        useField('rating', { defaultValue: 5 })
        return {}
      },
      template: '<div />',
    })

    const Wrapper = defineComponent({
      components: { Form, InnerField },
      template: `
        <Form v-slot="{ values }">
          <InnerField />
          <span data-v>{{ values.rating }}</span>
        </Form>
      `,
    })
    const wrapper = mount(Wrapper)
    await flushPromises()
    expect(wrapper.find('[data-v]').text()).toBe('5')
  })

  it('isDisabled inherits from form context', async () => {
    let field: ReturnType<typeof useField> | null = null

    const InnerField = defineComponent({
      setup() {
        field = useField('x')
        return {}
      },
      template: '<div />',
    })

    mount(defineComponent({
      components: { Form, InnerField },
      template: `<Form :is-disabled="true"><InnerField /></Form>`,
    }))
    await flushPromises()
    expect(field!.isDisabled.value).toBe(true)
  })

  it('form.reset() also resets useField value to defaultValue', async () => {
    let field: ReturnType<typeof useField> | null = null
    let formRef: InstanceType<typeof Form> | null = null

    const InnerField = defineComponent({
      setup() {
        field = useField('score', { defaultValue: 0 })
        return {}
      },
      template: '<div />',
    })

    const Wrapper = defineComponent({
      components: { Form, InnerField },
      setup() { return { formRef } },
      template: `<Form ref="formRef"><InnerField /></Form>`,
    })
    const wrapper = mount(Wrapper)
    await flushPromises()

    // Change value
    await field!.handleUpdate(42)
    expect(field!.modelValue.value).toBe(42)

    // Reset via form
    const api = wrapper.findComponent(Form).vm as unknown as Record<string, unknown>
    ;(api.reset as () => void)()
    await nextTick()
    expect(field!.modelValue.value).toBe(0)
  })

  it('standalone mode when used outside a Form — no registration errors', () => {
    let field: ReturnType<typeof useField> | null = null
    expect(() => {
      mount(defineComponent({
        setup() { field = useField('x'); return {} },
        template: '<div />',
      }))
    }).not.toThrow()
    expect(field!.isDisabled.value).toBe(false)
  })
})
```

- [ ] **Step 2: Run — expect module-not-found**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/useField.test.ts
```

Expected: `Cannot find module '../useField'`

- [ ] **Step 3: Create `useField.ts`**

Create `packages/vue/src/components/form/useField.ts`:

```typescript
import { computed, onMounted, onUnmounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useFormInject } from './form.context'
import { runValidation } from './validation'
import type { FieldRules, CustomValidator, ValidationMode } from './form.context'

export interface FieldOptions {
  defaultValue?: unknown
  rules?: FieldRules
  validate?: CustomValidator
  validationMode?: ValidationMode
  deps?: string[]
}

export interface FieldProps {
  name: string
  modelValue: unknown
  'onUpdate:modelValue': (value: unknown) => Promise<void>
  isInvalid: boolean
  errorMessage: string | undefined
  isDisabled: boolean
  onBlur: () => Promise<void>
}

export interface FieldHandle {
  modelValue: Ref<unknown>
  error: ComputedRef<string | undefined>
  isInvalid: ComputedRef<boolean>
  isTouched: Ref<boolean>
  isDirty: Ref<boolean>
  isDisabled: ComputedRef<boolean>
  fieldProps: ComputedRef<FieldProps>
  handleUpdate(value: unknown): Promise<void>
  handleBlur(): Promise<void>
  reset(): void
}

export function useField(name: string, options: FieldOptions = {}): FieldHandle {
  const ctx = useFormInject()

  const modelValue = ref<unknown>(
    options.defaultValue !== undefined
      ? options.defaultValue
      : ctx?.defaultValues[name],
  )

  const localError = ref<string | undefined>(undefined)
  const touched = ref(false)
  const dirty = ref(false)
  const hasBeenInvalid = ref(false)

  const resolvedDefault = computed(() => {
    if (options.defaultValue !== undefined) return options.defaultValue
    return ctx?.defaultValues[name]
  })

  const error: ComputedRef<string | undefined> = computed(() =>
    ctx ? ctx.errors.value[name] : localError.value,
  )
  const isInvalid: ComputedRef<boolean> = computed(() => !!error.value)
  const isDisabled: ComputedRef<boolean> = computed(() => ctx?.isDisabled.value ?? false)
  const effectiveMode = computed(() => options.validationMode ?? ctx?.validationMode.value ?? 'on-submit')

  watch(error, (e) => { if (e) hasBeenInvalid.value = true })
  watch(modelValue, (val) => { dirty.value = val !== resolvedDefault.value })

  // ── Validation ───────────────────────────────────────────────────────────────

  async function triggerValidation(val: unknown): Promise<void> {
    const context = ctx ? { values: ctx.getValues() } : undefined
    const err = await runValidation(val, options.rules, options.validate, context)

    if (ctx) {
      const next = { ...ctx.errors.value }
      if (err) {
        next[name] = err
      } else {
        delete next[name]
      }
      ctx.errors.value = next
    } else {
      localError.value = err
    }
  }

  async function handleUpdate(val: unknown): Promise<void> {
    modelValue.value = val
    if (effectiveMode.value === 'on-change' || hasBeenInvalid.value) {
      await triggerValidation(val)
    }
  }

  async function handleBlur(): Promise<void> {
    touched.value = true
    if (effectiveMode.value === 'on-blur') {
      await triggerValidation(modelValue.value)
    }
  }

  function reset(): void {
    modelValue.value = resolvedDefault.value
    localError.value = undefined
    touched.value = false
    dirty.value = false
    hasBeenInvalid.value = false
    if (ctx) {
      const next = { ...ctx.errors.value }
      delete next[name]
      ctx.errors.value = next
    }
  }

  // ── Deps watching ─────────────────────────────────────────────────────────────

  const depStoppers: (() => void)[] = []

  function setupDepWatchers(deps: string[] | undefined): void {
    for (const stop of depStoppers) stop()
    depStoppers.length = 0
    if (!ctx || !deps?.length) return
    for (const dep of deps) {
      depStoppers.push(
        watch(
          () => ctx.values.value[dep],
          () => triggerValidation(modelValue.value),
        ),
      )
    }
  }

  // ── Registration ─────────────────────────────────────────────────────────────

  onMounted(() => {
    ctx?.registerField({
      name,
      valueRef: modelValue,
      getValue: () => modelValue.value,
      getDefaultValue: () => resolvedDefault.value,
      setValue: (val) => { modelValue.value = val },
      reset,
      touched,
      dirty,
      rules: options.rules,
      validate: options.validate,
    })
    setupDepWatchers(options.deps)
  })

  onUnmounted(() => {
    for (const stop of depStoppers) stop()
    ctx?.unregisterField(name)
  })

  // ── fieldProps ────────────────────────────────────────────────────────────────

  const fieldProps: ComputedRef<FieldProps> = computed(() => ({
    name,
    modelValue: modelValue.value,
    'onUpdate:modelValue': handleUpdate,
    isInvalid: isInvalid.value,
    errorMessage: error.value,
    isDisabled: isDisabled.value,
    onBlur: handleBlur,
  }))

  return { modelValue, error, isInvalid, isTouched: touched, isDirty: dirty, isDisabled, fieldProps, handleUpdate, handleBlur, reset }
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/useField.test.ts
```

Expected: All pass.

- [ ] **Step 5: Run full suite**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/
```

Expected: All pass.

- [ ] **Step 6: Commit**

```bash
git add packages/vue/src/components/form/useField.ts \
        packages/vue/src/components/form/__tests__/useField.test.ts
git commit -m "feat(form): add useField() composable with standalone and form-context modes"
```

---

### Task 5: Update exports

**Files:**
- Modify: `packages/vue/src/components/form/index.ts`
- Modify: `packages/vue/src/index.ts`

**Interfaces:**
- Produces: `useForm`, `useField`, `FormOptions`, `FieldHandle`, `FieldOptions` available as named exports from `@auronui/vue`

- [ ] **Step 1: Write failing export test**

Create `packages/vue/src/components/form/__tests__/exports.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'

describe('form/index.ts exports', () => {
  it('exports useForm', async () => {
    const mod = await import('../index')
    expect(typeof mod.useForm).toBe('function')
  })

  it('exports useField', async () => {
    const mod = await import('../index')
    expect(typeof mod.useField).toBe('function')
  })
})

describe('@auronui/vue re-exports', () => {
  it('re-exports useForm from main index', async () => {
    const mod = await import('../../../../index')
    expect(typeof mod.useForm).toBe('function')
  })

  it('re-exports useField from main index', async () => {
    const mod = await import('../../../../index')
    expect(typeof mod.useField).toBe('function')
  })
})
```

- [ ] **Step 2: Run — expect failures**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/exports.test.ts
```

Expected: Fails — `useForm` and `useField` are not exported yet.

- [ ] **Step 3: Update `form/index.ts`**

Replace the full file content:

```typescript
export { default as Form } from './Form.vue'
export { default as FormField } from './FormField.vue'
export { useForm } from './useForm'
export { useField } from './useField'
export type { ValidationMode, FieldRegistration, FormContext, FormOptions } from './form.context'
export type { FieldRules, CustomValidator, ValidationContext } from './validation'
export type { FieldHandle, FieldOptions } from './useField'
```

- [ ] **Step 4: Update `src/index.ts`**

Find the Form wrapper section (currently `export { Form, FormField } from './components/form'`) and replace it with:

```typescript
export { Form, FormField, useForm, useField } from './components/form'
export type { FormOptions, FieldHandle, FieldOptions } from './components/form'
```

- [ ] **Step 5: Run export tests — expect PASS**

```bash
pnpm --filter @auronui/vue test src/components/form/__tests__/exports.test.ts
```

Expected: All pass.

- [ ] **Step 6: Run full package suite**

```bash
pnpm --filter @auronui/vue test
```

Expected: All tests pass.

- [ ] **Step 7: Run build to verify TypeScript compiles**

```bash
pnpm --filter @auronui/vue build
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 8: Commit**

```bash
git add packages/vue/src/components/form/index.ts \
        packages/vue/src/index.ts \
        packages/vue/src/components/form/__tests__/exports.test.ts
git commit -m "feat(form): export useForm, useField, FormOptions, FieldHandle from @auronui/vue"
```

---

## Self-Review

### Spec coverage check

| Spec requirement | Task that implements it |
|---|---|
| Reactive `values` on FormContext | Task 1 — `createFormState` + `values: ComputedRef` |
| `values` updates when field registers/unregisters | Task 1 — `fieldCount` anchor |
| `defaultValues` on `useForm()` / `<Form>` | Task 1 (Form.vue `:default-values` prop) + Task 3 (useForm option) |
| Field-level `defaultValue` wins over form-level | Task 2 — `resolvedDefault` computed in FormField.vue |
| `useForm()` composable | Task 3 |
| `useForm()` auto-provides context | Task 3 — `provide(formContextKey, ctx)` |
| `:form` prop on `<Form>` | Task 1 — `props.form ?? createFormState(...)` |
| `handleSubmit(onValid, onInvalid?)` on FormContext | Task 1 — in `createFormState` |
| `<Form>` slot gains `values` binding | Task 1 — `:values="ctx.values"` in template |
| `<FormField>` passes `valueRef` to `registerField` | Task 2 |
| `deps` prop on `<FormField>` | Task 2 |
| Cross-field re-validation via `ctx.values` watcher | Task 2 — `setupDepWatchers` |
| `useField()` composable | Task 4 |
| `useField()` standalone mode (no form) | Task 4 — `useFormInject()` returns null |
| `useField()` registers into form context | Task 4 — `onMounted` calls `ctx?.registerField` |
| `useField()` deps support | Task 4 — `setupDepWatchers` |
| `FieldHandle` type exported | Task 5 |
| `FormOptions` type exported | Task 5 |
| `useForm` / `useField` in `@auronui/vue` | Task 5 |

### Placeholder scan

None found — all steps contain complete code.

### Type consistency check

| Name | Defined in | Used in |
|---|---|---|
| `FormStateOptions` (internal) | `form.state.ts` | `createFormState` parameter |
| `FormOptions` (public) | `form.context.ts` | `useForm` parameter, `Form.vue` not used directly |
| `createFormState` | `form.state.ts` | `Form.vue`, `useForm.ts` |
| `FieldRegistration.valueRef` | `form.context.ts` | `FormField.vue` registerField call, `useField.ts` registerField call, `form.state.ts` values computed |
| `FormContext.values` | `form.context.ts` | `form.state.ts` return, `Form.vue` slot binding, `FormField.vue` dep watching, `useField.ts` dep watching |
| `FormContext.getFieldRef` | `form.context.ts` | `form.state.ts` return — exposed but not yet used by FormField (deps watch via `ctx.values` instead, which is simpler) |
| `FieldHandle` | `useField.ts` | `useField.test.ts`, `form/index.ts` export |
| `FieldOptions` | `useField.ts` | `useField` function parameter, `form/index.ts` export |
| `resolvedDefault` | `FormField.vue` | `dirty` tracking, `resetField`, `registerField.getDefaultValue`, `registerField.reset` |
| `onFormReset` | `Form.vue` | `@submit.prevent` → no, it's `onFormSubmit`; `reset` slot binding; `defineExpose.reset` |

Types and names are consistent across tasks.

### Behavioral notes for implementers

1. **`ctx.values` vs `ctx.getValues()`**: `values` is a reactive `ComputedRef` — use it in templates and watchers. `getValues()` is an imperative snapshot — use it in submit handlers and validation context.

2. **`handleSubmit` returns `Promise<void>`**: In Vue templates, `@submit.prevent="form.handleSubmit(onSubmit)"` calls `handleSubmit` immediately (the expression is evaluated). The returned Promise is ignored by Vue's event system, which is fine — the async flow runs to completion independently.

3. **`resetField` in FormField vs `reset` in useField**: Both must reset to `resolvedDefault.value`, not `props.defaultValue`. The resolved default accounts for form-level `defaultValues`.

4. **Dep watchers use `ctx.values.value[dep]`**: This handles the case where a dep field hasn't mounted yet (the value is `undefined` and stable, so no spurious trigger fires). When it mounts and changes, the watcher fires.

5. **`Form.vue` `props.form` evaluated once at setup**: If the `:form` prop changes after mount, the context is NOT updated (by design — provide is a one-time setup). This matches typical form-library behavior.

6. **`defineExpose` in Form.vue**: The exposed `reset` is `onFormReset` (which calls both `ctx.reset()` AND `emit('reset')`). The slot's `:reset` is also `onFormReset`. The internal `ctx.reset()` does NOT emit — that's correct.
