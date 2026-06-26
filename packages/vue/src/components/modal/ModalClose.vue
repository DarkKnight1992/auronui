<script setup lang="ts">
import { DialogClose } from 'reka-ui'
import { modalVariants } from '@auronui/styles/components/modal'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  class?: string
}>(), {
  asChild: false,
})

const styles = modalVariants()
</script>

<template>
  <DialogClose
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(styles.closeTrigger(), props.class)"
  >
    <slot />
  </DialogClose>
</template>
