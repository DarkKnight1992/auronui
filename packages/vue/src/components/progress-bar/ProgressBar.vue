<script setup lang="ts">
import { computed } from 'vue'
import { ProgressRoot, ProgressIndicator } from 'reka-ui'
import { progressBarVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

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
  class?: string
}>(), {
  minValue: 0,
  maxValue: 100,
  showValueLabel: false,
  isStriped: false,
  isIndeterminate: false,
  isDisabled: false,
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
    :class="composeClassName(slotFns.base(), props.class)"
    :data-disabled="isDisabled ? '' : undefined"
  >
    <div
      v-if="label || showValueLabel"
      :class="slotFns.labelWrapper()"
    >
      <span
        v-if="label"
        :class="slotFns.label()"
      >{{ label }}</span>
      <span
        v-if="showValueLabel"
        :class="slotFns.value()"
      >{{ formattedValue }}</span>
    </div>
    <ProgressRoot
      :model-value="isInd ? null : (props.value as number)"
      :max="maxValue"
      :class="slotFns.track()"
      :aria-label="label || 'Progress'"
    >
      <ProgressIndicator
        :class="slotFns.indicator()"
        :style="isInd ? {} : { transform: `translateX(-${100 - percentage}%)` }"
      />
    </ProgressRoot>
  </div>
</template>
