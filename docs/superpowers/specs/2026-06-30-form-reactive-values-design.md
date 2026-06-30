# Form Reactive Values & Composables — Design Spec

**Date:** 2026-06-30
**Status:** Approved

---

## Problem

The existing `<Form>` / `<FormField>` system handles validation and submit well, but has no reactive view of field values. `getValues()` returns a plain snapshot — you cannot `watch` it, use it in a `computed`, or conditionally render fields based on it. This blocks three real-world use cases:

1. **Conditional field visibility** — show/hide field B based on the live value of field A
2. **Cross-field re-validation** — when field A changes, field B re-validates automatically (e.g. confirm password, date ranges)
3. **Derived/computed values** — consumer computes a value from multiple fields in real-time

---

## Goals

- Reactive `values` available everywhere — in templates, `watch`, `computed`
- `useForm()` composable for headless form control
- `useField()` composable for headless custom field components
- `deps` on `<FormField>` / `useField()` for cross-field re-validation
- Centralized `defaultValues` on `useForm()` / `<Form>`, field-level prop wins if both provided
- Zero breaking changes to existing `<Form>` / `<FormField>` API

---

## Architecture

### Shared core: `createFormState(options)`

Internal function (never exported). Contains all reactive state and logic currently in `Form.vue`'s `<script setup>`. Both `useForm()` and `<Form>` call it. Single source of truth — no duplication.

```
createFormState(options)
       │
       ├── useForm(options)     calls createFormState(), auto-provides context, returns FormHandle
       │
       └── <Form>               accepts :form prop OR calls createFormState() internally
```

### FormHandle = FormContext

`useForm()` returns the `FormContext` object directly. It is both the injectable context (used by `FormField` / `useField()`) and the public handle returned to the consumer. Internal-only methods (`registerField`, `unregisterField`) are present but undocumented.

### Reactive values flow

`FieldRegistration` gains `valueRef: Ref<unknown>` — the field's actual reactive ref. `FormContext.values` is a `computed` that iterates all registered `valueRef.value` entries, anchored on `fieldCount` for registration reactivity:

```ts
const values = computed(() => {
  void fieldCount.value // tracks register/unregister
  const result: Record<string, unknown> = {}
  for (const [name, field] of fields.entries()) {
    result[name] = field.valueRef.value // reactive dep on each field's value
  }
  return result
})
```

### Cross-field re-validation (`deps`)

`useField()` and `<FormField>` accept `deps?: string[]`. On mount, for each dep name, a `watch` is set up on `ctx.getFieldRef(depName)`. When a dep's value changes, the field re-triggers its own validation. Watchers are cleaned up on unmount.

---

## Type Changes (`form.context.ts`)

### `FieldRegistration` — one addition

```ts
export interface FieldRegistration {
  name: string
  valueRef: Ref<unknown>          // NEW — reactive ref used for values computed + deps watching
  getValue: () => unknown         // kept for imperative snapshot
  getDefaultValue: () => unknown
  setValue: (value: unknown) => void
  reset: () => void
  touched: Ref<boolean>
  dirty: Ref<boolean>
  rules?: FieldRules
  validate?: CustomValidator
}
```

### `FormContext` — three additions

```ts
export interface FormContext {
  // all existing fields unchanged
  values: ComputedRef<Record<string, unknown>>        // NEW
  defaultValues: Record<string, unknown>               // NEW
  getFieldRef(name: string): Ref<unknown> | undefined // NEW
}
```

### New `FormOptions`

```ts
export interface FormOptions {
  defaultValues?: Record<string, unknown>
  validationMode?: ValidationMode
  isDisabled?: boolean
}
```

---

## `useForm(options?)` — Public Composable

```ts
const form = useForm({
  defaultValues: { email: '', country: 'US', employed: false },
  validationMode: 'on-blur',
  isDisabled: false,
})
```

**Returns (`FormContext` / `FormHandle`):**

