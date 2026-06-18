<script setup lang="ts">
import { computed, ref } from 'vue'
import { cardVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useCardInject } from './card.context'

const props = defineProps<{
  /**
   * Custom class to apply to the root element.
   */
  class?: string
  /**
   * Custom classes to apply to each slot.
   */
  classNames?: Partial<{
    content: string
  }>
}>()

const ctx = useCardInject({
  variant: ref('default'),
  shadow: ref('sm'),
  radius: ref('lg'),
  isHoverable: ref(false),
  isPressable: ref(false),
  isDisabled: ref(false),
  fullWidth: ref(false),
})
const slotFns = computed(() => cardVariants({ variant: ctx.variant.value }))
</script>

<template>
  <div :class="composeClassName(slotFns.content(), props.class, props.classNames?.content)">
    <slot />
  </div>
</template>
