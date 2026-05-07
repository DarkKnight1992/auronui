<script setup lang="ts">
import { AccordionContent as RekaAccordionContent, injectAccordionItemContext } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'
import { useAccordionInject } from './accordion.context'
import { motion } from '../../utils/motion'

const props = defineProps<{ class?: string }>()
const ctx = useAccordionInject()
const rekaItem = injectAccordionItemContext()
</script>

<template>
  <RekaAccordionContent
    :force-mount="true"
    :class="composeClassName(ctx.slotFns.value.body(), props.class)"
  >
    <motion.div
      :initial="false"
      :animate="rekaItem.open.value ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }"
      :transition="{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }"
      style="overflow: hidden;"
    >
      <div :class="ctx.slotFns.value.bodyInner()">
        <slot />
      </div>
    </motion.div>
  </RekaAccordionContent>
</template>
