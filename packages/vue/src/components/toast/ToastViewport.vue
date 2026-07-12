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
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
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
  /** Default duration for toasts in this provider (ms) */
  duration?: number
  /** Disable swipe gestures for all toasts in this provider */
  disableSwipe?: boolean
  /** Distance in pixels before a swipe is recognised */
  swipeThreshold?: number
  /** Render viewport as a different element */
  as?: string
  /** Merge viewport props onto child element */
  asChild?: boolean
  /** Per-slot class name overrides */
  classNames?: Partial<{
    toast: ClassValue
    content: ClassValue
    title: ClassValue
    description: ClassValue
    actions: ClassValue
    action: ClassValue
    close: ClassValue
  }>
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
  <RekaToastProvider
    :swipe-direction="swipeDirection"
    :duration="props.duration"
    :disable-swipe="props.disableSwipe"
    :swipe-threshold="props.swipeThreshold"
  >
    <RekaToastViewport
      :hotkey="hotkey"
      :label="label"
      :as="props.as"
      :as-child="props.asChild"
      :class="composeClassName(styles.region(), props.class)"
    >
      <Toast
        v-for="toast in viewportToasts"
        :key="toast.id"
        :open="toast.open"
        :duration="toast.duration"
        :position="toast.position"
        :variant="toast.variant"
        :class="composeClassName(props.classNames?.toast)"
        @update:open="(open) => handleOpenChange(toast.id, open)"
      >
        <div :class="composeClassName(styles.content(), props.classNames?.content)">
          <ToastTitle :class="composeClassName(props.classNames?.title)">
            {{ toast.title }}
          </ToastTitle>
          <ToastDescription
            v-if="toast.description"
            :class="composeClassName(props.classNames?.description)"
          >
            {{ toast.description }}
          </ToastDescription>
        </div>
        <div :class="composeClassName('flex shrink-0 items-center gap-1 ml-auto', props.classNames?.actions)">
          <ToastAction
            v-if="toast.action"
            :alt-text="toast.action.label"
            :class="composeClassName(props.classNames?.action)"
            @click="toast.action!.onClick"
          >
            {{ toast.action.label }}
          </ToastAction>
          <ToastClose
            :class="composeClassName(props.classNames?.close)"
            @click="dismiss(toast.id)"
          />
        </div>
      </Toast>
      <slot />
    </RekaToastViewport>
  </RekaToastProvider>
</template>
