<script setup lang="ts">
import { computed } from 'vue'
import { AspectRatio } from 'reka-ui'
import { aspectRatioVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  ratio?: number
  class?: ClassValue
  /** Override classes for individual slots */
  classNames?: Partial<{
    base: ClassValue
  }>
}>(), {
  ratio: 1,
  class: undefined,
})

const slotFns = computed(() => aspectRatioVariants())
</script>

<template>
  <AspectRatio
    :ratio="ratio"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    data-slot="aspect-ratio"
  >
    <slot />
  </AspectRatio>
</template>
