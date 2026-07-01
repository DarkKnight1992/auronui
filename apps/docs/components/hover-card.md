---
title: HoverCard
---

<script setup>
import { Link, HoverCard, HoverCardTrigger, HoverCardContent, HoverCardArrow } from '@auronui/vue';
</script>

# HoverCard

`HoverCard` shows rich preview content when a user hovers (or focuses) a trigger, without
requiring a click. It wraps Reka UI's `HoverCard` primitive family and is visually and
structurally similar to [`Popover`](./popover) — the difference is the open trigger (hover vs.
click) and the default open/close delays.

## Default

A bare `<HoverCard>` opens 700ms after the pointer enters the trigger, and closes 300ms after
it leaves.

<div class="docs-example">
  <HoverCard default-open="true">
    <HoverCardTrigger as-child>
      <Link href="#">@auronui</Link>
    </HoverCardTrigger>
    <HoverCardContent>
      <div style="padding: 16px; max-width: 280px;">
        <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 600;">Auron UI</h3>
        <p style="margin: 0; font-size: 13px; color: #555;">
          Vue 3 component library with full HeroUI visual parity.
        </p>
      </div>
    </HoverCardContent>
  </HoverCard>
</div>

```vue-html
<HoverCard>
  <HoverCardTrigger as-child>
    <Link href="#">@auronui</Link>
  </HoverCardTrigger>
  <HoverCardContent>
    <div style="padding: 16px; max-width: 280px;">
      <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 600;">Auron UI</h3>
      <p style="margin: 0; font-size: 13px; color: #555;">
        Vue 3 component library with full HeroUI visual parity.
      </p>
    </div>
  </HoverCardContent>
</HoverCard>
```

## Custom delays

Use `openDelay` and `closeDelay` (in milliseconds) to control how long the pointer must
dwell before the card opens or closes.

<div class="docs-example">
  <HoverCard :open-delay="100" :close-delay="100">
    <HoverCardTrigger as-child>
      <Link href="#">Quick hover</Link>
    </HoverCardTrigger>
    <HoverCardContent>
      <div style="padding: 12px 16px;">
        <p style="margin: 0; font-size: 13px;">Opens and closes after 100ms.</p>
      </div>
    </HoverCardContent>
  </HoverCard>
</div>

```vue-html
<HoverCard :open-delay="100" :close-delay="100">
  <HoverCardTrigger as-child>
    <Link href="#">Quick hover</Link>
  </HoverCardTrigger>
  <HoverCardContent>
    <div style="padding: 12px 16px;">
      <p style="margin: 0; font-size: 13px;">Opens and closes after 100ms.</p>
    </div>
  </HoverCardContent>
</HoverCard>
```

## With arrow

<div class="docs-example">
  <HoverCard default-open="true">
    <HoverCardTrigger as-child>
      <Link href="#">Hover for details</Link>
    </HoverCardTrigger>
    <HoverCardContent>
      <div style="padding: 12px 16px;">
        <p style="margin: 0; font-size: 13px;">This hover card has a directional arrow.</p>
      </div>
      <HoverCardArrow style="fill: white; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));" />
    </HoverCardContent>
  </HoverCard>
</div>

```vue-html
<HoverCard>
  <HoverCardTrigger as-child>
    <Link href="#">Hover for details</Link>
  </HoverCardTrigger>
  <HoverCardContent>
    <div style="padding: 12px 16px;">
      <p style="margin: 0; font-size: 13px;">This hover card has a directional arrow.</p>
    </div>
    <HoverCardArrow style="fill: white; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));" />
  </HoverCardContent>
</HoverCard>
```

## Props

<PropsTable name="HoverCard" />

## Slots

<SlotsTable name="HoverCard" />

## Events

<EventsTable name="HoverCard" />

## Accessibility

`HoverCard` is built on Reka UI's `HoverCard` primitive family.

- **Role.** The trigger keeps its native semantics (e.g. `<a>` via `as-child`); the content
  panel is portalled and positioned like a popover.
- **Keyboard.** Focusing the trigger (via `Tab`) also opens the card, so keyboard-only users
  are not excluded from hover-only content. `Escape` closes an open card and returns focus to
  the trigger.
- **Pointer behavior.** The card opens after `openDelay` ms of continuous hover and stays open
  while the pointer is over the trigger or the content; it closes `closeDelay` ms after the
  pointer leaves both.
- **Not for essential content.** Because opening depends on a delay, do not put content in a
  `HoverCard` that's required to complete a task — pair it with an always-visible affordance
  (e.g. a link, as in the examples above) so the underlying trigger is usable on its own.
