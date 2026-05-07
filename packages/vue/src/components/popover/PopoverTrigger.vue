<script setup lang="ts">
import { PopoverTrigger } from 'reka-ui'

const props = defineProps<{
  asChild?: boolean
  as?: string | object
}>()
</script>

<template>
  <PopoverTrigger
    :as-child="props.asChild"
    :as="props.as"
    v-bind="$attrs"
  >
    <slot />
  </PopoverTrigger>
</template>
