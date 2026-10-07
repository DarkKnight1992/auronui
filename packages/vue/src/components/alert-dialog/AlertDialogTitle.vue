<script setup lang="ts">
import { AlertDialogTitle } from 'reka-ui'
import { alertDialogVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  class?: ClassValue
}>(), {
  as: 'h2',
  asChild: false,
})

const styles = alertDialogVariants()
</script>

<template>
  <AlertDialogTitle
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(styles.heading(), props.class)"
  >
    <slot />
  </AlertDialogTitle>
</template>
