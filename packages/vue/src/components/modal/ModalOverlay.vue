<script setup lang="ts">
import { DialogOverlay, injectDialogRootContext } from 'reka-ui'
import { modalVariants } from '@auronui/styles/components/modal'
import { composeClassName } from '../../utils/composeClassName'
import { useOverlayLayer } from '../../composables/useOverlayLayer'
import { useModalInject } from './Modal.vue'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  forceMount?: boolean
  class?: string
}>(), {
  asChild: false,
  forceMount: false,
})

const ctx = useModalInject({ size: 'md', scroll: 'inside', variant: 'opaque', placement: 'auto' })
const styles = modalVariants()

const dialogRootContext = injectDialogRootContext()
const { backdropZIndex } = useOverlayLayer(dialogRootContext, dialogRootContext.open)
</script>

<template>
  <DialogOverlay
    :as="props.as"
    :as-child="props.asChild"
    :force-mount="props.forceMount"
    :class="composeClassName(styles.backdrop({ variant: ctx.variant }), props.class)"
    :style="{ '--z-modal-backdrop': backdropZIndex }"
  />
</template>
