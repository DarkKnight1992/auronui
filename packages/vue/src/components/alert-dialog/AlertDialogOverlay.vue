<script setup lang="ts">
import { AlertDialogOverlay } from 'reka-ui'
import { alertDialogVariants } from '@auronui/styles/components/alert-dialog'
import { composeClassName } from '../../utils/composeClassName'
import { useAlertDialogInject } from './AlertDialog.vue'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  forceMount?: boolean
  class?: string
}>(), {
  asChild: false,
  forceMount: false,
})

const ctx = useAlertDialogInject({ size: 'md', variant: 'opaque', placement: 'center', status: 'danger' })
const styles = alertDialogVariants()
</script>

<template>
  <AlertDialogOverlay
    :as="props.as"
    :as-child="props.asChild"
    :force-mount="props.forceMount"
    :class="composeClassName(styles.backdrop({ variant: ctx.variant }), props.class)"
  />
</template>
