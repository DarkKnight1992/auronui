<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { stepperVariants, type StepperVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { stepperContextKey, type StepStatus } from './Stepper.context'
import StepperItem from './StepperItem.vue'
import StepperIndicator from './StepperIndicator.vue'
import StepperTitle from './StepperTitle.vue'
import StepperDescription from './StepperDescription.vue'
import StepperSeparator from './StepperSeparator.vue'
import StepperContent from './StepperContent.vue'

type StepperShorthandItem = { title?: string; description?: string }

const props = withDefaults(defineProps<{
  modelValue?: number
  defaultValue?: number
  totalSteps?: number
  orientation?: StepperVariants['orientation']
  size?: StepperVariants['size']
  color?: StepperVariants['color']
  class?: ClassValue
  /** Per-slot class name overrides. */
  classNames?: Partial<{
    base: ClassValue
    item: ClassValue
    indicator: ClassValue
    separator: ClassValue
    content: ClassValue
    title: ClassValue
    description: ClassValue
  }>
  /** Shorthand API: render steps from an array instead of the compound slot API */
  items?: StepperShorthandItem[]
}>(), {
  modelValue: undefined,
  defaultValue: 1,
  totalSteps: 0,
  orientation: 'horizontal',
  size: 'md',
  color: 'primary',
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

const resolvedTotalSteps = computed(() => props.items ? props.items.length : props.totalSteps)

provide(stepperContextKey, {
  currentStep: computed(() => currentStep.value),
  orientation: computed(() => props.orientation ?? 'horizontal'),
  size: computed(() => props.size ?? 'md'),
  color: computed(() => props.color ?? 'primary'),
  totalSteps: resolvedTotalSteps,
  getStepStatus,
})
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    :aria-label="`Step ${currentStep} of ${resolvedTotalSteps}`"
    data-slot="stepper"
  >
    <template v-if="props.items">
      <StepperItem
        v-for="(item, idx) in props.items"
        :key="idx + 1"
        :step="idx + 1"
        :class-names="{ item: props.classNames?.item }"
      >
        <StepperIndicator :class-names="{ indicator: props.classNames?.indicator }">{{ idx + 1 }}</StepperIndicator>
        <StepperSeparator
          v-if="idx < props.items.length - 1"
          :class-names="{ separator: props.classNames?.separator }"
        />
        <StepperContent :class-names="{ content: props.classNames?.content }">
          <StepperTitle v-if="item.title" :class-names="{ title: props.classNames?.title }">{{ item.title }}</StepperTitle>
          <StepperDescription
            v-if="item.description"
            :class-names="{ description: props.classNames?.description }"
          >{{ item.description }}</StepperDescription>
        </StepperContent>
      </StepperItem>
    </template>
    <slot v-else />
  </div>
</template>
