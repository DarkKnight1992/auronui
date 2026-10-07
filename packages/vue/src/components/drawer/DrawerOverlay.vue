<script setup lang="ts">
import { DialogOverlay, injectDialogRootContext } from 'reka-ui'
import { drawerVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useOverlayLayer } from '../../composables/useOverlayLayer'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  forceMount?: boolean
  class?: ClassValue
}>(), {
  asChild: false,
  forceMount: false,
})

const styles = drawerVariants()

const dialogRootContext = injectDialogRootContext()
const { backdropZIndex } = useOverlayLayer(dialogRootContext, dialogRootContext.open)
</script>

<template>
  <DialogOverlay
    :as="props.as"
    :as-child="props.asChild"
    :force-mount="props.forceMount"
    :class="composeClassName(styles.backdrop(), props.class)"
    :style="{ '--z-modal-backdrop': backdropZIndex }"
  />
</template>
