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
  --primary: oklch(55% 0.2 262);
  --primary-foreground: #ffffff;

  /* Danger/error */
  --danger: oklch(60% 0.22 25);
  --danger-foreground: #ffffff;

  /* Success */
  --success: oklch(65% 0.18 145);
  --success-foreground: #ffffff;

  /* Warning */
  --warning: oklch(75% 0.18 75);
  --warning-foreground: #000000;

  /* Corner radius — fields derive theirs from it (--field-radius) */
  --radius: 0.5rem;
}
```

These variables flow into every component through `@auronui/styles` — changing `--primary` automatically updates buttons, badges, checkboxes, and any other component that uses the `color="primary"` variant.

## Dark Mode

Auron uses the `.dark` class approach, matching Tailwind CSS 4 convention. Add or remove `.dark` on the root `<html>` element to switch modes:

```ts
// Toggle dark mode
document.documentElement.classList.toggle('dark')
```

The `@auronui/styles` stylesheet ships dark-mode tokens for `.dark` / `[data-theme="dark"]`, and also follows the OS setting (`prefers-color-scheme: dark`) unless the root carries `.light` / `[data-theme="light"]`. No additional configuration is needed.

Every theme token block is declared with zero specificity (`:where(…)`), so a plain selector always wins — to re-theme dark mode, override the tokens under `.dark` (and, if you rely on the OS setting, inside your own `@media (prefers-color-scheme: dark) { :root { … } }`):

```css
.dark {
  --surface: oklch(0.22 0.01 60);
  --border: oklch(0.32 0.01 60);
}
```

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

### Border colour

`--border` is the theme's border colour token, defined separately for light
mode and for dark mode (`.dark` / `[data-theme="dark"]` and
`prefers-color-scheme: dark`). Bordered surfaces such as `variant="bordered"`
fields use it directly, and other field borders resolve to
`var(--field-border, var(--border))`. To change border colour in dark mode,
override `--border` inside your dark selector:

```css
.dark,
[data-theme="dark"] {
  --border: oklch(35% 0.006 286);
}
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
