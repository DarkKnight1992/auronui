<script setup lang="ts">
import { AccordionHeader as RekaAccordionHeader } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'
import { useAccordionInject } from './accordion.context'

const props = defineProps<{ class?: string }>()
const ctx = useAccordionInject()
</script>

<template>
  <RekaAccordionHeader :class="composeClassName(ctx.slotFns.value.heading(), props.class)">
    <slot />
  </RekaAccordionHeader>
</template>
