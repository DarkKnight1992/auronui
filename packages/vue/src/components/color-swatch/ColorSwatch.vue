<script setup lang="ts">
import { computed, inject } from 'vue'
import { ColorSwatch as RekaColorSwatch, parseColor, colorToHex, type Color } from 'reka-ui'
import { colorSwatchVariants, type ColorSwatchVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { ColorPickerContextKey } from '../color-picker/color-picker.context'

const props = defineProps<{
  color?: Color | string
  colorName?: string
  shape?: ColorSwatchVariants['shape']
  size?: ColorSwatchVariants['size']
  class?: string
  as?: string
  asChild?: boolean
  label?: string
}>()

// Try to inject ColorPickerContext — null fallback so we don't throw when standalone
const pickerCtx = inject(ColorPickerContextKey, null)

const resolvedColor = computed<Color>(() => {
  if (props.color) {
    return typeof props.color === 'string' ? parseColor(props.color) : props.color
  }
  if (pickerCtx) {
    return pickerCtx.color.value
  }
  return parseColor('#000000')
})

// Reka ColorSwatch sets aria-label from its `label` prop.
// Provide accessible label: explicit label > colorName > hex value.
const accessibleLabel = computed(() =>
  props.label ?? props.colorName ?? colorToHex(resolvedColor.value),
)

const styles = computed(() =>
  colorSwatchVariants({ shape: props.shape, size: props.size }),
)
</script>

<template>
  <RekaColorSwatch
    :color="resolvedColor"
    :label="accessibleLabel"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(styles, props.class)"
  />
</template>
