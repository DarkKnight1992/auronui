<script setup lang="ts">
import { DialogTrigger } from 'reka-ui'

const props = withDefaults(defineProps<{
  asChild?: boolean
}>(), {
  asChild: false,
})
</script>

<template>
  <DialogTrigger :as-child="props.asChild">
    <slot />
  </DialogTrigger>
</template>
