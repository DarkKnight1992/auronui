<script setup lang="ts">
import { computed, inject } from 'vue'
import { stepperVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { stepperContextKey } from './Stepper.context'

const props = withDefaults(defineProps<{
  class?: string
  /** Override classes on individual slots */
  classNames?: Partial<{
    indicator: string
  }>
}>(), {
  class: undefined,
  classNames: undefined,
})

const ctx = inject(stepperContextKey)

const slotFns = computed(() =>
  stepperVariants({
    size: ctx?.size.value,
    color: ctx?.color.value,
  }),
)
</script>

<template>
  <div
    :class="composeClassName(slotFns.indicator(), props.class, props.classNames?.indicator)"
    aria-hidden="true"
    data-slot="stepper-indicator"
  >
    <slot />
  </div>
</template>
