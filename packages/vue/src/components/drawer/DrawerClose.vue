<script setup lang="ts">
import { DialogClose } from 'reka-ui'
import { drawerVariants } from '@auronui/styles/components/drawer'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  asChild?: boolean
  class?: string
}>(), {
  asChild: false,
})

const styles = drawerVariants()
</script>

<template>
  <DialogClose
    :as-child="props.asChild"
    :class="composeClassName(styles.closeTrigger(), props.class)"
  >
    <slot />
  </DialogClose>
</template>
