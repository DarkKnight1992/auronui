---
title: TimeRangeField
---

<script setup>
import { TimeRangeField } from '@auronui/vue';
import { Time } from '@internationalized/date';

const defaultValue = { start: new Time(9, 0), end: new Time(17, 0) };
const invalidValue = { start: new Time(17, 0), end: new Time(9, 0) };
</script>

# TimeRangeField

`TimeRangeField` is a start/end time-range form field, wrapping Reka UI's `TimeRangeField`
primitive family. It renders two segmented time inputs (start and end) separated by a visible
"–" glyph, and shares its prop surface, data-attribute contract, and floating-label behavior
with `TimeField` and `DateRangeField`.

## Default

<div class="docs-example">
  <TimeRangeField label="Meeting Window" :default-value="defaultValue" />
</div>

```vue-html
<TimeRangeField label="Meeting Window" />
```

## Granularity

`granularity` controls which segments render: `hour`, `minute` (default), or `second`.

<div class="docs-example">
  <TimeRangeField label="With seconds" granularity="second" :default-value="defaultValue" />
</div>

```vue-html
<TimeRangeField label="With seconds" granularity="second" />
```

## Hour cycle

`hourCycle` forces 12-hour (with AM/PM segment) or 24-hour formatting, overriding the locale
default.

<div class="docs-example">
  <div style="display:flex; flex-direction:column; gap:1rem;">
    <TimeRangeField label="12-hour" :hour-cycle="12" :default-value="defaultValue" />
    <TimeRangeField label="24-hour" :hour-cycle="24" :default-value="defaultValue" />
  </div>
</div>

```vue-html
<TimeRangeField label="12-hour" :hour-cycle="12" />
<TimeRangeField label="24-hour" :hour-cycle="24" />
```

## Invalid state

<div class="docs-example">
  <TimeRangeField
    label="Meeting Window"
    :default-value="invalidValue"
    :is-invalid="true"
    error-message="End time must be after start time"
  />
</div>

```vue-html
<TimeRangeField
  label="Meeting Window"
  :is-invalid="true"
  error-message="End time must be after start time"
/>
```

## Props

<PropsTable name="TimeRangeField" />

## Slots

<SlotsTable name="TimeRangeField" />

## Events

<EventsTable name="TimeRangeField" />

## Accessibility

`TimeRangeField` is built on Reka UI's `TimeRangeField` primitive family.

- **Role.** The field root renders `role="group"`, labeled by the field's `label` (when
  provided) via `aria-labelledby`.
- **Keyboard.** Arrow keys move between segments within a segment list; `Tab`/`Shift+Tab` move
  between the start and end segment lists (and past them to adjacent focusable content).
  Number keys type directly into the focused segment.
- **Validation.** `isInvalid` sets `aria-invalid="true"` on the group and, when paired with
  `errorMessage`, renders a `role="alert"` region so assistive technology announces the error.
- **Two independent value sets.** Screen reader users receive separate segment announcements
  for the start and end times — ensure `label` (and `description`, when used) makes clear that
  the field captures a range, not a single time.
