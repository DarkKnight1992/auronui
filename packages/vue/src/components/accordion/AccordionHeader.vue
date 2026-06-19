<script setup lang="ts">
import { AccordionHeader as RekaAccordionHeader } from 'reka-ui'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useAccordionInject } from './accordion.context'

const props = defineProps<{
  /** Override classes on specific slots */
  class?: ClassValue
  classNames?: Partial<{
    heading: ClassValue
  }>
}>()
const ctx = useAccordionInject()
</script>

<template>
  <RekaAccordionHeader :class="composeClassName(ctx.slotFns.value.heading(), props.class, props.classNames?.heading)">
    <slot />
  </RekaAccordionHeader>
</template>
