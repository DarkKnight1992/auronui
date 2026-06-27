<script setup lang="ts">
import { computed } from 'vue'
import { ProgressRoot } from 'reka-ui'
import { progressCircleVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  value?: number | null
  minValue?: number
  maxValue?: number
  label?: string
  valueLabel?: string
  showValueLabel?: boolean
  formatOptions?: Intl.NumberFormatOptions
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  strokeWidth?: number
  isIndeterminate?: boolean
  isDisabled?: boolean
  /** Element or component to render ProgressRoot as. */
  as?: string
  /** Whether ProgressRoot renders as a child element. */
  asChild?: boolean
  /** Function to get the accessible label for the current value. */
  getValueLabel?: (value: number | null | undefined, max: number) => string | undefined
  /** Function to get the accessible text for the current value. */
  getValueText?: (value: number | null | undefined, max: number) => string | undefined
  class?: ClassValue
  /** Override classNames for individual slots */
  classNames?: Partial<{
    base: ClassValue
    svg: ClassValue
    track: ClassValue
    indicator: ClassValue
    value: ClassValue
  }>
}>(), {
  minValue: 0,
  maxValue: 100,
  showValueLabel: false,
  strokeWidth: 3,
  isIndeterminate: false,
  isDisabled: false,
  as: undefined,
  asChild: false,
  getValueLabel: undefined,
  getValueText: undefined,
})

const isInd = computed(
  () => props.isIndeterminate || props.value === null || props.value === undefined
)

const percentage = computed(() => {
  if (isInd.value) return 0
  const val = props.value as number
  return ((val - props.minValue) / (props.maxValue - props.minValue)) * 100
})

// SVG geometry
const radius = computed(() => 16 - props.strokeWidth)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() =>
  isInd.value ? circumference.value * 0.25 : circumference.value * (1 - percentage.value / 100)
)

const slotFns = computed(() =>
  progressCircleVariants({
    size: props.size,
    color: props.color,
    isIndeterminate: isInd.value,
    isDisabled: props.isDisabled,
  })
)

const formattedValue = computed(() => {
  if (props.valueLabel) return props.valueLabel
  if (props.value === null || props.value === undefined) return ''
  if (props.formatOptions) {
    return new Intl.NumberFormat(undefined, props.formatOptions).format(props.value)
  }
  return String(Math.round(props.value as number))
})
</script>

<template>
  <ProgressRoot
    :model-value="isInd ? null : (value as number)"
    :max="maxValue"
    :as="props.as"
    :as-child="props.asChild"
    :get-value-label="props.getValueLabel"
    :get-value-text="props.getValueText"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    :aria-label="label || 'Progress'"
    :data-disabled="isDisabled ? '' : undefined"
  >
    <svg
      :class="composeClassName(slotFns.svg(), props.classNames?.svg)"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <!-- Track circle -->
      <circle
        :class="composeClassName(slotFns.track(), props.classNames?.track)"
        cx="16"
        cy="16"
        :r="radius"
        :stroke-width="strokeWidth"
        fill="none"
      />
      <!-- Indicator (progress) circle -->
      <circle
        :class="composeClassName(slotFns.indicator(), props.classNames?.indicator)"
        cx="16"
        cy="16"
        :r="radius"
        :stroke-width="strokeWidth"
        fill="none"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        transform="rotate(-90 16 16)"
        style="transition: stroke-dashoffset 300ms ease-out"
      />
    </svg>
    <span
      v-if="showValueLabel || label"
      :class="composeClassName(slotFns.value(), props.classNames?.value)"
    >
      <slot>{{ formattedValue }}</slot>
    </span>
  </ProgressRoot>
</template>
