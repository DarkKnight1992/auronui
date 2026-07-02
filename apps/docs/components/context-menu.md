---
title: ContextMenu
---

<script setup>
import { ref } from 'vue';
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
  ContextMenuCheckboxItem, ContextMenuRadioGroup, ContextMenuRadioItem,
  ContextMenuSection, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent,
} from '@auronui/vue';

const showHidden = ref(false);
const sortBy = ref('name');
</script>

# ContextMenu

`ContextMenu` is a right-click menu, wrapping Reka UI's `ContextMenu` primitive family. It
shares its item/checkbox-item/radio-item/section styling directly with `Dropdown` — the only
real difference is how the menu opens (right-click, positioned at the pointer) rather than how
it's rendered once open.

## Default

<div class="docs-example">
  <ContextMenu>
    <ContextMenuTrigger as-child>
      <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 120px; border: 2px dashed var(--vp-c-divider); border-radius: 8px; font-size: 13px; color: var(--vp-c-text-2);">
        Right-click here
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent aria-label="Actions">
      <ContextMenuItem>Cut</ContextMenuItem>
      <ContextMenuItem>Copy</ContextMenuItem>
      <ContextMenuItem>Paste</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</div>

```vue-html
<ContextMenu>
  <ContextMenuTrigger as-child>
    <div>Right-click here</div>
  </ContextMenuTrigger>
  <ContextMenuContent aria-label="Actions">
    <ContextMenuItem>Cut</ContextMenuItem>
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuItem>Paste</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

## Sections

<div class="docs-example">
  <ContextMenu>
    <ContextMenuTrigger as-child>
      <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 120px; border: 2px dashed var(--vp-c-divider); border-radius: 8px; font-size: 13px; color: var(--vp-c-text-2);">
        Right-click here
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent aria-label="File actions">
      <ContextMenuSection title="File">
        <ContextMenuItem>New</ContextMenuItem>
        <ContextMenuItem>Open</ContextMenuItem>
      </ContextMenuSection>
      <ContextMenuSection title="Edit" show-divider="true">
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem variant="danger">Delete</ContextMenuItem>
      </ContextMenuSection>
    </ContextMenuContent>
  </ContextMenu>
</div>

```vue-html
<ContextMenuContent aria-label="File actions">
  <ContextMenuSection title="File">
    <ContextMenuItem>New</ContextMenuItem>
    <ContextMenuItem>Open</ContextMenuItem>
  </ContextMenuSection>
  <ContextMenuSection title="Edit" :show-divider="true">
    <ContextMenuItem>Rename</ContextMenuItem>
    <ContextMenuItem variant="danger">Delete</ContextMenuItem>
  </ContextMenuSection>
</ContextMenuContent>
```

## Checkbox and radio items

<div class="docs-example">
  <ContextMenu>
    <ContextMenuTrigger as-child>
      <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 120px; border: 2px dashed var(--vp-c-divider); border-radius: 8px; font-size: 13px; color: var(--vp-c-text-2);">
        Right-click here
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent aria-label="View options">
      <ContextMenuSection title="View">
        <ContextMenuCheckboxItem v-model:is-selected="showHidden">Show hidden files</ContextMenuCheckboxItem>
      </ContextMenuSection>
      <ContextMenuSection title="Sort by">
        <ContextMenuRadioGroup v-model="sortBy">
          <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
          <ContextMenuRadioItem value="date">Date modified</ContextMenuRadioItem>
          <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuSection>
    </ContextMenuContent>
  </ContextMenu>
</div>

```vue-html
<ContextMenuContent aria-label="View options">
  <ContextMenuSection title="View">
    <ContextMenuCheckboxItem v-model:is-selected="showHidden">Show hidden files</ContextMenuCheckboxItem>
  </ContextMenuSection>
  <ContextMenuSection title="Sort by">
    <ContextMenuRadioGroup v-model="sortBy">
      <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
      <ContextMenuRadioItem value="date">Date modified</ContextMenuRadioItem>
      <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
    </ContextMenuRadioGroup>
  </ContextMenuSection>
</ContextMenuContent>
```

## Nested submenus

<div class="docs-example">
  <ContextMenu>
    <ContextMenuTrigger as-child>
      <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 120px; border: 2px dashed var(--vp-c-divider); border-radius: 8px; font-size: 13px; color: var(--vp-c-text-2);">
        Right-click here
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent aria-label="Share menu">
      <ContextMenuItem>Copy link</ContextMenuItem>
      <ContextMenuSub>
        <ContextMenuSubTrigger>Share via</ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuItem>Email</ContextMenuItem>
          <ContextMenuItem>Messages</ContextMenuItem>
          <ContextMenuItem>Slack</ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
    </ContextMenuContent>
  </ContextMenu>
</div>

```vue-html
<ContextMenuContent aria-label="Share menu">
  <ContextMenuItem>Copy link</ContextMenuItem>
  <ContextMenuSub>
    <ContextMenuSubTrigger>Share via</ContextMenuSubTrigger>
    <ContextMenuSubContent>
      <ContextMenuItem>Email</ContextMenuItem>
      <ContextMenuItem>Messages</ContextMenuItem>
      <ContextMenuItem>Slack</ContextMenuItem>
    </ContextMenuSubContent>
  </ContextMenuSub>
</ContextMenuContent>
```

## Props

<PropsTable name="ContextMenu" />

## Slots

<SlotsTable name="ContextMenu" />

## Events

<EventsTable name="ContextMenu" />

## Accessibility

`ContextMenu` is built on Reka UI's `ContextMenu` primitive family.

- **Role.** The open menu renders `role="menu"`; items render `role="menuitem"`,
  `role="menuitemcheckbox"`, or `role="menuitemradio"` depending on type.
- **Keyboard.** Arrow keys move focus between items; `Enter`/`Space` activates the focused
  item. `Escape` closes the menu. `ArrowRight` on a `ContextMenuSubTrigger` opens its submenu;
  `ArrowLeft` closes it and returns focus to the parent trigger.
- **Trigger activation.** The trigger opens on right-click (`contextmenu` event) by default,
  and on long-press for touch devices (`pressOpenDelay`, default 700ms). Setting `disabled` on
  `ContextMenuTrigger` restores the native browser context menu entirely.
- **Focus management.** Opening the menu moves focus into it; closing returns focus to the
  element that was focused before the menu opened (not necessarily the trigger, since a
  right-click doesn't require prior focus).
