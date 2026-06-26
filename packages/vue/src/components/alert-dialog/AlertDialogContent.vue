<script setup lang="ts">
import { AlertDialogPortal, AlertDialogContent } from 'reka-ui'
import { alertDialogVariants } from '@auronui/styles/components/alert-dialog'
import { composeClassName } from '../../utils/composeClassName'
import { useAlertDialogInject } from './AlertDialog.vue'
import AlertDialogOverlay from './AlertDialogOverlay.vue'

const props = withDefaults(defineProps<{
  class?: string
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
</script>

<template>
  <AlertDialogPortal :to="props.to" :disabled="props.disabled" :defer="props.defer" :force-mount="props.forceMount">
    <AlertDialogOverlay />
    <div
      :class="styles.container()"
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
