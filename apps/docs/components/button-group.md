---
title: ButtonGroup
---

<script setup>
import { Button, ButtonGroup, CloseButton } from '@auronui/vue';
import { ref } from 'vue';

const groupDisabled = ref(false);
</script>

# ButtonGroup

`ButtonGroup` arranges related buttons in a connected horizontal or vertical strip and
broadcasts shared configuration (`variant`, `size`, `disabled`, `fullWidth`, `orientation`)
to every descendant `<Button>` and `<CloseButton>` via Vue's provide/inject API.

## Horizontal group

The default orientation is horizontal. Borders between adjacent buttons are deduplicated so
the group reads as a single segmented control.

<div class="docs-example">
  <ButtonGroup orientation="horizontal">
    <Button variant="outline">One</Button>
    <Button variant="outline">Two</Button>
    <Button variant="outline">Three</Button>
  </ButtonGroup>
</div>

```vue-html
<ButtonGroup orientation="horizontal">
  <Button variant="outline">One</Button>
  <Button variant="outline">Two</Button>
  <Button variant="outline">Three</Button>
</ButtonGroup>
```

## Vertical group

Set `orientation="vertical"` for a stacked variant. The provided context flows to children
unchanged — only the layout changes.

<div class="docs-example">
  <ButtonGroup orientation="vertical">
    <Button variant="outline">Top</Button>
    <Button variant="outline">Middle</Button>
    <Button variant="outline">Bottom</Button>
  </ButtonGroup>
</div>

```vue-html
<ButtonGroup orientation="vertical">
  <Button variant="outline">Top</Button>
  <Button variant="outline">Middle</Button>
  <Button variant="outline">Bottom</Button>
</ButtonGroup>
```

## Shared variant

Set `variant` on the group and every child without an explicit variant inherits it. Children
can still override their own variant — a per-child prop wins over the group value.

<div class="docs-example">
  <div style="display:flex;flex-direction:column;gap:16px">
    <ButtonGroup variant="success">
      <Button>A</Button>
      <Button>B</Button>
      <Button variant="danger">Override</Button>
    </ButtonGroup>
    <ButtonGroup variant="warning">
      <Button>X</Button>
      <Button>Y</Button>
    </ButtonGroup>
  </div>
</div>

```vue-html
<ButtonGroup variant="success">
  <Button>A</Button>
  <Button>B</Button>
  <Button variant="danger">Override</Button>
</ButtonGroup>
```

## Shared size

`size` propagates the same way. The example below renders three large buttons by setting
`size="lg"` only once on the group.

<div class="docs-example">
  <ButtonGroup size="lg" variant="outline">
    <Button>Large</Button>
    <Button>Group</Button>
    <Button>Members</Button>
  </ButtonGroup>
</div>

```vue-html
<ButtonGroup size="lg" variant="outline">
  <Button>Large</Button>
  <Button>Group</Button>
  <Button>Members</Button>
</ButtonGroup>
```

## Reactive disable

The group's `disabled` prop **always wins** over per-child `disabled`. Toggling it at runtime
disables every member at once, including a `<CloseButton>` mixed into the group.

<div class="docs-example">
  <div>
    <Button @click="groupDisabled = !groupDisabled" variant="ghost" size="sm" style="margin-bottom:16px">
      Toggle group disabled (currently: {{ groupDisabled }})
    </Button>
    <ButtonGroup :disabled="groupDisabled">
      <Button>Save</Button>
      <Button>Discard</Button>
      <CloseButton aria-label="Cancel" />
    </ButtonGroup>
  </div>
</div>

```vue-html
<script setup>
import { ref } from 'vue';
const groupDisabled = ref(false);
</script>

<template>
  <Button @click="groupDisabled = !groupDisabled" variant="ghost">
    Toggle group disabled
  </Button>

  <ButtonGroup :disabled="groupDisabled">
    <Button>Save</Button>
    <Button>Discard</Button>
    <CloseButton aria-label="Cancel" />
  </ButtonGroup>
</template>
```

## Full width

`fullWidth` propagates to children too — every member stretches to fill the group container.

<div class="docs-example">
  <ButtonGroup :full-width="true">
    <Button variant="outline">Left</Button>
    <Button variant="outline">Center</Button>
    <Button variant="outline">Right</Button>
  </ButtonGroup>
</div>

```vue-html
<ButtonGroup :full-width="true">
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>
```

## Props

<PropsTable name="ButtonGroup" />

## Slots

<SlotsTable name="ButtonGroup" />

## Events

<EventsTable name="ButtonGroup" />

## Accessibility

`ButtonGroup` is a presentational wrapper that gives downstream assistive tech a single
landmark for a related set of actions.

- **Role.** The container renders `role="group"`, signalling to assistive tech that the
  child buttons belong together. If the group represents a toolbar, prefer
  [`<Toolbar>`](./toolbar) once it ships, or override `role="toolbar"` and manage roving
  focus yourself.
- **Orientation.** The `data-orientation` attribute mirrors the `orientation` prop and is
  forwarded to every child button so Auron's CSS can render the segmented border treatment
  (left/right rounding for horizontal, top/bottom for vertical).
- **Disabled propagation.** The group provides a single source of truth for `disabled`. The
  group value **always wins** — a per-child `:disabled="false"` cannot re-enable a child
  inside a disabled group.
- **Provide / inject pattern.** Internally `ButtonGroup` calls `useButtonGroupProvide({...})`
  with reactive `Ref`s built from `toRef(props, 'x')`. Children call `useButtonGroupInject()`
  with sensible default `Ref`s as a fallback so a `<Button>` rendered outside any group still
  works. Because the provided values are real refs, runtime changes (e.g. toggling
  `disabled`) propagate to every descendant without re-renders.
- **Keyboard.** Each button keeps its native focus and activation behaviour; `Tab` moves
  between members. The group does not implement roving focus — every member is reachable in
  source order.
