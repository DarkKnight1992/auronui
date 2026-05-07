<script setup lang="ts">
import { PopoverPortal, PopoverContent, injectPopoverRootContext } from 'reka-ui'
import { motion, AnimatePresence } from 'motion-v'
import { popoverVariants } from '@auronui/styles/components/popover'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  avoidCollisions?: boolean
  class?: string
}>(), {
  side: 'bottom',
  sideOffset: 8,
  align: 'center',
  alignOffset: 0,
  avoidCollisions: true,
})

const emit = defineEmits<{
  'escape-key-down': [event: KeyboardEvent]
  'pointer-down-outside': [event: Event]
  'focus-outside': [event: Event]
  'interact-outside': [event: Event]
}>()

// Inject the Popover root context to read open state
// This allows AnimatePresence to control mount/unmount based on open state
const rootContext = injectPopoverRootContext()

const styles = popoverVariants()
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      :force-mount="true"
      :side="props.side"
      :side-offset="props.sideOffset"
      :align="props.align"
      :align-offset="props.alignOffset"
      :avoid-collisions="props.avoidCollisions"
      v-bind="$attrs"
      @escape-key-down="emit('escape-key-down', $event)"
      @pointer-down-outside="emit('pointer-down-outside', $event)"
      @focus-outside="emit('focus-outside', $event)"
      @interact-outside="emit('interact-outside', $event)"
    >
      <AnimatePresence>
        <motion.div
          v-if="rootContext.open.value"
          :key="'popover-content'"
          :class="composeClassName(styles.base(), props.class)"
          :initial="{ opacity: 0, scale: 0.95 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15, ease: 'easeOut' }"
        >
          <slot />
        </motion.div>
      </AnimatePresence>
    </PopoverContent>
  </PopoverPortal>
</template>
