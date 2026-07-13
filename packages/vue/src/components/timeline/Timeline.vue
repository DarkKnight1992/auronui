<!--
  Timeline — vertical (or horizontal) sequence of dated/stepped events:
  activity feeds, changelogs, order-status history. Read-only historical
  record — distinct from Stepper, which is an interactive process control.

  Pure presentational compound component, no Reka UI primitive backing
  (mirrors Card's compound-pattern complexity, not Stepper's).

  ─── Usage ──────────────────────────────────────────────────────────────
    <Timeline>
      <TimelineItem title="Order placed" timestamp="Jan 3" status="done" />
      <TimelineItem title="Shipped" timestamp="Jan 5" status="current" />
      <TimelineItem title="Delivered" status="pending" />
    </Timeline>
-->
<script setup lang="ts">
import { computed } from 'vue'
import { timelineVariants, type TimelineVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useTimelineProvide } from './timeline.context'

const props = withDefaults(
  defineProps<{
    orientation?: TimelineVariants['orientation']
    class?: ClassValue
    classNames?: Partial<{
      base: ClassValue
    }>
  }>(),
  {
    orientation: 'vertical',
    class: undefined,
    classNames: undefined,
  },
)

useTimelineProvide({
  orientation: computed(() => props.orientation),
})

const slotFns = computed(() => timelineVariants({ orientation: props.orientation }))
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    data-slot="timeline"
    role="list"
  >
    <slot />
  </div>
</template>
