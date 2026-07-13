---
title: Timeline
---

<script setup>
import { Timeline, TimelineItem } from '@auronui/vue';
</script>

# Timeline

A read-only, chronological sequence of dated or stepped events — activity feeds, changelogs, order-status history. `Timeline` is a compound component: it renders the list container and shares its `orientation` with any number of `TimelineItem` children via context. Each `TimelineItem` renders a dot, a connecting line to the next item, and a content area (title/description/timestamp, or fully custom content via the default slot).

Timeline is purely presentational, historical record — for an interactive, navigable process control (e.g. a multi-step form), use `Stepper` instead.

## Example

<div class="docs-example">
  <Timeline>
    <TimelineItem title="Order placed" description="Confirmed via email" timestamp="Jan 3" status="done" />
    <TimelineItem title="Shipped" description="Left the warehouse" timestamp="Jan 5" status="current" color="primary" />
    <TimelineItem title="Delivered" description="Arrives at destination" timestamp="Jan 8" status="pending" />
  </Timeline>
</div>

## Props

<PropsTable name="Timeline" />

## Slots

<SlotsTable name="Timeline" />

## Events

<EventsTable name="Timeline" />

## Accessibility

- `Timeline` is a pure presentational compound component — it does not wrap a Reka UI primitive.
- The `Timeline` root renders `role="list"` (`data-slot="timeline"`), and each `TimelineItem` renders `role="listitem"` (`data-slot="timeline-item"`), giving assistive technology an accurate count and semantic grouping of entries.
- The dot (`data-slot="timeline-dot"`) and the connecting line (`data-slot="timeline-line"`) are purely decorative and are marked `aria-hidden="true"` on both, since the event's meaning is conveyed by the visible text content (title/description/timestamp), not the graphic.
- `status` (`done` / `current` / `pending`) and `color` only drive visual styling on the dot — they are not exposed as ARIA state and carry no semantic meaning to assistive technology. If the current/active step needs to be conveyed non-visually, include that information in the item's visible text (e.g. a "Shipped" title alongside its `current` status).
