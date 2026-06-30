# Auron UI

[![npm version](https://img.shields.io/npm/v/@auronui/vue.svg?style=flat)](https://npmjs.com/package/@auronui/vue)
[![license](https://img.shields.io/npm/l/@auronui/vue.svg)](./LICENSE)
[![CI](https://github.com/DarkKnight1992/auronui/actions/workflows/ci.yml/badge.svg)](https://github.com/DarkKnight1992/auronui/actions/workflows/ci.yml)
[![storybook](https://img.shields.io/badge/storybook-live-ff4785.svg)](https://darkknight1992.github.io/auron/)

> A multi-framework component library — accessible, beautifully designed UI components powered by Reka UI and Tailwind CSS 4. Starting with Vue 3, with React and Angular coming soon.
>
> Inspired by [HeroUI](https://heroui.com).

## Features

- **85+ components** — covering every UI domain: forms, overlays, navigation, data, date/time, color, and more
- **Accessible by default** — every component passes `@chialab/vitest-axe` with zero violations
- **Reka UI primitives** — battle-tested WAI-ARIA state machines (Radix for Vue) under the hood
- **Tailwind CSS 4** — `@auronui/styles` ships BEM class strings via `tailwind-variants`, fully themeable
- **Vue 3.5+ native** — uses `useTemplateRef`, improved `defineModel`, and `useId` throughout
- **Tree-shakable** — `sideEffects: false`; only the components you import land in your bundle
- **SSR-safe** — every component renders in Nuxt 3 with zero hydration mismatches
- **TypeScript strict** — full prop and slot type inference, JSDoc-driven props tables in docs

## Installation

```bash
pnpm add @auronui/vue
```

```ts
// main.ts
import '@auronui/vue/style'
```

Peer dependencies: `vue@^3.5.0`, `reka-ui@^2.9.0`.

## AI Assistant Setup

AuronUI ships rules that teach AI coding assistants (Claude Code, Cursor, Copilot, Windsurf, Gemini CLI, etc.) to use `<Button>` instead of `<button>`, import from `@auronui/vue`, and follow the component API correctly.

```bash
npx @auronui/vue setup-ai
```

This creates `auronui-rules.md` in your project root and prints the one-liner to add to each AI tool's config file. Re-run with `--update` after upgrading the package to refresh the rules.

> **Maintainers:** edit `packages/vue/src/ai-rules/template.md`, then run `pnpm --filter @auronui/vue build:ai` and commit the three generated files (`packages/vue/ai-rules.md`, `llms.txt`, `llms-full.txt`).

## Quick Example

```vue
<script setup lang="ts">
import { Button, ButtonGroup } from '@auronui/vue'
</script>

<template>
  <ButtonGroup variant="solid" color="primary">
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
</template>
```

## Documentation

Browse interactive component stories at **[Storybook](https://darkknight1992.github.io/auronui/)**.

## Components

| Domain | Components |
|--------|------------|
| Presentational | Spinner, Separator, Skeleton, Text, Label, Badge, Chip, Card, Kbd, EmptyState |
| Buttons & Links | Button, ButtonGroup, CloseButton, ToggleButton, ToggleButtonGroup, Link |
| Form Inputs | Input, Textarea, NumberField, Fieldset |
| Form Selection | Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, SwitchGroup, InputOTP |
| Overlay | Popover, Tooltip, Modal, AlertDialog, Drawer |
| Navigation | Tabs, Accordion, Collapsible, Breadcrumbs, Toolbar |
| Feedback | Alert, Toast |
| Selection | ListBox, Select, Dropdown, ComboBox, Autocomplete, TagGroup, Tag |
| Data | Table, Pagination |
| Media | Avatar, AvatarGroup, Slider, ProgressBar, ProgressCircle, Meter, ScrollShadow, ScrollArea |
| Date & Time | Calendar, RangeCalendar, DateInput, DateRangeField, TimeField, DatePicker, DateRangePicker |
| Color | ColorArea, ColorSlider, ColorField, ColorSwatch, ColorSwatchPicker, ColorInputGroup, ColorPicker |
| Extended | AspectRatio, Splitter, Stepper, Tree |

## Project Structure

This is a pnpm + Turborepo monorepo:

```
auron/
  packages/
    vue/          # @auronui/vue — Vue 3 component library
    styles/       # @auronui/styles — CSS + tailwind-variants (framework-agnostic)
    standard/     # shared ESLint/Prettier/TSConfig
    vitest/       # shared Vitest config
    storybook/    # Storybook 10 dev environment
  apps/
    docs/         # VitePress documentation site
    ssr-test/     # Nuxt 3 SSR smoke test
    tree-shaking-test/  # Vite consumer tree-shaking verification
```

## Roadmap

- [x] `@auronui/vue` — Vue 3 (current)
- [ ] `@auronui/react` — React 19
- [ ] `@auronui/angular` — Angular 18+

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for monorepo setup, adding a component, and the PR process. All contributors are expected to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) © Auron UI contributors.
