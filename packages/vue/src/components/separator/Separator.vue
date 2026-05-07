<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { separatorVariants, type SeparatorVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  orientation?: SeparatorVariants['orientation']
  variant?: SeparatorVariants['variant']
  class?: string
}>(), {
  orientation: 'horizontal',
  variant: 'default',
})

const slots = useSlots()
const hasLabel = computed(() => !!slots.default)
const classes = computed(() =>
  composeClassName(separatorVariants({ orientation: props.orientation, variant: props.variant }), props.class)
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
    <div class="separator__line" />
    <div class="separator__content">
      <slot />
    </div>
    <div class="separator__line" />
  </div>
</template>
