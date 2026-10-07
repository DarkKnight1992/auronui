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

## 1.11.0

Fixes for a sweep of real-app workarounds, a dependency security pass, and two
packaging defects. `@auronui/react` and `@auronui/styles` ship the matching
changes.

### Behaviour changes — check before upgrading

- **`Tabs` unmounts hidden panels by default.** `unmountOnHide` had no
  default, so Vue cast the absent Boolean to `false` and every panel stayed
  mounted (running its `setup()` and fetching its data). Pass
  `:unmount-on-hide="false"` to keep inactive panels mounted.
- **`Autocomplete` with `load-items` loads lazily** — on first open or when
  the user types — instead of on mount. It still loads on mount when a value
  is pre-selected (so its label can resolve). Set `load-on-mount` for the old
  behaviour.
- **`<Form @submit>` is awaited.** `isSubmitting` stays `true` until an async
  handler settles (it was cleared before the handler even ran). The handler is
  now a prop rather than an emitted event, so `emitted('submit')` in tests no
  longer sees it — call the handler or assert on its effects instead.
- **Dark-mode tokens are zero-specificity (`:where()`).** A plain
  `.dark { --surface: … }` now overrides them; overrides that previously lost
  to the theme's `(0,5,0)` selectors will start taking effect.
- **Dev warnings now actually appear in development.** They were gated on
  `import.meta.env.DEV`, which the library build replaced with `false`, so
  every warning was a no-op in the published package. They now use
  `process.env.NODE_ENV`, which your bundler replaces.

### Fixed

- **A dialog opened over another `Modal`/`AlertDialog` was invisible to screen
  readers.** The dialog's wrapper was inserted into `<body>` while closed, got
  `aria-hidden` from the outer dialog, and kept it. The wrapper now only exists
  while the dialog is open or animating out.
- **The published package broke Nuxt/Nitro production builds.** `dist/`
  contained copies of `motion-v`, `@tanstack/*`, `@iconify/vue` and parts of
  `@auronui/styles`, imported through relative pnpm-store paths. All
  dependencies are now external. Same fix in `@auronui/react`.
- `Select`: `aria-label`/`aria-labelledby` now name the combobox (they were
  dropped); a self-closing `<SelectTrigger />` shows the value/placeholder.
- `Form`: `<Form :form="handle" :default-values>` layers the prop over the
  handle's defaults instead of ignoring it; an inline array/object default
  (`:default-value="[]"`) no longer loops with "Maximum recursive updates", and
  arrays equal to their default are no longer reported dirty.
- `ColorPickerInput`/`ColorField`: `''` and `null` mean "no colour" — the field
  stays empty instead of throwing or showing `#000000`.
- `Checkbox`/`Switch`: label text is start-aligned (wrapped labels were
  centered).
- `class` props on all components accept object and array bindings
  (`:class="{ active: x }"` failed typecheck).

### Added

- `Table`: `v-model:sorting` and `manual-sorting` for server-side sorting.
- `Autocomplete`: `creatable` (+ `create-label`) adds a "Create …" option to
  the built-in chrome; fires `create`.
- `Checkbox`, `Switch`: `errorMessage`. `NumberField`: `description` and
  `errorMessage`. (Binding `errorMessage` previously leaked an `errormessage`
  attribute onto the DOM.)
- `Input`, `Textarea`, `SearchField`: template refs expose `focus()`, `blur()`
  and `el`.
- `SelectItemValue`/`SelectItemData` are exported from the package root.
- Dev warning for `<SelectItem value="">` (reka-ui reserves `""` for clearing).
- `Link`, `ToolbarLink`, `NavigationMenuLink`, `BreadcrumbItem` (and Sidebar /
  Breadcrumbs through them) drop `javascript:`/`vbscript:` URLs, with a dev
  warning. React 19 already blocks these itself.

### `@auronui/react`

- `Form` never set `isSubmitting` at all — it now goes through
  react-hook-form's `handleSubmit`.
- `Autocomplete` `creatable` crashed on the second keystroke; fixed. Also gains
  lazy `loadItems` + `loadOnMount` and `createLabel`.
- `Table` gains `sorting` / `onSortingChange` / `manualSorting`; Checkbox,
  Switch and NumberField gain the same `errorMessage`/`description` props;
  empty colour values are handled as above.

### Security

No published package had a vulnerable dependency. Development tooling was
upgraded (Vitest, Nuxt test app, Vite, Turbo, ESLint, VitePress' Vite) and the
publish workflow hardened (pinned actions and npm, tag-only publishing).
`@auronui/styles` no longer publishes its test files.
