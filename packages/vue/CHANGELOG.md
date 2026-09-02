# @auronui/vue Changelog

## Unreleased

### Deprecated (non-breaking)

Boolean props are being standardized to the `isX` convention to match
HeroUI React's public API (Auron's stated parity target). Old prop names
continue to work identically and are not removed — using them logs a
dev-only console warning suggesting the replacement.

- `disabled` → `isDisabled` (all components except the menu-item family,
  where `isDisabled` already existed and now correctly takes precedence
  over `disabled`)
- `required` → `isRequired` (all components except the date/time field
  family, where `required` and `isRequired` remain distinct: `required`
  controls native HTML form validation, `isRequired` controls the visual
  asterisk and `aria-required`)
- `readonly` → `isReadOnly`
- `isReadonly` (lowercase "o", a casing bug) → `isReadOnly`

### Not migrated (intentional exclusions)

A few components were found, during this migration, to have a `disabled`-
or `required`-shaped prop that isn't actually a naming duplicate of an
`isX` counterpart. These were deliberately left untouched rather than
forced into the rename:

- `AlertDialogContent`, `AutocompleteContent`, `DrawerContent`,
  `ModalContent` — their `disabled` prop controls Reka UI's `<Teleport
  disabled>` behavior ("render inline instead of portaling"), unrelated to
  component interactivity. Not renamed.
- `ListBoxItem` — its `disabled` and `isDisabled` props are not synonyms
  today: `isDisabled` merges with the parent `ListBox`'s group state via
  OR, while `disabled` fully bypasses group state as a higher-precedence
  override. Left untouched pending a separate design decision on whether
  that's intentional.
- The date/time field family (`DateInput`, `DatePicker`, `DatePickerOnly`,
  `DateRangeField`, `DateRangePicker`, `DateTimePicker`, `TimeField`,
  `TimeRangeField`) — see `required`/`isRequired` above.

### Known gaps

- `NumberField`'s `isRequired`/`required` props currently have no
  observable effect (no template site consumes them yet) — this predates
  the migration and is unchanged by it, just now exposed under both prop
  names.

## 1.10.4

### Fixed

- **`Form` now applies `defaultValues` that arrive after mount.** The context
  snapshotted the object once at creation, so defaults fetched from an API
  never reached the fields — the form rendered empty. `defaultValues` is now
  read through reactively, and a field adopts a newly-arrived default as long
  as it still holds what the previous default gave it. A value the user typed,
  or one a parent supplied via `v-model`, always wins.
- **Dotted field names resolve against nested `defaultValues`.** A field named
  `auth_factor.force_mfa` looked up that literal key and found nothing in
  `{ auth_factor: { force_mfa: true } }`. Names are now paths, at any depth,
  through objects and arrays alike. A literal dotted key still takes
  precedence, so flat default maps keep working unchanged.
- **Cross-field rules and custom validators now see one consistent value
  shape.** `context.values` was nested on change/blur but flat on submit, so a
  `matches` rule or `validate` function written against one shape silently
  broke under the other. It is now the nested shape — the same one
  `getValues()` returns — on every trigger.

### Added

- `getValues(name)` reads a single field or a whole subtree by path
  (`getValues('password.min_length')`, `getValues('password')`).
- `setValue(name, value)` accepts a subtree and fans it out to the fields it
  covers: `setValue('auth_factor', { force_mfa: true })` reaches
  `auth_factor.force_mfa`. Field-array rows are still added and removed
  through `append`/`remove`/etc., not `setValue`.
- `ValidationContext.getFieldValue(name)` — reads a sibling by its registered
  name inside a rule or custom validator. Prefer it over indexing
  `context.values`: it also resolves field-array row names, which are not
  paths in the public value shape.
- `getPath` / `setPath` are exported from the package root.

### Notes

- `errors` remains keyed by literal field name. It is a lookup by field
  identity rather than a value shape, and every field reads its own error by
  its own name.

## 1.10.5

### Added

- **`FormControl`** — a bound field that renders its own control:
  `<FormControl name="auth_factor.force_mfa" :as="Checkbox">Require MFA</FormControl>`.
  It forwards every `FormField` prop, passes all other attributes and slots
  through to the control, and binds only the props the control actually
  declares, so nothing stray reaches the DOM.

  Reach for it instead of writing a wrapper component per input. The obvious
  wrapper is subtly broken: declaring `defaultValue?: boolean` makes Vue cast
  the *absent* prop to `false` rather than `undefined`, which then beats the
  form's `default-values` for that field — so the control renders unset and,
  worse, submits `false` over whatever the server had. Only Boolean props are
  affected, which is why numeric and text fields in the same form look fine.
  `FormControl` declares `defaultValue` as `unknown`, which Vue never casts.

  If you keep a hand-written wrapper, declare the prop with runtime syntax so
  an absent value stays `undefined` — the type-only form cannot express it:

  ```ts
  defineProps({ defaultValue: { type: Boolean, default: undefined } })
  ```

- A dev-only warning from `FormField` when a field-level `defaultValue` of
  `false` shadows a truthy form-level default, since that is nearly always the
  cast above rather than a deliberate override.

### Known issues

- Controls that render reka-ui's visually-hidden native input — `Checkbox`,
  `NumberField` and others — produce axe `label` (and, for `Checkbox`,
  `nested-interactive`) violations when a `name` is bound inside a `<form>`.
  This is pre-existing and unrelated to `FormControl`: the hand-written
  `FormField` binding pattern produces the identical result. It is tracked by a
  parity assertion in the test suite.
