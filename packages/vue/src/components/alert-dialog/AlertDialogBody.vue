<script setup lang="ts">
import { alertDialogVariants } from '@auronui/styles/components/alert-dialog'
import { composeClassName } from '../../utils/composeClassName'
import ScrollArea from '../scroll-area/ScrollArea.vue'

const props = withDefaults(defineProps<{
  class?: string
}>(), {})

const styles = alertDialogVariants()
</script>

<template>
  <ScrollArea
    :class="composeClassName(styles.body(), props.class)"
    viewport-class="pr-2"
  >
    <slot />
  </ScrollArea>
</template>
