<script setup lang="ts">
import { computed, inject, useId } from 'vue'
import { ColorFieldRoot, ColorFieldInput, getChannelValue, type Color } from 'reka-ui'
import { colorFieldVariants, type ColorFieldVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { ColorPickerContextKey } from '../color-picker/color-picker.context'
import { useColorState } from '../../composables/useColorState'

const props = withDefaults(defineProps<{
  modelValue?: Color | string
  defaultValue?: Color | string
  label?: string
  description?: string
  errorMessage?: string
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  fullWidth?: ColorFieldVariants['fullWidth']
  class?: string
  ariaLabel?: string
  as?: string
  asChild?: boolean
  name?: string
  required?: boolean
  colorSpace?: string
  channel?: string
  disableWheelChange?: boolean
  locale?: string
  step?: number
}>(), {
  disabled: false,
  readonly: false,
  fullWidth: false,
  asChild: false,
  required: false,
  disableWheelChange: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: Color]
  'update:color': [value: Color]
}>()

const id = useId()

// Try to inject ColorPickerContext — null fallback so we don't throw when standalone
const pickerCtx = inject(ColorPickerContextKey, null)

// Only use local state when no picker context is present
const local = pickerCtx
  ? null
  : useColorState({
      value: props.modelValue,
      defaultValue: props.defaultValue,
    })

const color = computed<Color>(() =>
  pickerCtx ? pickerCtx.color.value : local!.color.value,
)

const styles = colorFieldVariants({ fullWidth: props.fullWidth })

// Listen to update:color (emits Color object) instead of update:modelValue (emits string)
function onColorUpdate(next: Color) {
  if (pickerCtx) {
    // Propagate through picker context channels using the exported getChannelValue function
    pickerCtx.setChannels([
      { channel: 'red' as const, value: getChannelValue(next, 'red') },
      { channel: 'green' as const, value: getChannelValue(next, 'green') },
      { channel: 'blue' as const, value: getChannelValue(next, 'blue') },
      { channel: 'alpha' as const, value: getChannelValue(next, 'alpha') },
    ])
  } else {
    local!.color.value = next
    emit('update:modelValue', next)
    emit('update:color', next)
  }
}
</script>

<template>
  <ColorFieldRoot
    :model-value="color"
    :disabled="disabled"
    :readonly="readonly"
    :as="props.as"
    :as-child="props.asChild"
    :name="props.name"
    :required="props.required"
    :color-space="props.colorSpace"
    :channel="props.channel"
    :disable-wheel-change="props.disableWheelChange"
    :locale="props.locale"
    :step="props.step"
    :class="composeClassName(styles, props.class)"
    @update:color="onColorUpdate"
  >
    <label
      v-if="label"
      :for="id"
      class="color-field__label"
    >{{ label }}</label>
    <ColorFieldInput
      :id="id"
      :placeholder="placeholder"
      :aria-label="label ? undefined : (props.ariaLabel ?? 'Color value')"
      class="color-field__input"
    />
    <span
      v-if="description && !errorMessage"
      class="color-field__description"
    >{{ description }}</span>
    <span
      v-if="errorMessage"
      class="color-field__error-message"
      role="alert"
    >{{ errorMessage }}</span>
  </ColorFieldRoot>
</template>
