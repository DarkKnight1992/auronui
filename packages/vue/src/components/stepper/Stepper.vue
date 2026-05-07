<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { stepperVariants, type StepperVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { stepperContextKey, type StepStatus } from './Stepper.context'

const props = withDefaults(defineProps<{
  modelValue?: number
  defaultValue?: number
  totalSteps?: number
  orientation?: StepperVariants['orientation']
  size?: StepperVariants['size']
  color?: StepperVariants['color']
  class?: string
}>(), {
  modelValue: undefined,
  defaultValue: 1,
  totalSteps: 0,
  orientation: 'horizontal',
  size: 'md',
  color: 'accent',
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [step: number]
}>()

const internalStep = ref(props.defaultValue ?? 1)
const currentStep = computed({
  get: () => props.modelValue ?? internalStep.value,
  set: (val) => {
    internalStep.value = val
    emit('update:modelValue', val)
  },
})

const slotFns = computed(() =>
  stepperVariants({
    orientation: props.orientation,
    size: props.size,
    color: props.color,
  }),
)

function getStepStatus(step: number): StepStatus {
  const curr = currentStep.value
  if (step < curr) return 'completed'
  if (step === curr) return 'current'
  return 'pending'
}

provide(stepperContextKey, {
  currentStep: computed(() => currentStep.value),
  orientation: computed(() => props.orientation ?? 'horizontal'),
  size: computed(() => props.size ?? 'md'),
  color: computed(() => props.color ?? 'accent'),
  totalSteps: computed(() => props.totalSteps),
  getStepStatus,
})
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class)"
    :aria-label="`Step ${currentStep} of ${totalSteps}`"
    data-slot="stepper"
  >
    <slot />
  </div>
</template>
