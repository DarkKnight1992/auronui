<script setup lang="ts">
import { DialogTitle } from 'reka-ui'
import { modalVariants } from '@auronui/styles/components/modal'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  class?: string
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
