<script setup lang="ts">
import { PopoverClose } from 'reka-ui'

const props = defineProps<{
  as?: string | object
  asChild?: boolean
  disabled?: boolean
  class?: string
}>()
</script>

<template>
  <PopoverClose
    :as="props.as"
    :as-child="props.asChild"
    :disabled="props.disabled"
    :class="props.class"
    v-bind="$attrs"
  >
    <slot />
  </PopoverClose>
</template>
