<script setup lang="ts">
import { alertDialogVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import ScrollArea from '../scroll-area/ScrollArea.vue'

const props = withDefaults(defineProps<{
  class?: ClassValue
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
