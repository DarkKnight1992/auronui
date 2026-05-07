<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { ToastRoot } from 'reka-ui'
import { toastVariants } from '@auronui/styles'
import type { ToastVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

type ToastPosition = 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'

const props = withDefaults(defineProps<{
  open?: boolean
  duration?: number
  position?: ToastPosition
  variant?: ToastVariants['variant']
  class?: string
}>(), {
  open: true,
  duration: 5000,
  position: 'bottom-right',
  variant: 'default',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
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
</script>

<template>
  <ToastRoot
    :open="internalOpen"
    :duration="duration"
    :class="composeClassName(styles.toast(), props.class)"
    @update:open="(val) => { if (!val) close() }"
    @pause="clearTimer"
    @resume="startTimer"
  >
    <slot />
  </ToastRoot>
</template>
