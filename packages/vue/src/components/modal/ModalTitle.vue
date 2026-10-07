<script setup lang="ts">
import { DialogTitle } from 'reka-ui'
import { modalVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  class?: ClassValue
}>(), {
  as: 'h2',
  asChild: false,
})

const styles = modalVariants()
</script>

<template>
  <DialogTitle
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(styles.heading(), props.class)"
  >
    <slot />
  </DialogTitle>
</template>
