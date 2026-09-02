---
title: FormControl
---

<script setup>
import { Form, FormControl, Checkbox, Switch, Input, NumberField } from '@auronui/vue';

const policy = {
  auth_factor: { force_mfa: true, allow_register: false },
  password: { min_length: 8 },
  privacy: { tos_link: 'https://example.com/tos' },
};
const minLengthRules = { required: 'Set a minimum length.', min: { value: 1, message: 'Must be at least 1.' } };
</script>

# FormControl

A bound field that renders its control for you. `FormControl` is `FormField`
plus the wiring — you name the field, name the control with `as`, and it
connects value, validation state, disabled state and blur between them.

Use it instead of hand-writing a wrapper component per input. That is not only
an ergonomics win: the obvious wrapper is subtly broken, and `FormControl`
exists to make it unnecessary. See [Why not a wrapper?](#why-not-a-wrapper).

## Example

Every control below is seeded from one nested `:default-values` object on the
`Form`. There are no per-field `default-value` props.

<div class="docs-example">
  <Form :default-values="policy" style="display: flex; flex-direction: column; gap: 14px; max-width: 420px;">
    <FormControl name="auth_factor.force_mfa" :as="Checkbox">
      Require multi-factor authentication
    </FormControl>
    <FormControl name="auth_factor.allow_register" :as="Switch" aria-label="Allow self-registration" />
    <FormControl
      name="password.min_length"
      :as="NumberField"
      label="Minimum length"
      variant="bordered"
      :min="1"
      :rules="minLengthRules"
    />
    <FormControl name="privacy.tos_link" :as="Input" label="Terms of service link" variant="bordered" />
  </Form>
</div>

```vue
<script setup>
import { Form, FormControl, Checkbox, Switch, Input, NumberField } from '@auronui/vue'

const policy = {
  auth_factor: { force_mfa: true, allow_register: false },
  password: { min_length: 8 },
  privacy: { tos_link: 'https://example.com/tos' },
}
</script>

<template>
  <Form :default-values="policy" @submit="onSave">
    <FormControl name="auth_factor.force_mfa" :as="Checkbox">
      Require multi-factor authentication
    </FormControl>
    <FormControl name="auth_factor.allow_register" :as="Switch" aria-label="Allow self-registration" />
    <FormControl
      name="password.min_length"
      :as="NumberField"
      label="Minimum length"
      :rules="{ required: 'Set a minimum length.' }"
    />
    <FormControl name="privacy.tos_link" :as="Input" label="Terms of service link" />
  </Form>
</template>
```

Field names are paths, so `password.min_length` reads and writes
`policy.password.min_length`. Flat names work exactly the same.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | **Required.** The field name. Dotted names are paths into the form's value shape. |
| `as` | `Component` | — | **Required.** The control to render. A component, not a string tag. |
| `defaultValue` | `unknown` | `undefined` | Field-level default. Wins over the form's `default-values` for this name. |
| `rules` | `FieldRules` | — | Validation rules, forwarded to `FormField`. |
| `validate` | `CustomValidator` | — | Custom validator, forwarded to `FormField`. |
| `validationMode` | `'on-submit' \| 'on-blur' \| 'on-change'` | inherits | Overrides the form's mode for this field. |
| `deps` | `string[]` | — | Field names whose changes re-validate this field. |

`v-model` is supported and behaves as it does on `FormField`.

Every other attribute — `label`, `variant`, `size`, `placeholder`, `aria-*` —
passes straight through to the control, as do all slots. So
`<FormControl :as="Checkbox">Require MFA</FormControl>` puts its content where
`Checkbox` expects it.

## What gets bound

`FormControl` inspects the control's declared props and binds only what it
finds. `modelValue`, its update handler, and the blur listener are always
bound; `name`, `isInvalid`, `isDisabled` and `errorMessage` are bound only when
the control declares them.

That filtering is load-bearing, not defensive padding. `Checkbox` and `Switch`
declare no `errorMessage` — binding it unconditionally would fall through to
`$attrs` and render a stray `errormessage` attribute in the DOM.

A per-control `is-disabled` and a form-level `<Form is-disabled>` are OR-ed, so
neither can defeat the other.

## Default value precedence

| `default-value` on the control | `Form :default-values[name]` | Field seeds to |
| --- | --- | --- |
| `true` | `false` | `true` — the control wins |
| `false` | `true` | `false` — the control wins |
| not passed | `true` | `true` — falls back to the form |
| not passed | not present | `undefined` |

`undefined` is the sentinel for "not provided", so `:default-value="undefined"`
means *defer to the form*, not *start empty*. To force an empty seed against a
form-level default, pass `null` — it is not `undefined`, so it wins normally.

A `v-model` value outranks both: if a value is already present when the field
mounts, no seeding happens.

## Why not a wrapper?

The natural thing to write instead of `FormControl` is a small per-input
wrapper:

```vue
<!-- FormCheckbox.vue — subtly broken -->
<script setup lang="ts">
defineProps<{ name: string; defaultValue?: boolean }>()
</script>

<template>
  <FormField :name="name" :default-value="defaultValue">
    <template #default="{ fieldProps }">
      <Checkbox v-bind="fieldProps"><slot /></Checkbox>
    </template>
  </FormField>
</template>
```

`defaultValue?: boolean` compiles to `{ type: Boolean, required: false }`, and
Vue casts an **absent** Boolean prop to `false` — not `undefined`. So the
wrapper forwards `:default-value="false"` on every render where its own author
passed nothing. `FormField` then applies its documented precedence correctly,
and the field-level `false` wins over the form-level default.

The result is a checkbox that never checks, and — worse — registers as `false`,
so saving the form writes `false` over whatever the server had. Only Boolean
props are affected: `number` and `string` props get no absent-cast, so numeric
and text fields in the same form seed correctly and only the booleans break.

`FormControl` declares its own `defaultValue` as `unknown`, which compiles to
`{ type: null }` and is never cast — and since you declare no props of your own,
there is nothing left to get wrong.

If you do hand-roll a wrapper, declare the prop with runtime syntax so an absent
value stays `undefined`:

```ts
const props = defineProps({
  name: { type: String, required: true },
  defaultValue: { type: Boolean, default: undefined },
})
```

The type-only form cannot express this. In development, `FormField` warns when
a field-level `false` shadows a truthy form-level default, since that is almost
always this bug rather than a deliberate override.

## Related

- [FormFieldArray](/components/form-field-array) — repeatable groups of fields.
