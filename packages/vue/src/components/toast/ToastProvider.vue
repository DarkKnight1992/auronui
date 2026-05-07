<script setup lang="ts">
/**
 * ToastProvider — Must be mounted once at app root (D-13).
 *
 * Wraps Reka UI's ToastProvider to set up the toast accessibility context.
 * Place this component high in the component tree, typically in App.vue:
 *
 * ```vue
 * <template>
 *   <ToastProvider>
 *     <RouterView />
 *     <ToastViewport />
 *   </ToastProvider>
 * </template>
 * ```
 */
import { ToastProvider as RekaToastProvider } from 'reka-ui'

withDefaults(defineProps<{
  /** Screen reader label for toast announcements */
  label?: string
  /** Default auto-dismiss duration in ms for all toasts */
  duration?: number
  /** Disable swipe-to-dismiss gesture */
  disableSwipe?: boolean
  /** Direction of swipe that dismisses the toast */
  swipeDirection?: 'up' | 'down' | 'left' | 'right'
  /** Swipe distance threshold in pixels before close triggers */
  swipeThreshold?: number
}>(), {
  label: 'Notification',
  duration: 5000,
  disableSwipe: false,
  swipeDirection: 'right',
  swipeThreshold: 50,
})
</script>

<template>
  <RekaToastProvider
    :label="label"
    :duration="duration"
    :disable-swipe="disableSwipe"
    :swipe-direction="swipeDirection"
    :swipe-threshold="swipeThreshold"
  >
    <slot />
  </RekaToastProvider>
</template>
