<script setup lang="ts">
import type { ClassValue } from '../../utils/composeClassName'

defineProps<{
  for: string
  label?: string
  isRequired?: boolean
  class?: ClassValue
}>()
</script>

<template>
  <label
    v-if="label"
    :for="for"
    :class="class"
  >{{ label }}<span
      v-if="isRequired"
      aria-hidden="true"
    > *</span></label>
</template>
