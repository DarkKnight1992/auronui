<script setup lang="ts">
import { DialogPortal, DialogContent, injectDialogRootContext } from 'reka-ui'
import { motion, AnimatePresence } from 'motion-v'
import { modalVariants } from '@auronui/styles/components/modal'
import { composeClassName } from '../../utils/composeClassName'
import { useModalInject } from './Modal.vue'
import ModalOverlay from './ModalOverlay.vue'

const props = withDefaults(defineProps<{
  class?: string
}>(), {})

const emit = defineEmits<{
  'escape-key-down': [event: KeyboardEvent]
  'pointer-down-outside': [event: Event]
  'interact-outside': [event: Event]
  'open-auto-focus': [event: Event]
  'close-auto-focus': [event: Event]
}>()

// Inject context from Modal root
const ctx = useModalInject({ size: 'md', scroll: 'inside', variant: 'opaque', placement: 'auto' })

// Inject Reka's dialog root context to read open state for AnimatePresence
const dialogRootContext = injectDialogRootContext()

const styles = modalVariants()
</script>

<template>
  <DialogPortal>
    <div class="modal__portal">
    <ModalOverlay />
    <DialogContent
      :class="composeClassName(styles.container({ scroll: ctx.scroll }), props.class)"
      :data-placement="ctx.placement"
      :aria-hidden="!dialogRootContext.open.value || undefined"
      @escape-key-down="emit('escape-key-down', $event)"
      @pointer-down-outside="emit('pointer-down-outside', $event)"
      @interact-outside="emit('interact-outside', $event)"
      @open-auto-focus="emit('open-auto-focus', $event)"
      @close-auto-focus="emit('close-auto-focus', $event)"
    >
      <AnimatePresence>
        <motion.div
          v-if="dialogRootContext.open.value"
          :class="composeClassName(styles.dialog({ size: ctx.size, scroll: ctx.scroll }), 'modal-content-inner')"
          :data-placement="ctx.placement"
          :initial="{ opacity: 0, scale: 0.95, y: -10 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95, y: -10 }"
          :transition="{ duration: 0.2, ease: 'easeOut' }"
        >
          <slot />
        </motion.div>
      </AnimatePresence>
    </DialogContent>
    </div>
  </DialogPortal>
</template>
