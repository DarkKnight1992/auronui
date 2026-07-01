<script setup lang="ts">
import { computed } from 'vue'
import { EditableCancelTrigger } from 'reka-ui'
import { editableVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = defineProps<{
  as?: string
  asChild?: boolean
  class?: ClassValue
}>()

const slotFns = computed(() => editableVariants())
</script>

<template>
  <EditableCancelTrigger
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.cancelTrigger(), props.class)"
    aria-label="Cancel"
  >
    <slot>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <line
          x1="18"
          y1="6"
          x2="6"
          y2="18"
        />
        <line
          x1="6"
          y1="6"
          x2="18"
          y2="18"
        />
      </svg>
    </slot>
  </EditableCancelTrigger>
</template>
