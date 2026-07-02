<script setup lang="ts">
import { computed } from 'vue'
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'reka-ui'
import { sliderVariants, type SliderVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  modelValue?: number | number[]
  defaultValue?: number | number[]
  min?: number
  max?: number
  step?: number
  minStepsBetweenThumbs?: number
  orientation?: 'horizontal' | 'vertical'
  size?: SliderVariants['size']
  color?: SliderVariants['color']
  radius?: SliderVariants['radius']
  label?: string
  showSteps?: boolean
  marks?: Array<{ value: number; label?: string }>
  formatOptions?: Intl.NumberFormatOptions
  hideValue?: boolean
  hideThumb?: boolean
  disabled?: boolean
  inverted?: boolean
  /** Text direction forwarded to SliderRoot. */
  dir?: 'ltr' | 'rtl'
  /** How the thumbs align relative to the track ends. */
  thumbAlignment?: 'contain' | 'overflow'
  /** Whether SliderRoot renders as a child element. */
  asChild?: boolean
  /** Element or component to render SliderRoot as. */
  as?: string
  /** HTML name attribute forwarded to SliderRoot. */
  name?: string
  /** Whether the slider is required. */
  required?: boolean
  /** Whether SliderTrack renders as a child element. */
  trackAsChild?: boolean
  /** Element or component to render SliderTrack as. */
  trackAs?: string
  /** Whether SliderRange renders as a child element. */
  rangeAsChild?: boolean
  /** Element or component to render SliderRange as. */
  rangeAs?: string
  /** Whether SliderThumb renders as a child element. */
  thumbAsChild?: boolean
  /** Element or component to render SliderThumb as. */
  thumbAs?: string
  class?: ClassValue
  /**
   * Per-slot class overrides. Keys map to internal slot names (base, output, track, fill, marks, thumb).
   */
  classNames?: Partial<{
    base: ClassValue
    output: ClassValue
    track: ClassValue
    fill: ClassValue
    marks: ClassValue
    thumb: ClassValue
  }>
}>(), {
  min: 0,
  max: 100,
  step: 1,
  minStepsBetweenThumbs: 0,
  orientation: 'horizontal',
  showSteps: false,
  hideValue: false,
  hideThumb: false,
  disabled: false,
  inverted: false,
  dir: undefined,
  thumbAlignment: 'overflow',
  asChild: false,
  as: undefined,
  name: undefined,
  required: false,
  trackAsChild: false,
  trackAs: undefined,
  rangeAsChild: false,
  rangeAs: undefined,
  thumbAsChild: false,
  thumbAs: undefined,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | number[]): void
  (e: 'value-commit', value: number | number[]): void
}>()

// FIX: Also check defaultValue so uncontrolled range mode is detected correctly.
const isRange = computed(() =>
  Array.isArray(props.modelValue) || Array.isArray(props.defaultValue)
)

// Reka UI SliderRoot always uses number[]. Wrap scalar -> [v] for Reka.
const internalValue = computed({
  get(): number[] {
    if (props.modelValue === undefined) {
      return props.defaultValue !== undefined
        ? Array.isArray(props.defaultValue)
          ? props.defaultValue
          : [props.defaultValue]
        : [Math.round((props.min + props.max) / 2)]
    }
    return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
  },
  set(val: number[]) {
    // Unwrap: if original prop was scalar, emit scalar; otherwise emit array
    if (isRange.value) {
      emit('update:modelValue', val)
    } else {
      emit('update:modelValue', val[0])
    }
  },
})

// FIX: Pass size, color, radius so variants are applied.
const slotFns = computed(() =>
  sliderVariants({ size: props.size, color: props.color, radius: props.radius })
)

// Show the label/output wrapper if label prop is provided or hideValue is false
const showLabelWrapper = computed(() =>
  !!props.label || !props.hideValue
)

// Format a single value
function formatValue(v: number): string {
  if (props.formatOptions) {
    return new Intl.NumberFormat(undefined, props.formatOptions).format(v)
  }
  return String(v)
}