| Member | Type | Description |
|---|---|---|
| `values` | `ComputedRef<Record<string, unknown>>` | Live reactive field values |
| `errors` | `Ref<Record<string, string>>` | Current validation errors |
| `isValid` | `ComputedRef<boolean>` | No errors present |
| `isDirty` | `ComputedRef<boolean>` | Any field differs from default |
| `isTouched` | `ComputedRef<boolean>` | Any field has been blurred |
| `isSubmitting` | `Ref<boolean>` | Submit in progress |
| `isSubmitted` | `Ref<boolean>` | Form has been submitted |
| `submitCount` | `Ref<number>` | Number of submit attempts |
| `defaultValues` | `Record<string, unknown>` | Resolved defaults |
| `getValues()` | `() => Record<string, unknown>` | Imperative snapshot |
| `setValue(name, value)` | | Set a field value programmatically |
| `setError(name, message)` | | Set a single field error |
| `setErrors(errors)` | | Set multiple errors (e.g. from server) |
| `clearErrors(name?)` | | Clear one or all errors |
| `trigger(name?)` | `() => Promise<boolean>` | Programmatically validate |
| `reset()` | | Reset all fields and state |
| `handleSubmit(onValid, onInvalid?)` | | Returns submit event handler |

`useForm()` automatically calls `provide(formContextKey, ctx)` — any `<FormField>` or `useField()` in the component tree registers into it without any prop wiring.

**Usage without `<Form>`:**
```vue
<script setup>
const form = useForm({ defaultValues: { email: '', plan: 'free' } })

async function onSubmit(values, { setErrors }) {
  const result = await api.submit(values)
  if (result.errors) setErrors(result.errors)
}
</script>

<template>
  <form @submit.prevent="form.handleSubmit(onSubmit)">
    <FormField name="email" :rules="{ required: true, email: true }">
      <template #default="{ fieldProps }">
        <Input v-bind="fieldProps" label="Email" />
      </template>
    </FormField>

    <!-- Conditional field — reactive values just work -->
    <div v-if="form.values.plan === 'paid'">
      <FormField name="card" :rules="{ required: true }">
        <template #default="{ fieldProps }">
          <Input v-bind="fieldProps" label="Card number" />
        </template>
      </FormField>
    </div>

    <Button type="submit" :is-loading="form.isSubmitting">Submit</Button>
  </form>
</template>
```

---

## `useField(name, options?)` — Public Composable

```ts
const field = useField('email', {
  defaultValue: '',
  rules: { required: true, email: true },
  validate: (value, ctx) => customCheck(value, ctx),
  validationMode: 'on-change',
  deps: ['username'],   // re-validates when 'username' field changes
})
```

**Options:**

| Option | Type | Description |
|---|---|---|
| `defaultValue` | `unknown` | Initial value (overrides form-level default) |
| `rules` | `FieldRules` | Built-in validation rules |
| `validate` | `CustomValidator` | Custom async validator |
| `validationMode` | `ValidationMode` | Override form-level mode for this field |
| `deps` | `string[]` | Field names that trigger re-validation when changed |

**Returns (`FieldHandle`):**

| Member | Type | Description |
|---|---|---|
| `modelValue` | `Ref<unknown>` | Bind with `v-model` |
| `error` | `ComputedRef<string \| undefined>` | Current error message |
| `isInvalid` | `ComputedRef<boolean>` | Has an error |
| `isTouched` | `Ref<boolean>` | Field has been blurred |
| `isDirty` | `Ref<boolean>` | Value differs from default |
| `isDisabled` | `ComputedRef<boolean>` | Inherits from form context |
| `fieldProps` | `ComputedRef<FieldProps>` | Spread onto any input component |
| `handleUpdate(value)` | | Update value + trigger validation |
| `handleBlur()` | | Mark touched + trigger blur validation |
| `reset()` | | Reset to default value and clear state |

**Standalone mode** (no form context): manages its own local error and touched state, does not register anywhere. `deps` is ignored in standalone mode.

**Custom field component example:**
```vue
<!-- StarRating.vue — fully participates in form state -->
<script setup>
const { fieldProps, error } = useField('rating', {
  defaultValue: 0,
  rules: { required: true },
  validate: (v) => Number(v) < 1 ? 'Pick a rating' : undefined,
})
</script>

<template>
  <div>
    <StarPicker v-bind="fieldProps" />
    <span v-if="error" role="alert">{{ error }}</span>
  </div>
</template>
```

---

## `<Form>` Changes

