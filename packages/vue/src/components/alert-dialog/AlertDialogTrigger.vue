<script setup lang="ts">
import { AlertDialogTrigger } from 'reka-ui'

const props = withDefaults(defineProps<{
  asChild?: boolean
}>(), {
  asChild: false,
})
</script>

<template>
  <AlertDialogTrigger :as-child="props.asChild">
    <slot />
  </AlertDialogTrigger>
</template>
