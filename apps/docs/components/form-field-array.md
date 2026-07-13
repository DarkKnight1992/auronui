---
title: FormFieldArray
---

<script setup>
import { Form, FormFieldArray, FormField, Input } from '@auronui/vue';

const initialContacts = [{ name: 'Jane Doe', email: 'jane@example.com' }];
const contactsArrayRules = { required: true, minLength: 1, maxLength: 4 };
const nameRules = { required: true };
const emailRules = { required: true, email: true };
</script>

# FormFieldArray

Repeatable groups of fields inside a `<Form>` — add, remove, insert, and
reorder rows, with each row's cells getting the same validation/error/dirty
contract as any other `FormField`. Built for "add another contact", "add a
line item" style forms, where a row can be a single value or several related
fields.

Pairs with the headless `useFieldArray()` composable the same way `FormField`
pairs with `useField()` — `FormFieldArray` is the documented, slot-based way
most consumers use it.

## Example

<div class="docs-example">
  <Form style="display: flex; flex-direction: column; gap: 16px; max-width: 480px;">
    <FormFieldArray
      name="contacts"
      :default-value="initialContacts"
      :rules="contactsArrayRules"
      v-slot="{ fields, fieldName, append, remove, error }"
    >
      <div v-for="row in fields" :key="row.id" style="display: flex; gap: 8px; align-items: flex-start;">
        <FormField :name="fieldName(row.id, 'name')" :default-value="row.defaultValue.name" :rules="nameRules">
          <template #default="{ fieldProps }">
            <Input v-bind="fieldProps" label="Name" />
          </template>
        </FormField>
        <FormField :name="fieldName(row.id, 'email')" :default-value="row.defaultValue.email" :rules="emailRules">
          <template #default="{ fieldProps }">
            <Input v-bind="fieldProps" label="Email" />
          </template>
        </FormField>
        <button type="button" @click="remove(row.id)">Remove</button>
      </div>
      <p v-if="error">{{ error }}</p>
      <button type="button" @click="append({ name: '', email: '' })">Add contact</button>
    </FormFieldArray>
  </Form>
</div>

```vue
<script setup>
import { Form, FormFieldArray, FormField, Input } from '@auronui/vue'

const initialContacts = [{ name: 'Jane Doe', email: 'jane@example.com' }]

function handleSubmit({ values }) {
  console.log(values.contacts) // [{ name, email }, ...]
}
</script>

<template>
  <Form @submit="handleSubmit">
    <FormFieldArray
      name="contacts"
      :default-value="initialContacts"
      :rules="{ required: true, minLength: 1, maxLength: 4 }"
      v-slot="{ fields, fieldName, append, remove, error }"
    >
      <div v-for="row in fields" :key="row.id">
        <FormField :name="fieldName(row.id, 'name')" :default-value="row.defaultValue.name" :rules="{ required: true }">
          <template #default="{ fieldProps }">
            <Input v-bind="fieldProps" label="Name" />
          </template>
        </FormField>
        <FormField :name="fieldName(row.id, 'email')" :default-value="row.defaultValue.email" :rules="{ required: true, email: true }">
          <template #default="{ fieldProps }">
            <Input v-bind="fieldProps" label="Email" />
          </template>
        </FormField>
        <button type="button" @click="remove(row.id)">Remove</button>
      </div>
      <p v-if="error">{{ error }}</p>
      <button type="button" @click="append({ name: '', email: '' })">Add contact</button>
    </FormFieldArray>
    <button type="submit">Save</button>
  </Form>
</template>
```

`handleSubmit` receives `values.contacts` as a clean nested array —
`[{ name, email }, ...]` — correctly ordered even after rows were removed or
reordered. The internal row `id` used to build `fieldName(row.id, 'name')`
never leaks into the payload; it only ever lives in the field's dotted path.

## Usage notes

- **Row identity, not display position.** Each row gets a permanent id
  (`contacts-row-0`, `contacts-row-1`, ...) the moment it's created. Always
  `:key="row.id"` in your `v-for` and always build field names via
  `fieldName(row.id, 'email')` — never use `row.index` for either. `index` is
  display-only (e.g. a "Row N" label using `row.index + 1`); it shifts on
  reorder, `id` never does.
- **No external `v-model` per cell.** Rows are created dynamically, so
  there's no ref to pre-declare per field. Bind each row's `FormField` to
  `:default-value="row.defaultValue.<key>"` instead — `FormField` already
  supports running with no external `v-model`, tracking its value internally
  and surfacing it through `form.getValues()`.
- **Array-level rules validate row count, not row content.** `rules` on
  `FormFieldArray` (`required`, `minLength`, `maxLength`, `min`, `max`) are
  evaluated against the array of rows itself — `required: true` means "at
  least one row", `maxLength: 4` means "at most four rows". Per-row field
  validation (`rules` on each nested `FormField`) is independent and runs
  exactly like any other field.

## Slot props

| Prop | Type | Description |
|---|---|---|
| `fields` | `{ id, index, defaultValue }[]` | The rows to `v-for` over. |
| `fieldName(id, key)` | `(id: string, key: string) => string` | Builds a nested field's dotted name, e.g. `contacts.contacts-row-0.email`. |
| `append(value?)` | `(value?: object) => void` | Add a row at the end. |
| `prepend(value?)` | `(value?: object) => void` | Add a row at the start. |
| `insert(index, value?)` | `(index: number, value?: object) => void` | Add a row at a specific position. |
| `remove(id)` | `(id: string) => void` | Remove a row by id. |
| `move(fromIndex, toIndex)` | `(fromIndex: number, toIndex: number) => void` | Move a row to a new position. |
| `swap(indexA, indexB)` | `(indexA: number, indexB: number) => void` | Swap two rows' positions. |
| `replace(values)` | `(values: object[]) => void` | Replace all rows wholesale (e.g. after loading server data). |
| `error` | `string \| undefined` | The array-level validation error, if any. |

## Props

<PropsTable name="FormFieldArray" />

## Slots

<SlotsTable name="FormFieldArray" />

## Events

<EventsTable name="FormFieldArray" />

## Accessibility

- Row-level field errors flow through the exact same mechanism every flat
  `FormField` already uses — each row's inputs get `aria-invalid` and
  `aria-describedby` wired to their error message automatically, no extra
  work needed.
- The array-level `error` is plain text in the slot — wrap it in an element
  with `role="alert"` (or a live region) if you want it announced
  immediately, the same way you would for any other Form-level error message.
- Give each row's remove control a distinguishing accessible name — e.g.
  `:aria-label="'Remove contact ' + (row.index + 1)"` — rather than a bare
  "Remove" repeated on every row, so screen reader users can tell rows apart.
- Reordering rows (`move`/`swap`) preserves the underlying DOM node for each
  row (id-keyed `v-for`, not index-keyed), so a row's own focus-visible state
  and any in-progress input aren't destroyed by a reorder — though moving a
  focused element in the DOM can still blur it, a browser/DOM mechanic this
  component can't and doesn't try to override.
