---
title: Menubar
---

<script setup>
import { ref } from 'vue';
import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem,
  MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem,
  MenubarSection, MenubarSub, MenubarSubTrigger, MenubarSubContent,
} from '@auronui/vue';

const showToolbar = ref(true);
const zoom = ref('100');
</script>

# Menubar

`Menubar` is an app-style top menu bar (File/Edit/View...), wrapping Reka UI's `Menubar`
primitive family. Each top-level menu is its own `MenubarMenu`, wrapping a `MenubarTrigger` +
`MenubarContent` pair; only one menu can be open at a time, with arrow-key navigation moving
between adjacent triggers. It shares its item/checkbox-item/radio-item/section styling
directly with `Dropdown`/`ContextMenu` — the differences are the horizontal trigger bar and
the single-open-menu-at-a-time behavior.

## Default

<div class="docs-example">
  <Menubar>
    <MenubarMenu value="file">
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent aria-label="File menu">
        <MenubarItem>New File</MenubarItem>
        <MenubarItem>Open...</MenubarItem>
        <MenubarItem>Save</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu value="edit">
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent aria-label="Edit menu">
        <MenubarItem>Cut</MenubarItem>
        <MenubarItem>Copy</MenubarItem>
        <MenubarItem>Paste</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu value="view">
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent aria-label="View menu">
        <MenubarItem>Zoom In</MenubarItem>
        <MenubarItem>Zoom Out</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</div>

```vue-html
<Menubar>
  <MenubarMenu value="file">
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent aria-label="File menu">
      <MenubarItem>New File</MenubarItem>
      <MenubarItem>Open...</MenubarItem>
      <MenubarItem>Save</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu value="edit">
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent aria-label="Edit menu">
      <MenubarItem>Cut</MenubarItem>
      <MenubarItem>Copy</MenubarItem>
      <MenubarItem>Paste</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu value="view">
    <MenubarTrigger>View</MenubarTrigger>
    <MenubarContent aria-label="View menu">
      <MenubarItem>Zoom In</MenubarItem>
      <MenubarItem>Zoom Out</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

## Sections

<div class="docs-example">
  <Menubar>
    <MenubarMenu value="file">
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent aria-label="File menu">
        <MenubarSection title="Recent">
          <MenubarItem>report.pdf</MenubarItem>
          <MenubarItem>notes.txt</MenubarItem>
        </MenubarSection>
        <MenubarSection title="Actions" show-divider="true">
          <MenubarItem>New</MenubarItem>
          <MenubarItem variant="danger">Delete</MenubarItem>
        </MenubarSection>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</div>

```vue-html
<MenubarContent aria-label="File menu">
  <MenubarSection title="Recent">
    <MenubarItem>report.pdf</MenubarItem>
    <MenubarItem>notes.txt</MenubarItem>
  </MenubarSection>
  <MenubarSection title="Actions" :show-divider="true">
    <MenubarItem>New</MenubarItem>
    <MenubarItem variant="danger">Delete</MenubarItem>
  </MenubarSection>
</MenubarContent>
```

## Checkbox and radio items

<div class="docs-example">
  <Menubar>
    <MenubarMenu value="view">
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent aria-label="View menu">
        <MenubarSection title="Panels">
          <MenubarCheckboxItem v-model:is-selected="showToolbar">Show Toolbar</MenubarCheckboxItem>
        </MenubarSection>
        <MenubarSection title="Zoom">
          <MenubarRadioGroup v-model="zoom">
            <MenubarRadioItem value="100">100%</MenubarRadioItem>
            <MenubarRadioItem value="150">150%</MenubarRadioItem>
            <MenubarRadioItem value="200">200%</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarSection>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</div>

```vue-html
<MenubarContent aria-label="View menu">
  <MenubarSection title="Panels">
    <MenubarCheckboxItem v-model:is-selected="showToolbar">Show Toolbar</MenubarCheckboxItem>
  </MenubarSection>
  <MenubarSection title="Zoom">
    <MenubarRadioGroup v-model="zoom">
      <MenubarRadioItem value="100">100%</MenubarRadioItem>
      <MenubarRadioItem value="150">150%</MenubarRadioItem>
      <MenubarRadioItem value="200">200%</MenubarRadioItem>
    </MenubarRadioGroup>
  </MenubarSection>
</MenubarContent>
```

## Nested submenus

<div class="docs-example">
  <Menubar>
    <MenubarMenu value="file">
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent aria-label="File menu">
        <MenubarItem>New</MenubarItem>
        <MenubarSub>
          <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem>report.pdf</MenubarItem>
            <MenubarItem>notes.txt</MenubarItem>
            <MenubarItem>budget.xlsx</MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</div>

```vue-html
<MenubarContent aria-label="File menu">
  <MenubarItem>New</MenubarItem>
  <MenubarSub>
    <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
    <MenubarSubContent>
      <MenubarItem>report.pdf</MenubarItem>
      <MenubarItem>notes.txt</MenubarItem>
      <MenubarItem>budget.xlsx</MenubarItem>
    </MenubarSubContent>
  </MenubarSub>
</MenubarContent>
```

## Props

<PropsTable name="Menubar" />

## Slots

<SlotsTable name="Menubar" />

## Events

<EventsTable name="Menubar" />

## Accessibility

`Menubar` is built on Reka UI's `Menubar` primitive family.

- **Role.** The bar renders `role="menubar"`; each trigger renders `role="menuitem"` with
  `aria-haspopup`; open content renders `role="menu"`, with items as `role="menuitem"`,
  `role="menuitemcheckbox"`, or `role="menuitemradio"` depending on type.
- **Keyboard.** `ArrowLeft`/`ArrowRight` move focus between top-level triggers (looping if
  `loop` is set). `ArrowDown`/`Enter`/`Space` opens the focused menu. Within an open menu,
  `ArrowUp`/`ArrowDown` move between items, `ArrowRight` on a `MenubarSubTrigger` opens its
  submenu, `Escape` closes the current menu and returns focus to its trigger.
- **Single-open behavior.** Only one top-level menu can be open at a time — moving focus to
  an adjacent trigger while a menu is open closes the current one and opens the new one
  (matching native OS menu bar behavior), tracked via the Root's string `modelValue`.
- **Focus management.** Opening a menu moves focus into it; closing returns focus to its
  trigger.
