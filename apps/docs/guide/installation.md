# Installation

Auron requires **Node 22+**, **pnpm 10+** (or npm 10+ / yarn 4+), and **Vue 3.5+**.

## Install Auron

Install the component library and its styles package. The peer dependencies listed below must also be present in your project.

::: code-group

```bash [pnpm]
pnpm add @auronui/vue @auronui/styles
pnpm add -D @tailwindcss/vite
```

```bash [npm]
npm install @auronui/vue @auronui/styles
npm install --save-dev @tailwindcss/vite
```

```bash [yarn]
yarn add @auronui/vue @auronui/styles
yarn add --dev @tailwindcss/vite
```

:::

### Peer Dependencies

`@auronui/vue` requires the following packages in your project. Install any that are missing:

::: code-group

```bash [pnpm]
pnpm add vue@^3.5.0 reka-ui@^2.9.0 tailwindcss@^4.2.0 @vueuse/core@^14.0.0
```

```bash [npm]
npm install vue@^3.5.0 reka-ui@^2.9.0 tailwindcss@^4.2.0 @vueuse/core@^14.0.0
```

```bash [yarn]
yarn add vue@^3.5.0 reka-ui@^2.9.0 tailwindcss@^4.2.0 @vueuse/core@^14.0.0
```

:::

| Peer Dependency | Required Version | Purpose |
|---|---|---|
| `vue` | `>=3.5.0` | Vue 3.5+ required (`useTemplateRef`, `useId`) |
| `reka-ui` | `>=2.9.0` | Accessibility primitives (ARIA state machines) |
| `tailwindcss` | `>=4.0.0` | CSS framework (Tailwind 4 required — not v3) |
| `@vueuse/core` | `>=14.0.0` | Vue composition utilities |

## Configure Tailwind CSS 4

Auron uses **Tailwind CSS 4**, which ships a Vite plugin instead of the classic PostCSS approach.

Update your `vite.config.ts`:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
```

## Import Auron Styles

Add the following imports to your main CSS entry file (typically `src/style.css`):

```css
/* src/style.css */
@import 'tailwindcss';
@import '@auronui/styles/css';
```

`@auronui/styles/css` ships:

- **Tailwind CSS 4 tokens** — color palette, radius, shadow, and spacing custom properties
- **CSS cascade layers** — component styles are scoped inside `@layer` so your own utilities always win
- **Reka UI data-attribute selectors** — interactive states (`data-state="checked"`, `data-disabled`, etc.) mapped to the correct CSS rules

> **Note:** The import order matters. `@import 'tailwindcss'` must come before `@import '@auronui/styles/css'` so Tailwind's utility classes are available inside the layer blocks.

## Minimal Working Example

### `main.ts`

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')
```

### `App.vue`

```vue
<script setup lang="ts">
import { Button } from '@auronui/vue'
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <Button color="primary">Hello Auron</Button>
  </div>
</template>
```

**Expected result:** You should see a primary-colored button centered on the page. If you see unstyled text, check the troubleshooting section below.

## Troubleshooting

### CSS not loading

Verify your `src/style.css` is imported in `main.ts` and that both `@import 'tailwindcss'` and `@import '@auronui/styles/css'` are present. Tailwind CSS 4 requires the `@tailwindcss/vite` plugin — the legacy `@tailwindcss/postcss` plugin is not compatible.

### Tree-shaking kills components

`@auronui/vue` is published with `"sideEffects": false`, which tells bundlers the package is fully tree-shakeable. If you import from `@auronui/vue` but a component appears missing, ensure your bundler is not over-aggressively eliminating the import. Explicit named imports (`import { Button } from '@auronui/vue'`) are always safe.

### Reka UI peer conflict

If you see a peer dependency conflict during install, run:

```bash
pnpm install --strict-peer-dependencies
```

This surfaces the exact version mismatch. Auron requires `reka-ui@>=2.9.0`. If your project uses an older version, upgrade it: `pnpm add reka-ui@^2.9.0`.

---

Next: [Quick Start](/guide/quick-start) — Build a small UI with multiple components.
