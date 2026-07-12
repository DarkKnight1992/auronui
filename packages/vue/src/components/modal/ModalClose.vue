<script setup lang="ts">
import { DialogClose } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  class?: string
}>(), {
  asChild: false,
})
</script>

<template>
  <DialogClose
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(props.class)"
  >
    <slot />
  </DialogClose>
</template>
