# Server-Side Rendering

Auron is SSR-safe. Every component and composable in `@auronui/vue` is verified against the `apps/ssr-test` Nuxt 3 smoke test — hydration mismatches and server-only guard violations are treated as bugs.

## Nuxt 3 Setup

### 1. Install

```bash
pnpm add @auronui/vue @auronui/styles
pnpm add reka-ui@^2.9.0 @vueuse/core@^14.0.0
pnpm add -D @tailwindcss/vite
```

### 2. Configure Tailwind CSS 4

Add the `@tailwindcss/vite` plugin to your Nuxt config:

```ts
// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  vite: {
    plugins: [tailwindcss()],
  },
})
```

### 3. Import styles

Register the Auron CSS via Nuxt's `css` array — this ensures the stylesheet is loaded on both server and client:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['@auronui/styles/css'],

  vite: {
    plugins: [tailwindcss()],
  },

  ssr: true,                 // explicitly enabled (Nuxt default)
  compatibilityDate: '2024-11-01',

  typescript: {
    strict: true,
  },
})
```

### 4. Use components in pages

Import components directly in `<script setup>` — no global registration needed:

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
import { Button, Card, CardHeader, CardBody } from '@auronui/vue'
</script>

<template>
  <Card>
    <CardHeader>Welcome</CardHeader>
    <CardBody>
      <Button color="primary">Get Started</Button>
    </CardBody>
  </Card>
</template>
```

## Hydration Safety

Most Auron components are fully renderable on the server. A small subset — primarily **Popover**, **Tooltip**, **Modal**, **Drawer**, and **Toast** — render floating content anchored to the document body. These components are safe to SSR but their open/close state must be initialized consistently between server and client to avoid hydration warnings.

### `useIsMounted` and `useIsHydrated`

Two composables in `@auronui/vue` help guard client-only logic:

```ts
import { useIsMounted, useIsHydrated } from '@auronui/vue'

const isMounted = useIsMounted()   // true only after the component mounts on the client
const isHydrated = useIsHydrated() // true only after Vue finishes client-side hydration
```

Use `useIsMounted` to defer rendering client-only content (e.g., a Tooltip that reads `window.innerWidth`):

```vue
<script setup lang="ts">
import { useIsMounted, Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@auronui/vue'

const isMounted = useIsMounted()
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent v-if="isMounted">
        This content renders only after hydration
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
```

Use `useIsHydrated` when you need to wait for the full hydration cycle to complete before reading reactive state that depends on browser APIs.

## Reference App

The canonical Nuxt SSR example lives in `apps/ssr-test/` in the Auron monorepo. It runs `nuxt build` + `nuxt start` as part of the CI pipeline to catch hydration regressions automatically.

---

Related: [Installation](/guide/installation) | [Quick Start](/guide/quick-start)
