# Reka UI Props/Emits Passthrough — Design Spec

**Date:** 2026-06-26  
**Status:** Approved

## Problem

Auron's wrapper components do not expose all props and emits that their underlying Reka UI primitives support. Users have no way to pass `forceMount`, `disableOutsidePointerEvents`, positioning props (`collisionBoundary`, `arrowPadding`, etc.), `as`, `asChild`, or missing events like `focusOutside` through to Reka. This also means Storybook's controls panel is missing these props, so library consumers don't know they exist.

## Goal

- Every Reka-backed wrapper component exposes 100% of the Reka primitive's props and emits
- Every corresponding Storybook story surfaces those props as wired controls (or documented-only for DOM-ref props)
- No existing story behaviour breaks

## Architecture

### Phase 1 — Audit Script

File: `scripts/audit-reka-props.mjs`

The script:
1. Walks every `.vue` file under `packages/vue/src/components/`
2. For each file, parses the `<script setup>` block with `@vue/compiler-sfc` to extract:
   - Which Reka components are imported (detects `import { X } from 'reka-ui'` lines)
   - Currently declared prop names from `defineProps<{}>`
   - Currently declared emit names from `defineEmits<{}>`
3. For each detected Reka component name, `require()`s it from the installed `reka-ui` package and reads its `.props` and `.emits` at runtime
4. Diffs Reka props/emits against what we declare
5. Skips props our wrapper intentionally omits (hardcoded `forceMount` on Tooltip/Popover, context-injection props)
6. Outputs `scripts/audit-report.json` — structured gaps per file

**Output shape:**
```json
[
  {
    "componentFile": "packages/vue/src/components/drawer/DrawerContent.vue",
    "storyFile": "packages/storybook/stories/Drawer.stories.ts",
    "rekaComponent": "DialogContent",
    "missingProps": ["forceMount", "disableOutsidePointerEvents", "as", "asChild"],
    "missingEmits": ["focusOutside"]
  }
]
```

### Phase 2 — Component Patches (parallel agents, one per family)

Each agent:
1. Reads its family's entries from `audit-report.json`
2. For each `.vue` file, opens it and adds missing props to `defineProps<{}>` with correct TypeScript types
3. Adds missing emits to `defineEmits<{}>()`
4. Binds the new props and forwards the new emits to the Reka primitive in the template

### Phase 3 — Story Updates (same agents, continuing after Phase 2)

Each agent:
1. Opens the corresponding `.stories.ts` file
2. Adds `argTypes` for each new prop, grouped by sub-component via `table: { category: 'SubComponentName' }`
3. Adds default values to `args`
4. Updates the story template to pass args down to the relevant sub-component

## Naming Convention — Story Args

For compound components, story args use a camelCase prefix based on the sub-component role:

| Sub-component | Reka prop | Story arg |
|---|---|---|
| `DrawerContent` | `forceMount` | `contentForceMount` |
| `DrawerContent` | `disableOutsidePointerEvents` | `contentDisableOutsidePointerEvents` |
| `DrawerTrigger` | `as` | `triggerAs` |
| `DrawerClose` | `as` | `closeAs` |
| `DrawerOverlay` | `forceMount` | `overlayForceMount` |
| `TooltipContent` | `ariaLabel` | `contentAriaLabel` |
| `TooltipContent` | `collisionPadding` | `contentCollisionPadding` |

For simple (non-compound) components, the story arg name is the prop name directly (`forceMount`, `as`, etc.).

## Story ArgType Pattern

```ts
argTypes: {
  // --- DrawerContent ---
  contentForceMount: {
    control: 'boolean',
    description: 'Force content to stay mounted even when the drawer is closed.',
    table: { category: 'DrawerContent', defaultValue: { summary: 'false' } },
  },
  contentDisableOutsidePointerEvents: {
    control: 'boolean',
    description: 'Prevent pointer events on elements outside the content when open.',
    table: { category: 'DrawerContent', defaultValue: { summary: 'false' } },
  },
  // --- DrawerTrigger ---
  triggerAs: {
    control: 'text',
    description: 'HTML element or component to render the trigger as.',
    table: { category: 'DrawerTrigger', defaultValue: { summary: 'button' } },
  },
  triggerAsChild: {
    control: 'boolean',
    description: 'Merge props onto the child element instead of rendering a wrapper.',
    table: { category: 'DrawerTrigger', defaultValue: { summary: 'false' } },
  },
}
```

