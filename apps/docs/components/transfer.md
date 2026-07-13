---
title: Transfer
---

<script setup>
import { ref } from 'vue';
import { Transfer } from '@auronui/vue';

const items = [
  { value: 'alice', label: 'Alice' },
  { value: 'bob', label: 'Bob' },
  { value: 'carol', label: 'Carol' },
  { value: 'dave', label: 'Dave' },
  { value: 'erin', label: 'Erin', isDisabled: true },
];
const selected = ref(['bob']);
</script>

# Transfer

Transfer moves items between two panels — an "available" source panel and a "selected" target panel — for use cases like permission assignment or building a multi-select list from a larger pool. It composes two [ListBox](/components/list-box) instances (`selection-mode="multiple"`) with move buttons between them.

State is derived, not duplicated: pass the full set of `items` plus a `v-model` array of the keys currently in the target panel. The source panel is computed automatically as `items` minus the model value, so consumers never keep two lists in sync by hand.

## Example

<div class="docs-example">
  <Transfer
    v-model="selected"
    :items="items"
    :titles="['Available', 'Selected']"
    is-searchable
  />
</div>

```vue
<script setup>
import { ref } from 'vue'
import { Transfer } from '@auronui/vue'

const items = [
  { value: 'alice', label: 'Alice' },
  { value: 'bob', label: 'Bob' },
  { value: 'carol', label: 'Carol' },
  { value: 'dave', label: 'Dave' },
  { value: 'erin', label: 'Erin', isDisabled: true },
]
const selected = ref(['bob'])
</script>

<template>
  <Transfer
    v-model="selected"
    :items="items"
    :titles="['Available', 'Selected']"
    is-searchable
  />
</template>
```

Checking one or more items in a panel (via the ListBox checkboxes) enables the adjacent move button (`›` / `‹`); the `»` / `«` buttons move every non-disabled item in one action. Dragging a single row and dropping it on the other panel is also supported as an additional way to move that one item, independent of checkbox state.

## Props

<PropsTable name="Transfer" />

## Slots

<SlotsTable name="Transfer" />

## Events

<EventsTable name="Transfer" />

## Accessibility

- **Primary interaction is keyboard-operable and always present.** Each panel is a `ListBox` (`role="listbox"` / `role="option"` items) with checkbox selection. Checking items with the keyboard or mouse and activating the move buttons (`›`, `«`, `»`, `‹`, each with a descriptive `aria-label` such as "Move selected to the right panel") is the primary way to move items — this path works with no mouse and no drag support required.
- **Drag-and-drop is supplementary, not required.** Dragging a row from one panel and dropping it on the other moves that single item, regardless of its checkbox state, but it is purely an additional affordance for mouse users layered on top of the button controls — nothing is only reachable by drag.
- **Panels are labeled.** Each `ListBox` receives an `aria-label` from the corresponding `titles` entry (falling back to "Available items" / "Selected items" when no title is provided), and each panel's optional `SearchField` gets a matching `aria-label` (e.g. "Search Available").
- **Disabled state is fully propagated.** Setting `isDisabled` on `Transfer` disables both `ListBox` instances, all four move buttons, and removes `draggable` from every item. Per-item `isDisabled` similarly prevents that single item from being checked, moved via "move all", or dragged.
- Verified with `@chialab/vitest-axe`: zero violations with titled panels, with search enabled, and while disabled (see `packages/vue/src/components/transfer/__tests__/Transfer.axe.test.ts`).
