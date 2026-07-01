<script setup lang="ts">
import { computed } from 'vue'
import { EditablePreview } from 'reka-ui'
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
  <EditablePreview
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.preview(), props.class)"
  />
</template>
