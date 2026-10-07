<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { AlertDialogPortal, AlertDialogContent, injectDialogRootContext } from 'reka-ui'
import { alertDialogVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useOverlayLayer } from '../../composables/useOverlayLayer'
import { useMountWhilePresent } from '../../composables/useMountWhilePresent'
import { useAlertDialogInject } from './AlertDialog.vue'
import AlertDialogOverlay from './AlertDialogOverlay.vue'

const props = withDefaults(defineProps<{
  class?: ClassValue
  to?: string | HTMLElement
  disabled?: boolean
  defer?: boolean
  forceMount?: boolean
  disableOutsidePointerEvents?: boolean
  asChild?: boolean
  as?: string
}>(), {})

const emit = defineEmits<{
  'escape-key-down': [event: KeyboardEvent]
  'open-auto-focus': [event: Event]
  'close-auto-focus': [event: Event]
  'pointer-down-outside': [event: Event]
  'focus-outside': [event: Event]
  'interact-outside': [event: Event]
}>()

const ctx = useAlertDialogInject({ size: 'md', variant: 'opaque', placement: 'center', status: 'danger' })
const styles = alertDialogVariants()

// AlertDialogRoot renders reka-ui's DialogRoot internally, so this injects
// the same context key Modal/Drawer use — see useOverlayLayer for why.
const dialogRootContext = injectDialogRootContext()
const { panelZIndex } = useOverlayLayer(dialogRootContext, dialogRootContext.open)

// Only insert the container into <body> while open (or animating out) — see
// useMountWhilePresent for why a closed container breaks nested dialogs.
const containerEl = useTemplateRef<HTMLElement>('containerEl')
const { isMounted } = useMountWhilePresent(dialogRootContext.open, containerEl, {
  forceMount: () => !!props.forceMount,
})
</script>

<template>
  <AlertDialogPortal
    :to="props.to"
    :disabled="props.disabled"
    :defer="props.defer"
    :force-mount="props.forceMount"
  >
    <AlertDialogOverlay />
    <div
      v-if="isMounted()"
      ref="containerEl"
      :class="styles.container()"
      :style="{ '--z-modal': panelZIndex }"
      :data-placement="ctx.placement"
    >
      <AlertDialogContent
        :as="props.as"
        :as-child="props.asChild"
        :force-mount="props.forceMount"
        :disable-outside-pointer-events="props.disableOutsidePointerEvents"
        :class="composeClassName(styles.dialog({ size: ctx.size }), props.class)"
        :data-placement="ctx.placement"
        @escape-key-down="emit('escape-key-down', $event)"
        @open-auto-focus="emit('open-auto-focus', $event)"
        @close-auto-focus="emit('close-auto-focus', $event)"
        @pointer-down-outside="emit('pointer-down-outside', $event)"
        @focus-outside="emit('focus-outside', $event)"
        @interact-outside="emit('interact-outside', $event)"
      >
        <slot />
      </AlertDialogContent>
    </div>
  </AlertDialogPortal>
</template>
