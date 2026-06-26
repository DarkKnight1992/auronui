<script setup lang="ts">
import { AlertDialogTitle } from 'reka-ui'
import { alertDialogVariants } from '@auronui/styles/components/alert-dialog'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  class?: string
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
