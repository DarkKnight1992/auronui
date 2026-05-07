<script setup lang="ts">
import { ComboboxPortal, ComboboxContent, ComboboxViewport, injectComboboxRootContext } from 'reka-ui'
import { motion, AnimatePresence } from 'motion-v'
import { useComboBoxInject } from './ComboBox.context'

const props = withDefaults(defineProps<{
  sideOffset?: number
  class?: string
}>(), {
  sideOffset: 8,
  class: undefined,
})

const ctx = useComboBoxInject()
const comboboxRootContext = injectComboboxRootContext()
</script>

<template>
  <ComboboxPortal>
    <AnimatePresence>
      <ComboboxContent
        v-if="comboboxRootContext.open.value"
        position="popper"
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
          <ComboboxViewport data-slot="list-box">
            <slot />
            <slot name="empty" />
          </ComboboxViewport>
        </motion.div>
      </ComboboxContent>
    </AnimatePresence>
  </ComboboxPortal>
</template>
