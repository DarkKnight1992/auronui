<script setup lang="ts">
import { computed } from 'vue'
import { stepperVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  class?: string
  /** Override classes for individual slots. */
  classNames?: Partial<{
    description: string
  }>
}>(), {
  class: undefined,
  classNames: undefined,
})

const slotFns = computed(() => stepperVariants())
</script>

<template>
  <p
    :class="composeClassName(slotFns.description(), props.class, props.classNames?.description)"
    data-slot="stepper-description"
  >
    <slot />
  </p>
</template>
