<!--
  TimelineItem — one entry in a Timeline: a dot, a connecting line to the
  next item, and a content area (title/description/timestamp, or fully
  custom via the default slot).
-->
<script setup lang="ts">
import { computed } from 'vue'
import { timelineVariants, type TimelineVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useTimelineInject } from './timeline.context'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    timestamp?: string
    status?: TimelineVariants['status']
    color?: TimelineVariants['color']
    class?: ClassValue
    classNames?: Partial<{
      item: ClassValue
      dot: ClassValue
      line: ClassValue
      content: ClassValue
      title: ClassValue
      description: ClassValue
      timestamp: ClassValue
    }>
  }>(),
  {
    title: undefined,
    description: undefined,
    timestamp: undefined,
    status: 'pending',
    color: undefined,
    class: undefined,
    classNames: undefined,
  },
)

const ctx = useTimelineInject({
  orientation: computed(() => 'vertical'),
})

const slotFns = computed(() =>
  timelineVariants({ orientation: ctx.orientation.value, status: props.status, color: props.color }),
)
</script>

<template>
  <div
    :class="composeClassName(slotFns.item(), props.class, props.classNames?.item)"
    data-slot="timeline-item"
    role="listitem"
  >
    <span
      :class="composeClassName(slotFns.dot(), props.classNames?.dot)"
      data-slot="timeline-dot"
      aria-hidden="true"
    >
      <slot name="icon" />
    </span>
    <span
      :class="composeClassName(slotFns.line(), props.classNames?.line)"
      data-slot="timeline-line"
      aria-hidden="true"
    />
    <div
      :class="composeClassName(slotFns.content(), props.classNames?.content)"
      data-slot="timeline-content"
    >
      <slot>
        <span
          v-if="title"
          :class="composeClassName(slotFns.title(), props.classNames?.title)"
          data-slot="timeline-title"
        >{{ title }}</span>
        <span
          v-if="description"
          :class="composeClassName(slotFns.description(), props.classNames?.description)"
          data-slot="timeline-description"
        >{{ description }}</span>
        <span
          v-if="timestamp"
          :class="composeClassName(slotFns.timestamp(), props.classNames?.timestamp)"
          data-slot="timeline-timestamp"
        >{{ timestamp }}</span>
      </slot>
    </div>
  </div>
</template>
