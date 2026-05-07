<script setup lang="ts">
import {
  SelectContent,
  SelectViewport,
  SelectPortal,
  injectSelectRootContext,
} from 'reka-ui'
import { motion, AnimatePresence } from 'motion-v'
import { useSelectInject } from './Select.context'

const props = withDefaults(defineProps<{
  position?: 'item-aligned' | 'popper'
  sideOffset?: number
  class?: string
}>(), {
  position: 'popper',
  sideOffset: 8,
  class: undefined,
})

const ctx = useSelectInject()
const rootContext = injectSelectRootContext()
</script>

<template>
  <SelectPortal>
    <AnimatePresence>
      <SelectContent
        v-if="rootContext.open.value"
        :position="props.position"
        :side-offset="props.sideOffset"
        as-child
        data-slot="popover"
      >
        <motion.div
          :class="ctx.slots.value.popover()"
          :initial="{ opacity: 0, scale: 0.95 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15 }"
        >
          <SelectViewport data-slot="list-box">
            <slot />
          </SelectViewport>
        </motion.div>
      </SelectContent>
    </AnimatePresence>
  </SelectPortal>
</template>
