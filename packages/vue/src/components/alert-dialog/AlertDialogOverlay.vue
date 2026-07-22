<script setup lang="ts">
import { AlertDialogOverlay, injectDialogRootContext } from 'reka-ui'
import { alertDialogVariants } from '@auronui/styles/components/alert-dialog'
import { composeClassName } from '../../utils/composeClassName'
import { useOverlayLayer } from '../../composables/useOverlayLayer'
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

// AlertDialogRoot renders reka-ui's DialogRoot internally, so this injects
// the same context key Modal/Drawer use — see useOverlayLayer for why.
const dialogRootContext = injectDialogRootContext()
const { backdropZIndex } = useOverlayLayer(dialogRootContext, dialogRootContext.open)
</script>

<template>
  <AlertDialogOverlay
    :as="props.as"
    :as-child="props.asChild"
    :force-mount="props.forceMount"
    :class="composeClassName(styles.backdrop({ variant: ctx.variant }), props.class)"
    :style="{ '--z-modal-backdrop': backdropZIndex }"
  />
</template>