Two new props. Slot gains `values`. All existing props and slot bindings unchanged.

**New props:**

| Prop | Type | Description |
|---|---|---|
| `form` | `FormContext` | External `useForm()` instance. When provided, Form provides it to children and skips creating its own state. |
| `defaultValues` | `Record<string, unknown>` | Centralized field defaults. Field-level `defaultValue` prop wins if both are set. |

**Slot — new binding:**
```vue
<Form @submit="onSubmit">
  <template #default="{ values, errors, isSubmitting, setValue, trigger, reset, isValid, isDirty }">
    <!-- values is now reactive ComputedRef unwrapped -->
    <div v-if="values.employed">
      <FormField name="employer">...</FormField>
    </div>
  </template>
</Form>
```

**With external `useForm()`:**
```vue
<script setup>
const form = useForm({ defaultValues: { country: 'US' } })
watch(() => form.values.country, (country) => loadStates(country))
</script>

<template>
  <Form :form="form" @submit="onSubmit">
    ...
  </Form>
</template>
```

When `:form` is provided, `<Form>` calls `provide(formContextKey, form)` and emits `submit` / `invalid` / `reset` as before. The form element's `@submit.prevent` still calls the context's submit logic.

---

## `<FormField>` Changes

One new prop. All existing props and slot bindings unchanged. Internal registration gains `valueRef`.

**New prop:**

| Prop | Type | Description |
|---|---|---|
| `deps` | `string[]` | Field names whose changes trigger re-validation of this field |

```vue
<!-- Confirm password re-validates whenever password changes -->
<FormField
  name="confirmPassword"
  :rules="{ required: true, matches: 'password' }"
  :deps="['password']"
>
  <template #default="{ fieldProps }">
    <Input v-bind="fieldProps" label="Confirm password" type="password" />
  </template>
</FormField>
```

**Internal registration change:**
```ts
ctx?.registerField({
  name: props.name,
  valueRef: modelValue,    // NEW — the Ref itself, not a callback
  getValue: () => modelValue.value,
  // ... rest unchanged
})
```

**Deps watcher (internal):**
```ts
watch(
  () => props.deps,
  (deps) => {
    stopDepWatchers()
    if (!ctx || !deps?.length) return
    deps.forEach(dep => {
      const ref = ctx.getFieldRef(dep)
      if (ref) watchers.push(watch(ref, () => triggerValidation(modelValue.value)))
    })
  },
  { immediate: true }
)
```

---

## `defaultValues` Resolution

Priority (highest wins): field-level `defaultValue` prop > `useForm()` / `<Form>` `defaultValues[name]` > `undefined`

```ts
// In useField() / FormField — resolved on mount:
const resolvedDefault = computed(() =>
  props.defaultValue !== undefined
    ? props.defaultValue
    : ctx?.defaultValues[props.name]
)
```

`reset()` on the form resets every field to its resolved default. `isDirty` on each field compares `modelValue.value` against its resolved default.

---

## File Changes Summary

| File | Change |
|---|---|
| `form.context.ts` | Add `FormOptions`, extend `FieldRegistration` (`valueRef`), extend `FormContext` (`values`, `defaultValues`, `getFieldRef`) |
| `form.state.ts` | **New** — `createFormState(options): FormContext` (extracted from Form.vue) |
| `useForm.ts` | **New** — `useForm(options?): FormContext` |
| `useField.ts` | **New** — `useField(name, options?): FieldHandle` |
| `Form.vue` | Add `:form` + `:default-values` props, slot `values`, delegate to createFormState or accept external |
| `FormField.vue` | Add `deps` prop, register `valueRef`, add dep watchers |
| `form/index.ts` | Export `useForm`, `useField`, `FormOptions`, `FieldHandle` |
| `src/index.ts` | Re-export `useForm`, `useField` |

---

## What Is Not In Scope

- **Field arrays** (dynamic list of address fields, etc.) — separate design
- **Schema validation** (Zod / Yup integration) — `validate` function covers this via adapter
- **Multi-step / wizard forms** — separate design
- **`useField()` accepting an external field handle via prop on `<FormField>`** — not needed; `useField()` + `<FormField>` are parallel paths, not composed
