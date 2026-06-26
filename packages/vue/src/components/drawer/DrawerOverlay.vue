<script setup lang="ts">
import { DialogOverlay } from 'reka-ui'
import { drawerVariants } from '@auronui/styles/components/drawer'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  forceMount?: boolean
  class?: string
}>(), {
  asChild: false,
  forceMount: false,
})

const styles = drawerVariants()
</script>

<template>
  <DialogOverlay
    :as="props.as"
    :as-child="props.asChild"
    :force-mount="props.forceMount"
    :class="composeClassName(styles.backdrop(), props.class)"
  />
</template>
