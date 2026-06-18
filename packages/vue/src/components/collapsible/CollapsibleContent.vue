<script setup lang="ts">
import { CollapsibleContent } from 'reka-ui'
import { useCollapsibleInject } from './collapsible.context'
import { motion, AnimatePresence } from '../../utils/motion'

const props = defineProps<{
  /** Override the default class for the root element. */
  class?: string
  /** Override classes for individual slots. */
  classNames?: Partial<{
    body: string
    bodyInner: string
  }>
}>()
const ctx = useCollapsibleInject()
</script>

<template>
  <CollapsibleContent
    :force-mount="true"
    :class="props.class || undefined"
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
