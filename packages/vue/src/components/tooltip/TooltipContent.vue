<script setup lang="ts">
import { TooltipPortal, TooltipContent, injectTooltipRootContext } from 'reka-ui'
import { motion, AnimatePresence } from 'motion-v'
import { tooltipVariants } from '@auronui/styles/components/tooltip'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  avoidCollisions?: boolean
  class?: string
}>(), {
  side: 'top',
  sideOffset: 8,
  align: 'center',
  alignOffset: 0,
  avoidCollisions: true,
})

// Inject the Tooltip root context to read open state for AnimatePresence
const rootContext = injectTooltipRootContext()

const styles = tooltipVariants()
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      :force-mount="true"
      :side="props.side"
      :side-offset="props.sideOffset"
      :align="props.align"
      :align-offset="props.alignOffset"
      :avoid-collisions="props.avoidCollisions"
      v-bind="$attrs"
    >
      <AnimatePresence>
        <motion.div
          v-if="rootContext.open.value"
          :key="'tooltip-content'"
          :class="composeClassName(styles.base(), props.class)"
          :initial="{ opacity: 0, scale: 0.9 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.9 }"
          :transition="{ duration: 0.1, ease: 'easeOut' }"
        >
          <slot />
        </motion.div>
      </AnimatePresence>
    </TooltipContent>
  </TooltipPortal>
</template>
