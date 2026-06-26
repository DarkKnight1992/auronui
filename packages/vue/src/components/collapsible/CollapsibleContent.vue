<script setup lang="ts">
import { CollapsibleContent } from 'reka-ui'
import { useCollapsibleInject } from './collapsible.context'
import { motion, AnimatePresence } from '../../utils/motion'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = defineProps<{
  /** Override the default class for the root element. */
  class?: ClassValue
  /** Override classes for individual slots. */
  classNames?: Partial<{
    body: ClassValue
    bodyInner: ClassValue
  }>
  /** Render as a different element type. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>()

const emit = defineEmits<{
  'content-found': []
}>()

const ctx = useCollapsibleInject()
</script>

<template>
  <CollapsibleContent
    :force-mount="true"
    :as="props.as"
    :as-child="props.asChild"
    :class="props.class || undefined"
    @content-found="emit('content-found')"
  >
    <AnimatePresence>
      <motion.div
        v-if="ctx.isOpen.value"
        key="panel"
        :initial="{ height: 0, opacity: 0 }"
        :animate="{ height: 'auto', opacity: 1 }"
        :exit="{ height: 0, opacity: 0 }"
        :transition="{ duration: 0.2, ease: 'easeOut' }"
        style="overflow: hidden;"
        :class="composeClassName(ctx.slotFns.value.body(), props.classNames?.body)"
      >
        <div :class="composeClassName(ctx.slotFns.value.bodyInner(), props.classNames?.bodyInner)">
          <slot />
        </div>
      </motion.div>
    </AnimatePresence>
  </CollapsibleContent>
</template>