// Formatted output string: joined with " - " for ranges
const formatted = computed(() => {
  return internalValue.value.map(formatValue).join(' \u2013 ')
})

// Compute % position for a value within [min, max]
function toPercent(v: number): number {
  const range = props.max - props.min
  if (range === 0) return 0
  return ((v - props.min) / range) * 100
}

// Tick positions (percentages) for showSteps
const tickPositions = computed<number[]>(() => {
  if (!props.showSteps) return []
  const positions: number[] = []
  let v = props.min
  while (v <= props.max) {
    positions.push(toPercent(v))
    v = Math.round((v + props.step) * 1e10) / 1e10 // avoid floating-point drift
  }
  return positions
})

// Determine which axis to use for positioning (left/bottom)
const positionAxis = computed(() =>
  props.orientation === 'vertical' ? 'bottom' : 'left'
)
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    :data-orientation="orientation"
    :data-disabled="disabled || undefined"
  >
    <!-- Label + output row -->
    <template v-if="showLabelWrapper">
      <!--
        FIX: label does NOT get a class from slotFns.
        The CSS rule `.slider [data-slot="label"]` targets it via data-slot attribute.
        Previously used :class="slotFns.base()" which returned "slider" (root class) — wrong.
      -->
      <label
        v-if="label"
        data-slot="label"
      >{{ label }}</label>
      <output
        v-if="!hideValue"
        :class="composeClassName(slotFns.output(), props.classNames?.output)"
      >{{ formatted }}</output>
    </template>

    <!-- Slider body -->
    <div class="relative flex items-center gap-2">
      <!-- Start content slot -->
      <slot name="startContent" />

      <SliderRoot
        v-model="internalValue"
        :min="min"
        :max="max"
        :step="step"
        :min-steps-between-thumbs="minStepsBetweenThumbs"
        :orientation="orientation"
        :disabled="disabled"
        :inverted="inverted"
        :dir="props.dir"
        :thumb-alignment="props.thumbAlignment"
        :as-child="props.asChild"
        :as="props.as"
        :name="props.name"
        :required="props.required"
        class="relative flex items-center select-none touch-none w-full"
        :data-orientation="orientation"
        @value-commit="emit('value-commit', isRange ? $event : $event[0])"
      >
        <SliderTrack
          :as-child="props.trackAsChild"
          :as="props.trackAs"
          :class="composeClassName(slotFns.track(), props.classNames?.track)"
        >
          <SliderRange
            :as-child="props.rangeAsChild"
            :as="props.rangeAs"
            :class="composeClassName(slotFns.fill(), props.classNames?.fill)"
          />

          <!--
            FIX: tick spans have NO class from slotFns (was :class="slotFns.base()" = "slider" — wrong).
            Ticks are purely positional; identified by data-slider-tick attribute only.
          -->
          <span
            v-for="(pct, i) in tickPositions"
            :key="`tick-${i}`"
            :style="{ [positionAxis]: pct + '%' }"
            aria-hidden="true"
            data-slider-tick
            class="absolute pointer-events-none"
          />

          <!-- Labeled marks -->
          <span
            v-for="mark in (marks || [])"
            :key="`mark-${mark.value}`"
            :class="composeClassName(slotFns.marks(), props.classNames?.marks)"
            :style="{ [positionAxis]: toPercent(mark.value) + '%' }"
            data-slider-mark
            class="absolute"
          >{{ mark.label }}</span>
        </SliderTrack>

        <!-- Thumbs -->
        <SliderThumb
          v-for="(_, idx) in internalValue"
          :key="idx"
          :as-child="props.thumbAsChild"
          :as="props.thumbAs"
          :class="composeClassName(slotFns.thumb(), props.classNames?.thumb)"
          :aria-label="label || 'Value'"
        />
      </SliderRoot>

      <!-- End content slot -->
      <slot name="endContent" />
    </div>
  </div>
</template>
