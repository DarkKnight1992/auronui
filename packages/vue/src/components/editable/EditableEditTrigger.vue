<script setup lang="ts">
import { computed } from 'vue'
import { EditableEditTrigger } from 'reka-ui'
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
  <EditableEditTrigger
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.editTrigger(), props.class)"
    aria-label="Edit"
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
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      </svg>
    </slot>
  </EditableEditTrigger>
</template>
