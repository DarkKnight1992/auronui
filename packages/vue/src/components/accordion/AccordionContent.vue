<script setup lang="ts">
import { AccordionContent as RekaAccordionContent, injectAccordionItemContext } from 'reka-ui'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useAccordionInject } from './accordion.context'
import { motion } from '../../utils/motion'

const props = defineProps<{
  class?: ClassValue
  /** Per-slot class overrides */
  classNames?: Partial<{
    body: ClassValue
    bodyInner: ClassValue
  }>
  as?: string
  asChild?: boolean
}>()
const ctx = useAccordionInject()
const rekaItem = injectAccordionItemContext()
</script>

<template>
  <RekaAccordionContent
    :force-mount="true"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(ctx.slotFns.value.body(), props.class, props.classNames?.body)"
  >
    <motion.div
      :initial="false"
      :animate="rekaItem.open.value ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }"
      :transition="{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }"
      style="overflow: hidden;"
    >
      <div :class="composeClassName(ctx.slotFns.value.bodyInner(), props.classNames?.bodyInner)">
        <slot />
      </div>
    </motion.div>
  </RekaAccordionContent>
</template>
