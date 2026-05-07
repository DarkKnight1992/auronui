<script setup lang="ts">
import { AccordionTrigger as RekaAccordionTrigger } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'
import { useAccordionInject } from './accordion.context'
import { useAccordionItemInject } from './accordion-item.context'

const props = defineProps<{ class?: string }>()
const ctx = useAccordionInject()
const item = useAccordionItemInject()
</script>

<template>
  <RekaAccordionTrigger :class="composeClassName(ctx.slotFns.value.trigger(), props.class)">
    <slot />
    <!--
      Indicator slot. Users can replace the chevron with any icon.
      The wrapper keeps the rotation + color transition, so users only
      need to supply the icon contents. For full control (custom rotation
      behaviour etc.), spread the slot's `open` prop.
    -->
    <span
      :class="ctx.slotFns.value.indicator()"
      aria-hidden="true"
    >
      <slot
        name="indicator"
        :open="item.open.value"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          focusable="false"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </slot>
    </span>
  </RekaAccordionTrigger>
</template>
