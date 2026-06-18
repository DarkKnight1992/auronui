<script setup lang="ts">
import { computed, inject } from 'vue'
import { stepperVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { stepperContextKey } from './Stepper.context'

const props = withDefaults(defineProps<{
  step: number
  /** Custom CSS classes for the root element. */
  class?: string
  /** Override CSS classes for individual slots. */
  classNames?: Partial<{
    item: string
  }>
}>(), {
  class: undefined,
  classNames: undefined,
})

const ctx = inject(stepperContextKey)

const status = computed(() => ctx?.getStepStatus(props.step) ?? 'pending')

const slotFns = computed(() =>
  stepperVariants({
    orientation: ctx?.orientation.value,
    size: ctx?.size.value,
    color: ctx?.color.value,
  }),
)
</script>

<template>
  <div
    :class="composeClassName(slotFns.item(), props.class, props.classNames?.item)"
    :data-status="status"
    :data-step="step"
    data-slot="stepper-item"
  >
    <slot
      :status="status"
      :step="step"
      :is-current="status === 'current'"
      :is-completed="status === 'completed'"
      :is-error="status === 'error'"
    />
  </div>
</template>
