---
title: SearchField
---

<script setup>
import { ref } from 'vue';
import { SearchField } from '@auronui/vue';

const query = ref('');
</script>

# SearchField

`SearchField` is a dedicated search/filter input. It mirrors `Input`'s anatomy, prop surface,
and accessibility contract exactly — down to reusing `Input`'s `.input`/`.input__*` CSS
wholesale — but specializes it for search: `type="search"` is fixed (not a prop), a built-in
magnifying-glass icon fills `startContent` by default, and a clear (×) button is on by default
and also responds to `Escape`.

## Example

<div class="docs-example">
  <SearchField v-model="query" label="Search" placeholder="Search components…" />
</div>

```vue-html
<script setup>
import { ref } from 'vue';
import { SearchField } from '@auronui/vue';

const query = ref('');
</script>

<template>
  <SearchField v-model="query" label="Search" placeholder="Search components…" />
</template>
```

## Props

<PropsTable name="SearchField" />

## Slots

<SlotsTable name="SearchField" />

## Events

<EventsTable name="SearchField" />

## Accessibility

- **Search icon.** The default `startContent` is a decorative magnifying-glass `<svg>` marked
  `aria-hidden="true"` — it carries no accessible name and is never announced. Overriding the
  `startContent` slot with custom content (e.g. a different icon) is the caller's
  responsibility to keep decorative unless it conveys meaning.
- **Clear button.** Rendered only once the field has a value (and `isClearable`, the default,
  is `true`) and the field is interactive (not disabled or read-only). It has a fixed
  `aria-label="Clear search"` and `tabindex="-1"`, so it is reachable by pointer/click but is
  deliberately excluded from the tab sequence — clearing is expected via the button click or
  the `Escape` key, not by tabbing to it.
- **Escape-to-clear.** Pressing `Escape` while the input is focused and the field is filled
  clears the value, emits `clear`, and stops event propagation. Escape is a no-op when the
  field is already empty.
- **Label.** Passing `label` renders a `<label>` wired to the input via a generated (or
  caller-supplied) `id`/`for` pair (`useId`), matching `Input`'s inside/outside
  `labelPlacement` behavior.
- **Invalid/disabled/read-only/required state.** `isInvalid` sets `data-invalid` on the root
  wrapper and `aria-invalid` on the input; `isDisabled` sets `data-disabled` and the native
  `disabled` attribute; `isReadOnly` sets `data-readonly` and the native `readonly` attribute;
  `isRequired` sets `data-required` and the native `required` attribute. Disabled and read-only
  states also suppress the clear button.
- **Helper text.** `description` and `errorMessage` (shown instead of `description` when
  `isInvalid` is true) are wired to the input via `aria-describedby`, so assistive technology
  announces them alongside the field.
