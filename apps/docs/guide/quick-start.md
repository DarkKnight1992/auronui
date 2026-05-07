# Quick Start

This guide assumes you have already completed [Installation](/guide/installation). You have `@auronui/vue`, `@auronui/styles`, and Tailwind CSS 4 set up in a Vite + Vue 3.5 project.

## Build a Small UI

The example below renders a Card wrapping a `Button`, a `ToggleButtonGroup` with three toggle options, a `Link`, and a `Badge` — all imported from `@auronui/vue` in a single `<script setup>` block.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Link,
  ToggleButton,
  ToggleButtonGroup,
} from '@auronui/vue'

const selectedView = ref<string[]>(['grid'])
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-8">
    <Card class="w-full max-w-sm">
      <CardHeader class="flex items-center gap-2">
        <span class="font-semibold text-lg">Dashboard</span>
        <Badge color="primary" size="sm">New</Badge>
      </CardHeader>

      <CardBody class="flex flex-col gap-4">
        <!-- Toggle button group: pick a view mode -->
        <ToggleButtonGroup v-model="selectedView" selection-mode="single">
          <ToggleButton value="grid">Grid</ToggleButton>
          <ToggleButton value="list">List</ToggleButton>
          <ToggleButton value="table">Table</ToggleButton>
        </ToggleButtonGroup>

        <p class="text-sm text-gray-600">
          Current view: <strong>{{ selectedView[0] ?? 'none' }}</strong>
        </p>
      </CardBody>

      <CardFooter class="flex items-center justify-between">
        <Link href="/guide/theming">Customize theme</Link>
        <Button color="primary" size="sm">Save</Button>
      </CardFooter>
    </Card>
  </div>
</template>
```

Copy-paste this into your `App.vue`, run `pnpm dev`, and you will see the card render with a working toggle group, a badge, a link, and a primary button.

## How Variant Props Work

Every Auron component exposes a set of **variant props** derived from `tailwind-variants` (`tv()`) definitions in `@auronui/styles`. For example, `Button` accepts `color`, `size`, `radius`, `variant`, and `isLoading`. These map directly to CSS class strings — no runtime style computation, no CSS-in-JS.

You can find each component's available variants on its reference page (e.g., [Button](/components/button)). The `PropsTable` on each page shows every prop with its type, accepted values, and default.

## Group Context via provide / inject

Some components share state through Vue's `provide` / `inject` system. `ToggleButtonGroup` provides a group context that `ToggleButton` children inject — you do not need to wire up selection state manually in the parent. The same pattern is used by `ButtonGroup`, `CheckboxGroup`, `RadioGroup`, `SwitchGroup`, and others.

```vue
<!-- ToggleButtonGroup provides context automatically -->
<ToggleButtonGroup v-model="selected" selection-mode="single">
  <ToggleButton value="a">Option A</ToggleButton>
  <ToggleButton value="b">Option B</ToggleButton>
</ToggleButtonGroup>
```

## Theming Variants

All color, radius, and shadow tokens are CSS custom properties defined in `@auronui/styles`. Override them after the import to retheme globally:

```css
/* src/style.css */
@import 'tailwindcss';
@import '@auronui/styles/css';

:root {
  --auron-primary: oklch(55% 0.2 262);
  --auron-radius-medium: 0.5rem;
}
```

See the full [Theming guide](/guide/theming) for the complete list of overridable tokens.

## Next Steps

- [Components](/components/button) — Browse all 85 component reference pages
- [Theming](/guide/theming) — Override CSS variables and dark mode
- [Server-Side Rendering](/guide/ssr) — Set up Auron in a Nuxt 3 project
