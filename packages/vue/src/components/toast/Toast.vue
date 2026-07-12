<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { ToastRoot } from 'reka-ui'
import { toastVariants } from '@auronui/styles'
import type { ToastVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useToastProvide } from './toast.context'

type ToastPosition = 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'

const props = withDefaults(defineProps<{
  open?: boolean
  duration?: number
  position?: ToastPosition
  variant?: ToastVariants['variant']
  class?: string
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean
  /** Keep mounted in DOM when closed */
  forceMount?: boolean
  /** Toast type: 'foreground' for urgent, 'background' for passive */
  type?: 'foreground' | 'background'
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>(), {
  open: true,
  duration: 5000,
  position: 'bottom-right',
  variant: 'default',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'escape-key-down': [event: KeyboardEvent]
  'pause': []
  'resume': []
  'swipe-start': [event: Event]
  'swipe-move': [event: Event]
  'swipe-cancel': [event: Event]
  'swipe-end': [event: Event]
}>()

const internalOpen = ref(props.open)

watch(() => props.open, (val) => {
  internalOpen.value = val
})

let dismissTimer: ReturnType<typeof setTimeout> | null = null

function startTimer() {
  if (props.duration && props.duration > 0) {
    dismissTimer = setTimeout(() => close(), props.duration)
  }
}

function clearTimer() {
  if (dismissTimer !== null) {
    clearTimeout(dismissTimer)
    dismissTimer = null
  }
}

function close() {
  internalOpen.value = false
  emit('update:open', false)
}

onMounted(() => startTimer())
onBeforeUnmount(() => clearTimer())

const placementVariant = computed<ToastVariants['placement']>(() => {
  const map: Record<ToastPosition, ToastVariants['placement']> = {
    'top-right': 'top end',
    'top-center': 'top',
    'top-left': 'top start',
    'bottom-right': 'bottom end',
    'bottom-center': 'bottom',
    'bottom-left': 'bottom start',
  }
  return map[props.position ?? 'bottom-right'] ?? 'bottom'
})

const styles = computed(() =>
  toastVariants({ placement: placementVariant.value, variant: props.variant }),
)

useToastProvide({
  variant: computed(() => props.variant),
})
</script>

<template>
  <ToastRoot
    :open="internalOpen"
    :duration="duration"
    :default-open="props.defaultOpen"
    :force-mount="props.forceMount"
    :type="props.type"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(styles.toast(), props.class)"
    @update:open="(val) => { if (!val) close() }"
    @escape-key-down="(e: KeyboardEvent) => emit('escape-key-down', e)"
    @pause="() => { clearTimer(); emit('pause') }"
    @resume="() => { startTimer(); emit('resume') }"
    @swipe-start="(e: Event) => emit('swipe-start', e)"
    @swipe-move="(e: Event) => emit('swipe-move', e)"
    @swipe-cancel="(e: Event) => emit('swipe-cancel', e)"
    @swipe-end="(e: Event) => emit('swipe-end', e)"
  >
    <slot />
  </ToastRoot>
</template>
