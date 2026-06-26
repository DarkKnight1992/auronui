<script setup lang="ts">
import { CollapsibleTrigger } from 'reka-ui'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useCollapsibleInject } from './collapsible.context'

const props = defineProps<{
  class?: ClassValue
  /** Classnames for individual slots */
  classNames?: Partial<{
    trigger: ClassValue
    indicator: ClassValue
  }>
  /** Render as a different element type. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>()
const ctx = useCollapsibleInject()
</script>

<template>
  <CollapsibleTrigger :as="props.as" :as-child="props.asChild" :class="composeClassName(ctx.slotFns.value.trigger(), props.class, props.classNames?.trigger)">
    <slot />
    <span
      :class="composeClassName(ctx.slotFns.value.indicator(), props.classNames?.indicator)"
      :data-state="ctx.isOpen.value ? 'open' : 'closed'"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  </CollapsibleTrigger>
</template>
