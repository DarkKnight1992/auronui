---
title: MonthRangePicker
---

<script setup>
import { MonthRangePicker } from '@auronui/vue';
import { CalendarDate } from '@internationalized/date';

const defaultValue = { start: new CalendarDate(2024, 3, 1), end: new CalendarDate(2024, 8, 1) };
</script>

# MonthRangePicker

`MonthRangePicker` is a month-range selection grid, wrapping Reka UI's `MonthRangePicker`
primitive family. It renders all 12 months of a year with Prev/Next navigation stepping by
year, and highlights a contiguous range between a start and end month.

## Default

<div class="docs-example">
  <MonthRangePicker :default-value="defaultValue" />
</div>

```vue-html
<MonthRangePicker />
```

## Min / max range

<div class="docs-example">
  <MonthRangePicker
    :default-value="{ start: new CalendarDate(2024, 3, 1), end: new CalendarDate(2024, 6, 1) }"
    :min-value="new CalendarDate(2024, 2, 1)"
    :max-value="new CalendarDate(2024, 10, 1)"
  />
</div>

```vue-html
<MonthRangePicker
  :default-value="{ start: new CalendarDate(2024, 3, 1), end: new CalendarDate(2024, 6, 1) }"
  :min-value="new CalendarDate(2024, 2, 1)"
  :max-value="new CalendarDate(2024, 10, 1)"
/>
```

## Disabled

<div class="docs-example">
  <MonthRangePicker :default-value="defaultValue" :disabled="true" />
</div>

```vue-html
<MonthRangePicker :disabled="true" />
```

## Props

<PropsTable name="MonthRangePicker" />

## Slots

<SlotsTable name="MonthRangePicker" />

## Events

<EventsTable name="MonthRangePicker" />

## Accessibility

`MonthRangePicker` is built on Reka UI's `MonthRangePicker` primitive family.

- **Role.** The root renders `role="application"`; each month cell is a grid cell with a
  button trigger.
- **Keyboard.** Arrow keys move focus between month cells; `Enter`/`Space` sets the start
  (first press) or end (second press) of the range. Prev/Next navigation buttons step the
  visible year backward/forward.
- **Range announcement.** Reka's built-in ARIA wiring marks the selected range's start and end
  cells distinctly from the months between them, so assistive technology can distinguish the
  range boundaries from the filled track.
- **Disabled/unavailable months.** `isMonthDisabled` and `isMonthUnavailable` mark specific
  months as non-interactive or invalid respectively.
