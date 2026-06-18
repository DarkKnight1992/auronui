<script setup lang="ts">
import { computed } from 'vue'
import { skeletonVariants, type SkeletonVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  animationType?: SkeletonVariants['animationType']
  class?: string
  /** Custom class overrides for named slots. */
  classNames?: Partial<{
    base: string
  }>
}>(), {
  animationType: 'shimmer',
})

const slotFns = computed(() => skeletonVariants({ animationType: props.animationType }))
const classes = computed(() => composeClassName(slotFns.value.base(), props.class, props.classNames?.base))
</script>

<template>
  <div
    :class="classes"
    aria-hidden="true"
  >
    <slot />
  </div>
</template>
