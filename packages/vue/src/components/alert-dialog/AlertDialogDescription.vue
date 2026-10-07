<script setup lang="ts">
import { AlertDialogDescription } from 'reka-ui'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  class?: ClassValue
  asChild?: boolean
}>(), {
  as: 'p',
  asChild: false,
})
</script>

<template>
  <AlertDialogDescription
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(props.class)"
  >
    <slot />
  </AlertDialogDescription>
</template>
