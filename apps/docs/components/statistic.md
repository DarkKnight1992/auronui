---
title: Statistic
---

<script setup>
import { Statistic } from '@auronui/vue';
</script>

# Statistic

A single-number KPI/metric display: a label paired with a large value, plus
optional prefix/suffix, a description line, and an up/down/neutral trend
indicator. It's a purely presentational component (no Reka UI primitive
involved) and supports the standard `color` palette
(default/primary/secondary/accent/success/warning/danger). Pass `isLoading`
to swap the value for a `Skeleton` placeholder while data is fetched.

## Example

<div class="docs-example">
  <Statistic label="Revenue" value="48,294" prefix="$" description="Last 30 days" trend="up" trend-value="12%" color="success" />
</div>

## Props

<PropsTable name="Statistic" />

## Slots

<SlotsTable name="Statistic" />

## Events

<EventsTable name="Statistic" />

## Accessibility

- The label and value render as plain `<span>` elements
  (`data-slot="statistic-label"` / `data-slot="statistic-value"`) rather than
  a heading, so a `Statistic` doesn't add an entry to the page's heading
  outline. If a statistic should be discoverable via heading navigation,
  wrap it (or its label) in an appropriate heading element yourself.
- The value carries no `aria-label`/`aria-labelledby` tying it back to the
  label — the two are associated only by visual/DOM proximity within the
  same root element. Screen readers will read the label and value as
  separate text nodes in document order, not as a combined "Revenue: $48,294"
  announcement.
- The trend icon (up/down/neutral arrow) is an inline `<svg>` marked
  `aria-hidden="true"`; only the accompanying `trendValue` text (e.g. `12%`)
  is exposed to assistive tech.
- While `isLoading` is true, the value is replaced by the shared `Skeleton`
  component, which renders its placeholder as `aria-hidden="true"` — loading
  state doesn't announce anything and doesn't leave stale value text behind.
- There is no built-in `aria-live` region: if a `Statistic`'s `value` updates
  dynamically after mount (e.g. polling), assistive tech will not
  automatically announce the change. Wrap the component in your own live
  region if that announcement is required.
- Verified with `@chialab/vitest-axe`: zero violations in the default state,
  with description + trend, and while loading (`Statistic.axe.test.ts`).
