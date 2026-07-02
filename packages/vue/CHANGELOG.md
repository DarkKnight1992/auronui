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
