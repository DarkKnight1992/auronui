<script setup lang="ts">
import { computed } from 'vue'
import { EditableSubmitTrigger } from 'reka-ui'
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
  <EditableSubmitTrigger
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.submitTrigger(), props.class)"
    aria-label="Save"
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
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </slot>
  </EditableSubmitTrigger>
</template>
