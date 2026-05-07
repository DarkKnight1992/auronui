<script setup lang="ts">
import { AlertDialogDescription } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  class?: string
}>(), {
  as: 'p',
})
</script>

<template>
  <AlertDialogDescription
    :as="props.as"
    :class="composeClassName(props.class)"
  >
    <slot />
  </AlertDialogDescription>
</template>
