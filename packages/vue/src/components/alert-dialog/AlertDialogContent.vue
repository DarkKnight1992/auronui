<script setup lang="ts">
import { AlertDialogPortal, AlertDialogContent } from 'reka-ui'
import { alertDialogVariants } from '@auronui/styles/components/alert-dialog'
import { composeClassName } from '../../utils/composeClassName'
import { useAlertDialogInject } from './AlertDialog.vue'
import AlertDialogOverlay from './AlertDialogOverlay.vue'

const props = withDefaults(defineProps<{
  class?: string
}>(), {})

const emit = defineEmits<{
  'escape-key-down': [event: KeyboardEvent]
  'open-auto-focus': [event: Event]
  'close-auto-focus': [event: Event]
}>()

const ctx = useAlertDialogInject({ size: 'md', variant: 'opaque', placement: 'center', status: 'danger' })
const styles = alertDialogVariants()
</script>

<template>
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <div
      :class="styles.container()"
      :data-placement="ctx.placement"
    >
      <AlertDialogContent
        :class="composeClassName(styles.dialog({ size: ctx.size }), props.class)"
        :data-placement="ctx.placement"
        @escape-key-down="emit('escape-key-down', $event)"
        @open-auto-focus="emit('open-auto-focus', $event)"
        @close-auto-focus="emit('close-auto-focus', $event)"
      >
        <slot />
      </AlertDialogContent>
    </div>
  </AlertDialogPortal>
</template>
