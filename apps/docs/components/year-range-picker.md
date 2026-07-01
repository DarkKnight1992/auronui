---
title: YearRangePicker
---

<script setup>
import { YearRangePicker } from '@auronui/vue';
import { CalendarDate } from '@internationalized/date';

const defaultValue = { start: new CalendarDate(2020, 1, 1), end: new CalendarDate(2024, 1, 1) };
</script>

# YearRangePicker

`YearRangePicker` is a year-range selection grid, wrapping Reka UI's `YearRangePicker`
primitive family. It renders a page of years (12 per page by default) with Prev/Next
navigation stepping by page, and highlights a contiguous range between a start and end year.

## Default

<div class="docs-example">
  <YearRangePicker :default-value="defaultValue" />
</div>

```vue-html
<YearRangePicker />
```

## Min / max range

<div class="docs-example">
  <YearRangePicker
    :default-value="{ start: new CalendarDate(2020, 1, 1), end: new CalendarDate(2022, 1, 1) }"
    :min-value="new CalendarDate(2018, 1, 1)"
    :max-value="new CalendarDate(2030, 1, 1)"
  />
</div>

```vue-html
<YearRangePicker
  :default-value="{ start: new CalendarDate(2020, 1, 1), end: new CalendarDate(2022, 1, 1) }"
  :min-value="new CalendarDate(2018, 1, 1)"
  :max-value="new CalendarDate(2030, 1, 1)"
/>
```

## Custom years per page

<div class="docs-example">
  <YearRangePicker
    :default-value="{ start: new CalendarDate(2020, 1, 1), end: new CalendarDate(2022, 1, 1) }"
    :years-per-page="9"
  />
</div>

```vue-html
<YearRangePicker :years-per-page="9" />
```

## Disabled

<div class="docs-example">
  <YearRangePicker :default-value="defaultValue" :disabled="true" />
</div>

```vue-html
<YearRangePicker :disabled="true" />
```

## Props

<PropsTable name="YearRangePicker" />

## Slots

<SlotsTable name="YearRangePicker" />

## Events

<EventsTable name="YearRangePicker" />

## Accessibility

`YearRangePicker` is built on Reka UI's `YearRangePicker` primitive family.

- **Role.** The root renders `role="application"`; each year cell is a grid cell with a
  button trigger.
- **Keyboard.** Arrow keys move focus between year cells; `Enter`/`Space` sets the start
  (first press) or end (second press) of the range. Prev/Next navigation buttons step the
  visible year page backward/forward.
- **Range announcement.** Reka's built-in ARIA wiring marks the selected range's start and end
  cells distinctly from the years between them, so assistive technology can distinguish the
  range boundaries from the filled track.
- **Disabled/unavailable years.** `isYearDisabled` and `isYearUnavailable` mark specific years
  as non-interactive or invalid respectively.
