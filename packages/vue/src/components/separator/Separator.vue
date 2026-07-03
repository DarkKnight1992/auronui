<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { separatorVariants, type SeparatorVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  orientation?: SeparatorVariants['orientation']
  variant?: SeparatorVariants['variant']
  class?: string
  /** Per-slot class overrides */
  classNames?: Partial<{
    line: ClassValue
    content: ClassValue
  }>
}>(), {
  orientation: 'horizontal',
  variant: 'default',
})

const slots = useSlots()
const hasLabel = computed(() => !!slots.default)
const slotFns = computed(() => separatorVariants({ orientation: props.orientation, variant: props.variant }))
const classes = computed(() =>
  composeClassName(slotFns.value.base(), props.class)
)
</script>

<template>
  <hr
    v-if="props.orientation !== 'vertical' && !hasLabel"
    :class="classes"
  >
  <div
    v-else-if="props.orientation === 'vertical'"
    :class="classes"
    role="separator"
    aria-orientation="vertical"
  />
  <div
    v-else
    :class="classes"
    role="separator"
    aria-orientation="horizontal"
  >
    <div :class="composeClassName(slotFns.line(), props.classNames?.line)" />
    <div :class="composeClassName(slotFns.content(), props.classNames?.content)">
      <slot />
    </div>
    <div :class="composeClassName(slotFns.line(), props.classNames?.line)" />
  </div>
</template>
