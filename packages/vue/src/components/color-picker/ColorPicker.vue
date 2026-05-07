<script setup lang="ts">
import { toRef } from 'vue'
import { type ColorFormat } from 'reka-ui'
import { colorPickerVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useColorState } from '../../composables/useColorState'
import { provideColorPickerContext } from './color-picker.context'
import ColorArea from '../color-area/ColorArea.vue'
import ColorSlider from '../color-slider/ColorSlider.vue'
import ColorField from '../color-field/ColorField.vue'
import ColorSwatch from '../color-swatch/ColorSwatch.vue'

// Discretion decision: fixed composition layout.
// Default sliders: hue + alpha (per CONTEXT.md discretion note).
// Layout is NOT slot-based for v1.0; slot composition deferred to v1.1.

const props = withDefaults(defineProps<{
  modelValue?: string
  defaultValue?: string
  format?: ColorFormat
  disabled?: boolean
  label?: string
  class?: string
}>(), {
  format: 'hex',
  disabled: false,
  defaultValue: '#000000',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const state = useColorState({
  value: props.modelValue,
  defaultValue: props.defaultValue,
  format: props.format,
  onChange: (value) => emit('update:modelValue', value),
})

const formatRef = toRef(props, 'format')

provideColorPickerContext({
  color: state.color,
  setChannel: state.setChannel,
  setChannels: state.setChannels,
  format: formatRef,
  emitUpdate: (value) => emit('update:modelValue', value),
})

const styles = colorPickerVariants()
</script>

<template>
  <div
    :class="composeClassName(styles.base(), props.class)"
    :aria-label="label"
    role="group"
  >
    <!-- Preview swatch — reads from context -->
    <ColorSwatch :color-name="label ?? 'Selected color'" />
    <!-- 2D area for saturation + brightness -->
    <ColorArea
      x-channel="saturation"
      y-channel="brightness"
      :disabled="disabled"
    />
    <!-- Hue slider -->
    <ColorSlider
      channel="hue"
      :disabled="disabled"
    />
    <!-- Alpha slider -->
    <ColorSlider
      channel="alpha"
      :disabled="disabled"
    />
    <!-- Text input — label ensures axe compliance for the embedded input -->
    <ColorField
      :disabled="disabled"
      label="Hex color"
    />
    <!-- Slot for test probes and optional consumer additions -->
    <slot />
  </div>
</template>
