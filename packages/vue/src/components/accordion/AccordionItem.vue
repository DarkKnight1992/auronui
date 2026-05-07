<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { AccordionItem as RekaAccordionItem } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'
import { useAccordionInject } from './accordion.context'
import { useAccordionItemProvide } from './accordion-item.context'

const props = defineProps<{
  value: string
  disabled?: boolean
  class?: string
}>()

const ctx = useAccordionInject()

// Capture Reka's exposed per-item `open` ComputedRef via template ref and
// re-provide it downward so AccordionContent can drive its animation from
// synchronous Vue reactivity — no MutationObserver, no CSS-var race.
const rekaRef = useTemplateRef<{ open: { value: boolean } } | null>('reka')
const open = computed(() => rekaRef.value?.open?.value ?? false)
useAccordionItemProvide({ open })
</script>

<template>
  <RekaAccordionItem
    ref="reka"
    :value="props.value"
    :disabled="props.disabled"
    :class="composeClassName(ctx.slotFns.value.item(), props.class)"
  >
    <slot />
  </RekaAccordionItem>
</template>
