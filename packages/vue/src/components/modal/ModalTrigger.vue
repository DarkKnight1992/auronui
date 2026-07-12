<script setup lang="ts">
import { DialogTrigger } from 'reka-ui'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
}>(), {
  asChild: false,
})
</script>

<template>
  <DialogTrigger
    :as="props.as"
    :as-child="props.asChild"
  >
    <slot />
  </DialogTrigger>
</template>
