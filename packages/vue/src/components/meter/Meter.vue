<!--
  Meter — A quantity indicator within a known range.

  Implementation note: Although HTML provides a native <meter> element, it is
  notoriously difficult to style cross-browser and does NOT reliably expose the
  ARIA `meter` role to all assistive technologies. This component therefore uses
  a <div role="meter"> with explicit aria-valuenow / aria-valuemin / aria-valuemax
  attributes, matching React's approach (React Aria's useMeter → div-based).
  This is fully compliant with the ARIA 1.1 specification.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { meterVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  value?: number
  minValue?: number
  maxValue?: number
  label?: string
  valueLabel?: string
  showValueLabel?: boolean
  formatOptions?: Intl.NumberFormatOptions
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
  class?: ClassValue
  /** Override classes for individual slots */
  classNames?: Partial<{
    base: ClassValue
    label: ClassValue
    output: ClassValue
    track: ClassValue
    fill: ClassValue
  }>
}>(), {
  value: 0,
  minValue: 0,
  maxValue: 100,
  showValueLabel: false,
})

const percentage = computed(() => {
  const raw = ((props.value - props.minValue) / (props.maxValue - props.minValue)) * 100
  return Math.min(100, Math.max(0, raw))
})

const formattedValue = computed(() => {
  if (props.valueLabel) return props.valueLabel
  if (props.formatOptions) {
    return new Intl.NumberFormat(undefined, props.formatOptions).format(props.value)
  }
  return `${Math.round(percentage.value)}%`
})

const slotFns = computed(() =>
  meterVariants({
    size: props.size,
    color: props.color,
  })
)
</script>

<template>
  <div :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)">
    <span
      v-if="label"
      data-slot="label"
      :class="composeClassName(slotFns.label(), props.classNames?.label)"
    >{{ label }}</span>
    <output
      v-if="showValueLabel"
      :class="composeClassName(slotFns.output(), props.classNames?.output)"
    >{{ formattedValue }}</output>
    <div
      role="meter"
      :aria-valuenow="value"
      :aria-valuemin="minValue"
      :aria-valuemax="maxValue"
      :aria-valuetext="formattedValue"
      :aria-label="label || 'Meter'"
      :class="composeClassName(slotFns.track(), props.classNames?.track)"
    >
      <div
        :class="composeClassName(slotFns.fill(), props.classNames?.fill)"
        :style="{ width: percentage + '%' }"
      />
    </div>
  </div>
</template>
