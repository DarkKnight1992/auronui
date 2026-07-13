---
title: CommandPalette
---

<script setup>
import { ref } from 'vue';
import { CommandPalette, Button } from '@auronui/vue';

const isOpen = ref(false);
const commands = [
  { value: 'new-file', label: 'New File', shortcut: '⌘N', group: 'File' },
  { value: 'open-file', label: 'Open File', shortcut: '⌘O', group: 'File' },
  { value: 'save-file', label: 'Save File', shortcut: '⌘S', group: 'File' },
  { value: 'toggle-theme', label: 'Toggle Theme', group: 'View' },
  { value: 'toggle-sidebar', label: 'Toggle Sidebar', group: 'View' },
  { value: 'go-home', label: 'Go to Home' },
];
</script>

# CommandPalette

A `Cmd/Ctrl+K`-style overlay for fuzzy-searching and running commands — the pattern popularized by Linear, Vercel, Notion, and VS Code. It composes the existing `Modal` (backdrop, focus trap, Escape-to-close) with `ListBox`/`ListBoxSection`/`ListBoxItem` for the filtered, keyboard-navigable list. Unlike `ComboBox`, it isn't anchor-positioned — it's a centered full overlay, which is why it's built on `Modal` + `ListBox` rather than Reka's Combobox primitive.

Pass a flat array of commands via `items`; items with a matching `group` are rendered under a `ListBoxSection` heading, ungrouped items render at the top level. The palette opens either via a global keyboard shortcut (`shortcut` prop, defaults to `mod+k` — `mod` resolves to Cmd on Mac and Ctrl elsewhere) registered on `window` for the component's lifetime, or by driving the `open` model yourself (e.g. from a trigger button).

## Example

<div class="docs-example">
  <Button @click="isOpen = true">Open Command Palette (or press ⌘K / Ctrl+K)</Button>
  <CommandPalette v-model:open="isOpen" :items="commands" @select="(item) => console.log('selected', item.value)" />
</div>

```vue
<script setup>
import { ref } from 'vue'
import { CommandPalette, Button } from '@auronui/vue'

const isOpen = ref(false)
const commands = [
  { value: 'new-file', label: 'New File', shortcut: '⌘N', group: 'File' },
  { value: 'open-file', label: 'Open File', shortcut: '⌘O', group: 'File' },
  { value: 'save-file', label: 'Save File', shortcut: '⌘S', group: 'File' },
  { value: 'toggle-theme', label: 'Toggle Theme', group: 'View' },
  { value: 'toggle-sidebar', label: 'Toggle Sidebar', group: 'View' },
  { value: 'go-home', label: 'Go to Home' },
]
</script>

<template>
  <Button @click="isOpen = true">Open Command Palette (or press ⌘K / Ctrl+K)</Button>
  <CommandPalette
    v-model:open="isOpen"
    :items="commands"
    @select="(item) => console.log('selected', item.value)"
  />
</template>
```

Each item in `items` accepts `value`, `label`, and optionally `icon`, `shortcut`, `group`, `isDisabled`, and an `onSelect` callback invoked when the item is chosen (in addition to the `select` event).

## Props

<PropsTable name="CommandPalette" />

## Slots

<SlotsTable name="CommandPalette" />

## Events

<EventsTable name="CommandPalette" />

## Accessibility

- Built on `Modal`, so it inherits a proper dialog: a focus trap, Escape-to-close, and click-outside-to-close.
- The dialog's accessible name and description (`ModalTitle` "Command Palette" / `ModalDescription` "Search for a command or action, then select it") are provided but visually hidden via Reka UI's `VisuallyHidden`, so screen reader users get context without a redundant on-screen heading.
- Reka's `Dialog` focus trap would normally auto-focus the first focusable element inside the content — which is the first list item, not the search field. `CommandPalette` intercepts the `@open-auto-focus` event and redirects initial focus to the search input instead, so a user can open the palette and start typing immediately.
- The visible list is a real `ListBox` (`role="listbox"` with `role="option"` items), so it's marked up correctly for assistive tech, and clicking or activating an item with the mouse works through `ListBox`'s normal selection path.
- Keyboard navigation while typing is hand-bridged rather than delegated to `ListBox`: `ArrowDown`/`ArrowUp` in the search input move a virtual "active" item and `Enter` selects it, all without moving DOM focus off the search field. This is deliberate — feeding the active item through `ListBox`'s real `model-value` would cause Reka to move DOM focus to the matching list item as a side effect, which would silently swallow subsequent keystrokes typed into the search field.
- The global shortcut listener (`shortcut` prop, default `mod+k`) is registered on `window` in `onMounted` and removed in `onUnmounted`, so it doesn't leak across component instances.
- Verified with `vitest-axe`: zero violations both with a populated, grouped list and with the empty state visible.
