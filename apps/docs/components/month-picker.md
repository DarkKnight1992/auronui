---
title: MonthPicker
---

<script setup>
import { MonthPicker } from '@auronui/vue';
import { CalendarDate } from '@internationalized/date';
</script>

# MonthPicker

`MonthPicker` is a standalone month-selection grid, wrapping Reka UI's `MonthPicker` primitive
family. It renders all 12 months of a given year, with Prev/Next navigation stepping by year.
It shares its styling with `Calendar` and `CalendarYearPicker` (all three consume the same
`calendarVariants` slots), since `Calendar` already uses this same primitive internally as its
"drill up to pick a month" view — `MonthPicker` simply exposes that view as its own component.

## Default

<div class="docs-example">
  <MonthPicker :default-value="new CalendarDate(2024, 6, 1)" />
</div>

```vue-html
<MonthPicker />
```

## Min / max range

<div class="docs-example">
  <MonthPicker
    :default-value="new CalendarDate(2024, 6, 1)"
    :min-value="new CalendarDate(2024, 3, 1)"
    :max-value="new CalendarDate(2024, 9, 1)"
  />
</div>

```vue-html
<MonthPicker
  :default-value="new CalendarDate(2024, 6, 1)"
  :min-value="new CalendarDate(2024, 3, 1)"
  :max-value="new CalendarDate(2024, 9, 1)"
/>
```

## Disabled

<div class="docs-example">
  <MonthPicker :default-value="new CalendarDate(2024, 6, 1)" :disabled="true" />
</div>

```vue-html
<MonthPicker :disabled="true" />
```

## Props

<PropsTable name="MonthPicker" />

## Slots

<SlotsTable name="MonthPicker" />

## Events

<EventsTable name="MonthPicker" />

## Accessibility

`MonthPicker` is built on Reka UI's `MonthPicker` primitive family.

- **Role.** The root renders `role="application"`; each month cell is a grid cell with a
  button trigger.
- **Keyboard.** Arrow keys move focus between month cells; `Enter`/`Space` selects the focused
  month. Prev/Next navigation buttons step the visible year backward/forward.
- **Disabled/unavailable months.** `isMonthDisabled` and `isMonthUnavailable` mark specific
  months as non-interactive or invalid respectively, both reflected via `data-disabled`/
  `data-unavailable` attributes for styling and announced to assistive technology through
  Reka's built-in ARIA wiring.
- **`calendarLabel`.** Provide this prop to give the picker an accessible name distinct from
  its visible heading, useful when multiple pickers appear on one page.
