<script setup lang="ts">
import { computed } from 'vue'
import { ProgressRoot, ProgressIndicator } from 'reka-ui'
import { progressBarVariants } from '@auronui/styles'
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
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  isStriped?: boolean
  isIndeterminate?: boolean
  isDisabled?: boolean
  /** Element or component to render ProgressRoot as. */
  as?: string
  /** Whether ProgressRoot renders as a child element. */
  asChild?: boolean
  /** Function to get the accessible label for the current value. */
  getValueLabel?: (value: number, max: number) => string
  /** Function to get the accessible text for the current value. */
  getValueText?: (value: number, max: number) => string
  /** Element or component to render ProgressIndicator as. */
  indicatorAs?: string
  /** Whether ProgressIndicator renders as a child element. */
  indicatorAsChild?: boolean
  class?: ClassValue
  /** Per-slot class overrides */
  classNames?: Partial<{
    base: ClassValue
    labelWrapper: ClassValue
    label: ClassValue
    value: ClassValue
    track: ClassValue
    indicator: ClassValue
  }>
}>(), {
  minValue: 0,
  maxValue: 100,
  showValueLabel: false,
  isStriped: false,
  isIndeterminate: false,
  isDisabled: false,
  as: undefined,
  asChild: false,
  getValueLabel: undefined,
  getValueText: undefined,
  indicatorAs: undefined,
  indicatorAsChild: false,
})

const isInd = computed(
  () => props.isIndeterminate || props.value === null || props.value === undefined
)

const percentage = computed(() => {
  if (isInd.value) return 0
  const val = props.value as number
  return ((val - props.minValue) / (props.maxValue - props.minValue)) * 100
})

const slotFns = computed(() =>
  progressBarVariants({
    size: props.size,
    color: props.color,
    radius: props.radius,
    isStriped: props.isStriped,
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
  return String(Math.round(percentage.value)) + '%'
})
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    :data-disabled="isDisabled ? '' : undefined"
  >
    <div
      v-if="label || showValueLabel"
      :class="composeClassName(slotFns.labelWrapper(), props.classNames?.labelWrapper)"
    >
      <span
        v-if="label"
        :class="composeClassName(slotFns.label(), props.classNames?.label)"
      >{{ label }}</span>
      <span
        v-if="showValueLabel"
        :class="composeClassName(slotFns.value(), props.classNames?.value)"
      >{{ formattedValue }}</span>
    </div>
    <ProgressRoot
      :model-value="isInd ? null : (props.value as number)"
      :max="maxValue"
      :as="props.as"
      :as-child="props.asChild"
      :get-value-label="props.getValueLabel"
      :get-value-text="props.getValueText"
      :class="composeClassName(slotFns.track(), props.classNames?.track)"
      :aria-label="label || 'Progress'"
    >
      <ProgressIndicator
        :as="props.indicatorAs"
        :as-child="props.indicatorAsChild"
        :class="composeClassName(slotFns.indicator(), props.classNames?.indicator)"
        :style="isInd ? {} : { transform: `translateX(-${100 - percentage}%)` }"
      />
    </ProgressRoot>
  </div>
</template>
