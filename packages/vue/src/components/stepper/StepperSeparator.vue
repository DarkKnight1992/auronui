<script setup lang="ts">
import { computed, inject } from 'vue'
import { stepperVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { stepperContextKey } from './Stepper.context'

const props = withDefaults(defineProps<{
  /** Additional CSS class for the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  classNames?: Partial<{
    separator: ClassValue
  }>
}>(), {
  class: undefined,
  classNames: undefined,
})

const ctx = inject(stepperContextKey)
const slotFns = computed(() =>
  stepperVariants({ orientation: ctx?.orientation.value }),
)
</script>

<template>
  <div
    :class="composeClassName(slotFns.separator(), props.class, props.classNames?.separator)"
    role="none"
    data-slot="stepper-separator"
  />
</template>
