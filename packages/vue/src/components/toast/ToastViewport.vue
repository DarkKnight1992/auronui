<script setup lang="ts">
/**
 * ToastViewport — Renders toasts for one screen position.
 *
 * Each viewport wraps its own RekaToastProvider so its ToastRoot children
 * teleport to THIS viewport, not a shared one. Without an isolated provider
 * per viewport, all ToastRoots teleport to whichever viewport mounted last.
 *
 * Usage:
 * ```vue
 * <ToastProvider>
 *   <ToastViewport position="top-right" />
 *   <ToastViewport position="bottom-right" />
 * </ToastProvider>
 * ```
 */
import { computed } from 'vue'
import { ToastProvider as RekaToastProvider, ToastViewport as RekaToastViewport } from 'reka-ui'
import { toastVariants } from '@auronui/styles'
import type { ToastVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useToast } from '../../composables/useToast'
import Toast from './Toast.vue'
import ToastTitle from './ToastTitle.vue'
import ToastDescription from './ToastDescription.vue'
import ToastAction from './ToastAction.vue'
import ToastClose from './ToastClose.vue'

type ToastPosition = 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'

const props = withDefaults(defineProps<{
  position?: ToastPosition
  class?: string
  hotkey?: string[]
  label?: string
  swipeDirection?: 'up' | 'down' | 'left' | 'right'
}>(), {
  position: 'bottom-right',
  hotkey: () => ['F8'],
  label: 'Notifications ({hotkey})',
  swipeDirection: 'right',
})

const { toasts, dismiss, remove } = useToast()

function handleOpenChange(id: string, open: boolean) {
  if (!open) {
    dismiss(id)
    setTimeout(() => remove(id), 250)
  }
}

const placementVariant = computed<ToastVariants['placement']>(() => {
  const map: Record<ToastPosition, ToastVariants['placement']> = {
    'top-right': 'top end',
    'top-center': 'top',
    'top-left': 'top start',
    'bottom-right': 'bottom end',
    'bottom-center': 'bottom',
    'bottom-left': 'bottom start',
  }
  return map[props.position] ?? 'bottom end'
})

const styles = computed(() => toastVariants({ placement: placementVariant.value }))

const viewportToasts = computed(() =>
  toasts.value.filter((t) => (t.position ?? 'bottom-right') === props.position),
)
</script>

<template>
  <!-- Each viewport has its own isolated Reka provider so ToastRoot teleports here, not to a shared viewport -->
  <RekaToastProvider :swipe-direction="swipeDirection">
    <RekaToastViewport
      :hotkey="hotkey"
      :label="label"
      :class="composeClassName(styles.region(), props.class)"
    >
      <Toast
        v-for="toast in viewportToasts"
        :key="toast.id"
        :open="toast.open"
        :duration="toast.duration"
        :position="toast.position"
        :variant="toast.variant"
        @update:open="(open) => handleOpenChange(toast.id, open)"
      >
        <div :class="styles.content()">
          <ToastTitle>{{ toast.title }}</ToastTitle>
          <ToastDescription v-if="toast.description">
            {{ toast.description }}
          </ToastDescription>
        </div>
        <div class="flex shrink-0 items-center gap-1 ml-auto">
          <ToastAction
            v-if="toast.action"
            :alt-text="toast.action.label"
            @click="toast.action!.onClick"
          >
            {{ toast.action.label }}
          </ToastAction>
          <ToastClose @click="dismiss(toast.id)" />
        </div>
      </Toast>
      <slot />
    </RekaToastViewport>
  </RekaToastProvider>
</template>
