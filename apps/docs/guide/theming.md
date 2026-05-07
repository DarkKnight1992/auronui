# Theming

Auron v1.0 theming is driven entirely by `@auronui/styles` CSS custom properties. You override tokens in your own stylesheet after importing `@auronui/styles/css` — no JavaScript configuration required.

> **v1.1 note:** Runtime theme switching (programmatic palette swaps, multi-theme support) is deferred to Auron v1.1. The v1.0 story is **static CSS variable overrides only**.

## CSS Variables

Override any token by redefining it on `:root` (or a scoped selector) **after** the `@auronui/styles/css` import:

```css
/* src/style.css */
@import 'tailwindcss';
@import '@auronui/styles/css';

/* --- Your overrides go here --- */
:root {
  /* Primary color (oklch, rgb, hsl, hex — all accepted) */
  --auron-primary: oklch(55% 0.2 262);
  --auron-primary-foreground: #ffffff;

  /* Danger/error */
  --auron-danger: oklch(60% 0.22 25);
  --auron-danger-foreground: #ffffff;

  /* Success */
  --auron-success: oklch(65% 0.18 145);
  --auron-success-foreground: #ffffff;

  /* Warning */
  --auron-warning: oklch(75% 0.18 75);
  --auron-warning-foreground: #000000;

  /* Border radius */
  --auron-radius-small: 0.25rem;
  --auron-radius-medium: 0.5rem;
  --auron-radius-large: 0.75rem;
}
```

These variables flow into every component through `@auronui/styles` — changing `--auron-primary` automatically updates buttons, badges, checkboxes, and any other component that uses the `color="primary"` variant.

## Dark Mode

Auron uses the `.dark` class approach, matching Tailwind CSS 4 convention. Add or remove `.dark` on the root `<html>` element to switch modes:

```ts
// Toggle dark mode
document.documentElement.classList.toggle('dark')
```

The `@auronui/styles` stylesheet ships dark-mode overrides inside a `.dark` selector block. No additional configuration is needed.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isDark = ref(false)

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<template>
  <button @click="toggleDark">
    {{ isDark ? 'Switch to light' : 'Switch to dark' }}
  </button>
</template>
```

## Custom Variants

`@auronui/styles` uses [`tailwind-variants`](https://www.tailwind-variants.org) (`tv()`) for each component's variant definitions. If you need to extend or override a component's visual variants beyond CSS variable overrides, locate the component's `tv()` call in `packages/styles/src/components/<component>/index.ts` and fork the definition into your own project:

```ts
// Example: extending Button variants with a custom "brand" color
import { tv } from 'tailwind-variants'
import { button } from '@auronui/styles/components/button'

export const brandButton = tv({
  extend: button,
  variants: {
    color: {
      brand: 'bg-brand-500 text-white hover:bg-brand-600',
    },
  },
})
```

Pass the extended `tv()` result's class strings via the component's `class` prop for one-off overrides, or wrap the component to apply them globally.

---

Related: [Installation](/guide/installation) | [Quick Start](/guide/quick-start)
