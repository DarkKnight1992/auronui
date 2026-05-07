<script setup lang="ts">
import { AlertDialogTitle } from 'reka-ui'
import { alertDialogVariants } from '@auronui/styles/components/alert-dialog'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  class?: string
}>(), {
  as: 'h2',
})

const styles = alertDialogVariants()
</script>

<template>
  <AlertDialogTitle
    :as="props.as"
    :class="composeClassName(styles.heading(), props.class)"
  >
    <slot />
  </AlertDialogTitle>
</template>
