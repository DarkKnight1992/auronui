# @auronui/vue

[![npm version](https://img.shields.io/npm/v/@auronui/vue.svg?style=flat)](https://npmjs.com/package/@auronui/vue)
[![license](https://img.shields.io/npm/l/@auronui/vue.svg)](../../LICENSE)

> 85+ accessible Vue 3 components powered by [Reka UI](https://reka-ui.com) and [Tailwind CSS 4](https://tailwindcss.com). Inspired by [HeroUI](https://heroui.com).

## Installation

```bash
pnpm add @auronui/vue
# npm install @auronui/vue
# yarn add @auronui/vue
```

Peer dependencies — install these alongside the package:

```bash
pnpm add vue@^3.5.0 reka-ui@^2.9.0 @vueuse/core@^14.0.0
```

## Setup

Import the stylesheet once in your app entry point:

```ts
// main.ts
import { createApp } from 'vue'
import '@auronui/vue/style'
import App from './App.vue'

createApp(App).mount('#app')
```

## Usage

```vue
<script setup lang="ts">
import { Button, ButtonGroup } from '@auronui/vue'
</script>

<template>
  <ButtonGroup variant="solid" color="primary">
    <Button>Save</Button>
    <Button>Cancel</Button>
  </ButtonGroup>
</template>
```

Every component is individually importable — only what you use lands in your bundle (`sideEffects: false`).

## Dark mode

Components adapt to the system color scheme automatically via `@media (prefers-color-scheme: dark)`.

For explicit control, add the `dark` class (or `data-theme="dark"`) to any ancestor element — typically `<html>`:

```html
<!-- force dark -->
<html class="dark">

<!-- force light -->
<html class="light">
```

## Theming

Override CSS custom properties on `:root` to customise design tokens:

```css
:root {
  --accent: oklch(55% 0.22 262);   /* primary/accent color */
  --radius: 0.375rem;              /* base border-radius */
}
```

All theme tokens are documented in [`@auronui/styles`](../styles/README.md).

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

## SSR

All components are SSR-safe and render in Nuxt 3 with zero hydration mismatches.

## License

[MIT](../../LICENSE)
