<script setup lang="ts">
import type { ClassValue } from '../../utils/composeClassName'

const props = defineProps<{
  for: string
  label?: string
  isRequired?: boolean
  class?: ClassValue
  /**
   * Optional id on the rendered label element itself — needed when a
   * consumer (e.g. a non-native widget root) points `aria-labelledby` at
   * this label instead of relying solely on `for`/`id` association.
   */
  id?: string
}>()
</script>

<template>
  <label
    v-if="label"
    :id="id"
    :for="props.for"
    :class="props.class"
  >{{ label }}<span
      v-if="isRequired"
      aria-hidden="true"
    > *</span></label>
</template>
