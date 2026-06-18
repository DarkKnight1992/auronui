<script setup lang="ts">
import { AccordionHeader as RekaAccordionHeader } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'
import { useAccordionInject } from './accordion.context'

const props = defineProps<{
  /** Override classes on specific slots */
  class?: string
  classNames?: Partial<{
    heading: string
  }>
}>()
const ctx = useAccordionInject()
</script>

<template>
  <RekaAccordionHeader :class="composeClassName(ctx.slotFns.value.heading(), props.class, props.classNames?.heading)">
    <slot />
  </RekaAccordionHeader>
</template>
