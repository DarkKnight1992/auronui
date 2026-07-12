<script setup lang="ts">
import { AlertDialogTrigger } from 'reka-ui'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
}>(), {
  asChild: false,
})
</script>

<template>
  <AlertDialogTrigger
    :as="props.as"
    :as-child="props.asChild"
  >
    <slot />
  </AlertDialogTrigger>
</template>
