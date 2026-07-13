---
title: InputGroup
---

<script setup>
import { ref } from 'vue';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@auronui/vue';

const amount = ref('');
</script>

# InputGroup

A generic bordered box for merging arbitrary content — icons, buttons, a bare input — into one field-styled unit. Unlike `Input`, which owns a single native `<input>` plus its own label/clear/password-toggle machinery, `InputGroup` is agnostic about its children: it provides the shared box plus size/invalid/disabled context, and `InputGroupAddon`/`InputGroupInput` read from that context. Position (leading vs. trailing) is just DOM order — place an addon before or after `InputGroupInput`.

## Example

<div class="docs-example">
  <InputGroup label="Amount" description="Enter the amount in USD" full-width>
    <InputGroupAddon aria-hidden="true">$</InputGroupAddon>
    <InputGroupInput v-model="amount" placeholder="0.00" />
  </InputGroup>
</div>

## Props

<PropsTable name="InputGroup" />

## Slots

<SlotsTable name="InputGroup" />

## Events

<EventsTable name="InputGroup" />

## Accessibility

- `InputGroup` owns `label`/`description`/`errorMessage` via the same field machinery `Input` uses. It generates a field id (`useId()`) and exposes it, along with the computed `aria-describedby`, through context — a contained `InputGroupInput` adopts both automatically, with no manual `id`/`aria-describedby` wiring required.
- If `label` is set, a `<label for="…">` is rendered above the box (outside it) and targets the generated field id. There is no "inside floating label" mode, since that only makes sense for a single owned `<input>`, not an arbitrary collection of addons/inputs.
- `description` renders below the box and is referenced by the input's `aria-describedby`. `errorMessage` only renders — and only takes over `aria-describedby` — when `isInvalid` is also `true`; it takes precedence over `description` when both are present and `isInvalid`.
- `isInvalid: true` sets `data-invalid` on the root box and `aria-invalid="true"` on `InputGroupInput`.
- `isDisabled: true` sets `data-disabled` on the root box, propagates `data-disabled` to every `InputGroupAddon`, and disables every contained `InputGroupInput` (unless an individual `InputGroupInput` sets its own `isDisabled` override).
- An explicit `id` or `aria-describedby` attribute passed directly to `InputGroupInput` always wins over the id/description inherited from the parent `InputGroup`.
- `InputGroupAddon` falls back to sane context defaults when used without a parent `InputGroup`, so it never throws — but it's intended to always be used inside one. Purely decorative addons (like a `$` prefix or an icon) should be marked `aria-hidden="true"` since they carry no independent semantic meaning.
