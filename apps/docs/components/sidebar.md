---
title: Sidebar
---

<script setup>
import { Sidebar } from '@auronui/vue';

const sections = [
  {
    label: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/intro', icon: 'lucide:book' },
      { label: 'Installation', href: '/install' },
    ],
  },
  {
    label: 'Components',
    items: [
      { label: 'Button', href: '/components/button', badge: 'New' },
      {
        label: 'Forms',
        items: [
          { label: 'Input', href: '/components/input' },
          { label: 'Select', href: '/components/select' },
        ],
      },
    ],
  },
];
</script>

# Sidebar

`Sidebar` renders grouped vertical navigation: labeled sections of links, optional nested
sub-links with a collapse toggle, an optional sticky search box that filters by label, and
active-link highlighting. Active-link detection is automatic — a dependency-free
`useLocationPath` composable patches `history.pushState`/`replaceState` to track
`window.location.pathname` reactively, so the currently active link stays correct across SPA
navigations without wiring up a specific router. Pass `activeHref` to override auto-detection
with a controlled value instead.

`Sidebar` supports two usage modes: a data-driven `sections` prop (shown below), or a compound
mode using `SidebarSection` / `SidebarItem` directly in the default slot for full control over
markup.

## Example

<div class="docs-example">
  <Sidebar :sections="sections" search ariaLabel="Docs navigation" />
</div>

```vue-html
<script setup>
import { Sidebar } from '@auronui/vue';

const sections = [
  {
    label: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/intro', icon: 'lucide:book' },
      { label: 'Installation', href: '/install' },
    ],
  },
  {
    label: 'Components',
    items: [
      { label: 'Button', href: '/components/button', badge: 'New' },
      {
        label: 'Forms',
        items: [
          { label: 'Input', href: '/components/input' },
          { label: 'Select', href: '/components/select' },
        ],
      },
    ],
  },
];
</script>

<template>
  <Sidebar :sections="sections" search ariaLabel="Docs navigation" />
</template>
```

## Props

<PropsTable name="Sidebar" />

## Slots

<SlotsTable name="Sidebar" />

## Events

<EventsTable name="Sidebar" />

## Accessibility

`Sidebar` is built entirely from plain semantic elements (`<nav>`, `<a>`/`<Link>`, `<button>`)
plus the `useLocationPath` composable — it does not wrap a Reka UI primitive.

- **Landmark.** The root renders `<nav :aria-label="ariaLabel">` (default `"Sidebar"`), giving
  assistive tech a single named navigation landmark.
- **Active link.** The current link gets `aria-current="page"`, driven by the `activeHref` prop
  when set, otherwise by the auto-detected `window.location.pathname`.
- **Links vs. toggle buttons.** An item with an `href` renders as a `<Link>` (an `<a>`, or a
  custom `as` component for SPA routers). An item with `items` but no `href` renders as a
  `<button type="button">` — a non-interactive parent-only row is never a `<Link>` with no
  `href`, so it stays keyboard-focusable and activatable with `Enter`/`Space`. When an item has
  *both* `href` and nested `items`, the expand/collapse toggle is a separate sibling
  `<button aria-label="Toggle {label}">` next to the link, rather than nested inside it — a
  `<button>` inside an `<a>` would be invalid, inaccessible interactive-in-interactive markup.
- **Expand/collapse state.** Every toggle button carries `aria-expanded`, reflecting whether its
  children are currently shown. Children are expanded by default; the user's explicit toggle
  choice persists afterward, including for the branch containing the active link. Typing into
  the search box temporarily forces all matching branches open again to surface results,
  without touching the user's manual state.
- **Search.** When `search` is enabled, `SidebarSearch` renders an `<Input type="search">` with
  `aria-label="Search sidebar links"`. Filtering is case-insensitive by label; a section is
  hidden entirely when none of its items match, and a matching descendant keeps its whole
  branch (parent + all children) visible rather than pruning to just the match. A "No results
  found" `EmptyState` message is shown when nothing matches.
- **Keyboard.** All interaction uses native, focusable elements (`<a>`/`<button>`) — `Tab`/
  `Shift+Tab` moves between links, section toggles, and the search input in DOM order, and
  `Enter`/`Space` activates whichever is focused. There is no custom roving-tabindex or
  arrow-key navigation; the sidebar relies entirely on native focus order and activation.
