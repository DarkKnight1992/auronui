---
title: Button
---

<script setup>
import { Button, CloseButton } from '@auronui/vue';
</script>

# Button

`Button` is the primary action element in Auron. It wraps Reka UI's `Primitive` with
Auron's `tailwind-variants` styling, supports 11 visual variants, three sizes, loading and
disabled states, and inherits configuration from a surrounding `<ButtonGroup>` via Vue
provide/inject.

## Default

A bare `<Button>` renders the `primary` variant at `md` size.

<div class="docs-example">
  <Button>Click me</Button>
</div>

```vue-html
<Button>Click me</Button>
```

## Variants

`Button` ships eleven visual variants. Use them to communicate intent and hierarchy.

<div class="docs-example">
  <div style="display:flex;flex-wrap:wrap;gap:8px">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="tertiary">Tertiary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
    <Button variant="danger-soft">Danger Soft</Button>
    <Button variant="success">Success</Button>
    <Button variant="success-soft">Success Soft</Button>
    <Button variant="warning">Warning</Button>
    <Button variant="warning-soft">Warning Soft</Button>
  </div>
</div>

```vue-html
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
```

## Sizes

Three sizes are available: `sm`, `md` (default), and `lg`. Padding, font size, and the loading
spinner all scale together.

<div class="docs-example">
  <div style="display:flex;align-items:center;gap:8px">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
</div>

```vue-html
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

## Loading state

When `isLoading` is true, the button label fades behind a centered `Spinner` and the button is
disabled to prevent double-submission. The spinner size is derived from the button size.

<div class="docs-example">
  <div style="display:flex;gap:8px">
    <Button :is-loading="true" size="sm">Loading</Button>
    <Button :is-loading="true" size="md">Loading</Button>
    <Button :is-loading="true" size="lg">Loading</Button>
  </div>
</div>

```vue-html
<Button :is-loading="true">Loading</Button>
```

## Disabled state

`disabled` removes the button from the tab order, sets `aria-disabled`, and applies the
`data-disabled` attribute used by Auron styles for hover/active suppression.

<div class="docs-example">
  <div style="display:flex;gap:8px">
    <Button :disabled="true" variant="primary">Disabled Primary</Button>
    <Button :disabled="true" variant="outline">Disabled Outline</Button>
  </div>
</div>

```vue-html
<Button :disabled="true">Disabled</Button>
```

## With start and end content

Use the `startContent` and `endContent` named slots to attach icons or other adornments
without breaking the button's flex layout.

<div class="docs-example">
  <div style="display:flex;gap:8px">
    <Button>
      <template #startContent><span aria-hidden="true">★</span></template>
      With start
    </Button>
    <Button>
      With end
      <template #endContent><span aria-hidden="true">→</span></template>
    </Button>
  </div>
</div>

```vue-html
<Button>
  <template #startContent><span aria-hidden="true">★</span></template>
  With start
</Button>

<Button>
  With end
  <template #endContent><span aria-hidden="true">→</span></template>
</Button>
```

## Icon-only

For icon-only buttons, set `isIconOnly` to switch to a square hit target. For the common
"close" pattern, prefer the dedicated [`<CloseButton>`](./close-button) which forwards the
proper `aria-label` automatically.

<div class="docs-example">
  <div style="display:flex;align-items:center;gap:8px">
    <Button :is-icon-only="true" aria-label="Bookmark">★</Button>
    <CloseButton aria-label="Dismiss" />
  </div>
</div>

```vue-html
<Button :is-icon-only="true" aria-label="Bookmark">★</Button>
<CloseButton aria-label="Dismiss" />
```

## Full width

`fullWidth` stretches the button to fill its container. Useful inside cards and modals.

<div class="docs-example">
  <Button :full-width="true">Full width</Button>
</div>

```vue-html
<Button :full-width="true">Full width</Button>
```

## Props

<PropsTable name="Button" />

## Slots

<SlotsTable name="Button" />

## Events

<EventsTable name="Button" />

## Accessibility

`Button` is built on Reka UI's `Primitive` so it renders a real `<button>` by default and
inherits all native semantics for free.

- **Role.** Native `<button>` element — `role="button"` is implicit. When you change `as` to
  another element (e.g. `as="a"`), supply a matching `role` and tab handling yourself.
- **Keyboard.** `Space` and `Enter` activate the button (native behaviour). `Tab` moves focus
  in and out of the button.
- **Disabled.** When `disabled` is `true`, the underlying element receives the native
  `disabled` attribute, the `data-disabled` data attribute (consumed by `@auronui/styles`),
  and is removed from the tab order. A disabled button does not emit `click`.
- **Loading.** When `isLoading` is `true`, the button is also disabled and `data-loading` is
  set. Surface a textual loading state to assistive technology by leaving the label visible
  (it stays in the DOM behind the spinner) or by pairing the button with an
  `aria-live="polite"` region.
- **Icon-only.** Always provide an `aria-label` (or visually hidden text) when using
  `isIconOnly`, otherwise screen readers will announce no accessible name.
- **Group context.** When wrapped in a `<ButtonGroup>`, the button picks up `variant`, `size`,
  `disabled`, `fullWidth`, and `orientation` from the group via provide/inject. The group's
  `disabled` always wins; other props can be overridden per child.