Story template wiring:
```ts
template: `
  <Drawer v-bind="args">
    <DrawerTrigger :as="args.triggerAs" :as-child="args.triggerAsChild">
      Open
    </DrawerTrigger>
    <DrawerContent
      :force-mount="args.contentForceMount"
      :disable-outside-pointer-events="args.contentDisableOutsidePointerEvents"
    >
      ...
    </DrawerContent>
  </Drawer>
`
```

## Edge Cases

### `forceMount` hardcoded on animated components

`TooltipContent` and `PopoverContent` hardcode `:force-mount="true"` because they use `motion-v`/`AnimatePresence` for enter/exit animations. Exposing `forceMount` as a user prop on these would break the animation. These are documented in stories with `control: false` and a description explaining why.

### DOM-ref props (`collisionBoundary`, `reference`)

These props accept DOM elements or arrays of DOM elements — not serialisable to Storybook controls. They are added to the Vue component's `defineProps` so they're passable programmatically, but in stories they get:
```ts
collisionBoundary: {
  control: false,
  description: 'Element(s) to use as the collision boundary. Pass programmatically.',
  table: { category: 'Content' },
}
```

### `as` / `asChild` on triggers and close buttons

Added to every component that wraps a Reka trigger/close primitive. In stories, `asChild` gets `control: 'boolean'`, `as` gets `control: 'text'`. Both are added to the story template bindings.

### Positioning props on floating content

`side`, `sideOffset`, `align`, `alignOffset`, `avoidCollisions`, `collisionPadding`, `arrowPadding`, `sticky`, `hideWhenDetached`, `positionStrategy`, `updatePositionStrategy` appear on `TooltipContent`, `PopoverContent`, dropdown content, select content, combobox content. All added to Vue files and stories with appropriate control types (`number`, `boolean`, `select`).

## Component Families & Agent Groups

| Agent | Components | Story file |
|---|---|---|
| 1 — Dialog | Drawer (all sub), Modal (all sub), AlertDialog (all sub) | Drawer.stories.ts, Modal.stories.ts, AlertDialog.stories.ts |
| 2 — Overlay floating | Tooltip (all sub), Popover (all sub) | Tooltip.stories.ts, Popover.stories.ts |
| 3 — Menus | Dropdown (all sub), Select (all sub) | Dropdown.stories.ts, Select.stories.ts |
| 4 — Combobox/ListBox | Combobox, Autocomplete, ListBox (all sub) | ComboBox.stories.ts, Autocomplete.stories.ts, ListBox.stories.ts |
| 5 — Disclosure | Accordion (all sub), Collapsible (all sub), Tabs (all sub) | Accordion.stories.ts, Collapsible.stories.ts, Tabs.stories.ts |
| 6 — Form controls | Checkbox, Radio, Switch, Slider, NumberField, PinInput | respective story files |
| 7 — Calendar/Date | Calendar, DatePicker, DateRangePicker, DateRangeField, DateTimePicker, TimeField | respective story files |
| 8 — Rest | ScrollArea, Separator, Splitter, Toast, Toolbar, Tree, Pagination, Avatar, AspectRatio, Progress, Stepper, ColorArea, ColorField, ColorSlider, ColorSwatch, ColorSwatchPicker | respective story files |

## What Is Not Changed

- Components that don't wrap a Reka primitive (Badge, Card, Spinner, Skeleton, Text, etc.) — no change
- `TooltipContent.forceMount` and `PopoverContent.forceMount` — remain hardcoded, documented only
- Internal Reka props used for compound component wiring (injected context) — not exposed

## Success Criteria

1. `scripts/audit-report.json` lists zero gaps after patches are applied
2. TypeScript build (`pnpm build`) passes with no new errors
3. Every story file for a Reka-backed component has argTypes covering all new props
4. `pnpm storybook` starts without errors
5. Existing story snapshots/axe tests continue to pass
