<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue'
import {
  ColorSliderRoot,
  ColorSliderTrack,
  ColorSliderThumb,
  getSliderBackgroundStyle,
  getChannelValue,
  type Color,
  type ColorChannel,
  type ColorSpace,
} from 'reka-ui'
import { colorSliderVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { ColorPickerContextKey } from '../color-picker/color-picker.context'
import { useColorState } from '../../composables/useColorState'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: Color | string
  defaultValue?: Color | string
  channel: ColorChannel
  colorSpace?: ColorSpace
  orientation?: 'horizontal' | 'vertical'
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  showOutput?: boolean
  class?: string
  trackClass?: string
  thumbClass?: string
  outputClass?: string
  as?: string
  asChild?: boolean
  name?: string
  isRequired?: boolean
  /** @deprecated Use isRequired instead. */
  required?: boolean
  dir?: 'ltr' | 'rtl'
  inverted?: boolean
  step?: number
}>(), {
  orientation: 'horizontal',
  isDisabled: undefined,
  disabled: undefined,
  showOutput: false,
  asChild: false,
  isRequired: undefined,
  required: undefined,
  inverted: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: Color]
  'update:color': [value: Color]
  'change': [value: Color]
  'change-end': [value: Color]
}>()

const attrs = useAttrs()

const isDisabled = useDeprecatedBooleanProp(
  'ColorSlider', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const isRequired = useDeprecatedBooleanProp(
  'ColorSlider', 'isRequired', () => props.isRequired, 'required', () => props.required,
)

// Optional picker context — when absent, fall back to local useColorState
const pickerCtx = inject(ColorPickerContextKey, null)
const local = pickerCtx
  ? null
  : useColorState({ value: props.modelValue, defaultValue: props.defaultValue })

const color = computed<Color>(() =>
  pickerCtx ? pickerCtx.color.value : local!.color.value
)

const styles = colorSliderVariants()

const trackBgStyle = computed(() =>
  getSliderBackgroundStyle(color.value, props.channel)
)

const channelDisplay = computed(() =>
  Math.round(getChannelValue(color.value, props.channel)).toString()
)

function onColorUpdate(next: Color) {
  if (pickerCtx) {
    pickerCtx.setChannel(props.channel, getChannelValue(next, props.channel))
  } else {
    emit('update:modelValue', next)
    emit('update:color', next)
  }
}
</script>

<template>
  <ColorSliderRoot
    v-bind="attrs"
    :model-value="color"
    :channel="channel"
    :color-space="colorSpace"
    :orientation="orientation"
    :disabled="isDisabled"
    :as="props.as"
    :as-child="props.asChild"
    :name="props.name"
    :required="isRequired"
    :dir="props.dir"
    :inverted="props.inverted"
    :step="props.step"
    :class="composeClassName(styles.base(), props.class)"
    @update:color="onColorUpdate"
    @change="(v: string) => emit('change', v as unknown as Color)"
    @change-end="(v: string) => emit('change-end', v as unknown as Color)"
  >
    <ColorSliderTrack
      :class="composeClassName(styles.track(), trackClass)"
      :style="trackBgStyle"
    >
      <ColorSliderThumb :class="composeClassName(styles.thumb(), thumbClass)" />
    </ColorSliderTrack>
    <output
      v-if="showOutput"
      :class="composeClassName(styles.output(), outputClass)"
    >{{ channelDisplay }}</output>
  </ColorSliderRoot>
</template>
