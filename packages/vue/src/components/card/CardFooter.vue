<script setup lang="ts">
import { computed, ref } from 'vue'
import { cardVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useCardInject } from './card.context'

const props = withDefaults(defineProps<{
  divider?: boolean
  class?: ClassValue
  /** Override the default classes applied to individual slots. */
  classNames?: Partial<{
    footer: ClassValue
  }>
}>(), { divider: false })

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
  <div :class="composeClassName(slotFns.footer(), divider && 'card__footer--divided', props.class, props.classNames?.footer)">
    <slot />
  </div>
</template>
