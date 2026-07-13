---
title: Cascader
---

<script setup>
import { ref } from 'vue';
import { Cascader } from '@auronui/vue';

const location = ref([]);

const items = [
  {
    value: 'ca',
    label: 'California',
    children: [
      { value: 'sf', label: 'San Francisco' },
      { value: 'la', label: 'Los Angeles' },
    ],
  },
  {
    value: 'ny',
    label: 'New York',
    children: [
      { value: 'nyc', label: 'New York City' },
      { value: 'buf', label: 'Buffalo' },
    ],
  },
  { value: 'tx', label: 'Texas' },
];
</script>

# Cascader

A cascading, multi-column selector for hierarchical data — pick a value at one level to reveal the next level's column, one level per column, up to a full root-to-leaf path (e.g. region &rarr; city). It reuses `Tree`'s recursive data shape (`items` + `getKey` + `getChildren`), since a cascader's input data is a tree; the difference is purely presentational (side-by-side columns with one selected path, instead of Tree's expand/collapse-many outline).

It's built on `Popover` (anchoring the columns panel to the trigger button, the same pattern `Select` uses for its trigger+content) with plain buttons per column rather than `ListBox`, since each column is single-select and needs Left/Right cross-column keyboard navigation that doesn't map onto `ListBox`'s roving-focus model. The trigger is a field-styled box, like `Input`, and supports the standard `variant` (flat/bordered/faded/underlined/raised) and `color` (default/primary/secondary/accent/success/warning/danger) props, plus `label`/`description`/`errorMessage`/`isInvalid`/`isDisabled`/`isRequired`.

## Example

<div class="docs-example">
  <Cascader v-model="location" :items="items" :get-key="(i) => i.value" label="Location" placeholder="Select a location" />
</div>

## Props

<PropsTable name="Cascader" />

## Slots

<SlotsTable name="Cascader" />

## Events

<EventsTable name="Cascader" />

## Accessibility

- Built on `Popover`: the trigger is a `<button>` that opens/closes a `PopoverContent` panel containing the columns, so it inherits Popover's focus-trap-free, dismissible-overlay behavior (click outside or `Escape` to close) and `[data-state="open"]` styling on the trigger.
- Within the open panel, each column is a `role="group"` containing one button per item (`data-slot="cascader-item"`). Keyboard navigation mirrors `Tree`'s Left/Right semantics adapted to side-by-side columns:
  - `ArrowDown` / `ArrowUp` move focus between items within the current column.
  - `ArrowRight` on an item with children selects it and moves focus into the newly revealed child column.
  - `ArrowLeft` moves focus back to the parent column, refocusing its currently active item.
  - `Enter` / `Space` select the focused item — committing the full path and closing the panel if it's a leaf, or revealing the next column if it has children.
- Selecting a leaf item (no children) commits the whole path to `v-model` and closes the panel automatically; selecting a non-leaf item updates the path and keeps the panel open, moving focus into the new column.
- The trigger carries `aria-invalid` when `isInvalid` is true and `aria-describedby` pointing at the rendered `description`/`errorMessage`, wired automatically via the shared form-field composable (no manual `id` management needed) — the same contract `Input`/`InputGroup` use.
- Since the trigger is a single `<button>` (not a wrapper around a native input), its focus styling is keyed off `:focus-visible` and `[data-state="open"]` rather than `:focus-within`.
- `isDisabled` disables the trigger `<button>` outright, preventing the panel from opening.
- Verified with `@chialab/vitest-axe`: zero violations when closed with a label, with an initial `modelValue`, with the panel open across multiple columns, when `isInvalid` with an `errorMessage`, and when `isDisabled` (`Cascader.axe.test.ts`).
