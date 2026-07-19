<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  ColorAreaRoot,
  ColorAreaArea,
  ColorAreaThumb,
  getChannelValue,
  type Color,
  type ColorChannel,
  type ColorSpace,
} from 'reka-ui'
import { colorAreaVariants, type ColorAreaVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { ColorPickerContextKey } from '../color-picker/color-picker.context'
import { useColorState } from '../../composables/useColorState'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  modelValue?: Color | string
  defaultValue?: Color | string
  xChannel?: ColorChannel
  yChannel?: ColorChannel
  colorSpace?: ColorSpace
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  showDots?: ColorAreaVariants['showDots']
  class?: string
  thumbClass?: string
  as?: string
  asChild?: boolean
  name?: string
  isRequired?: boolean
  /** @deprecated Use isRequired instead. */
  required?: boolean
  xName?: string
  yName?: string
}>(), {
  xChannel: 'saturation',
  yChannel: 'brightness',
  showDots: false,
  isDisabled: undefined,
  disabled: undefined,
  asChild: false,
  isRequired: undefined,
  required: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: Color]
  'update:color': [value: Color]
  'change': [value: Color]
  'change-end': [value: Color]
}>()

const isDisabled = useDeprecatedBooleanProp(
  'ColorArea', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const isRequired = useDeprecatedBooleanProp(
  'ColorArea', 'isRequired', () => props.isRequired, 'required', () => props.required,
)

// Optional picker context — when absent, fall back to local useColorState
const pickerCtx = inject(ColorPickerContextKey, null)
const local = pickerCtx
  ? null
  : useColorState({ value: () => props.modelValue, defaultValue: () => props.defaultValue })

const color = computed<Color>(() =>
  pickerCtx ? pickerCtx.color.value : local!.color.value
)

const styles = computed(() =>
  colorAreaVariants({ showDots: props.showDots })
)

// Explicit, stable color space for the xChannel/yChannel pairing — must NOT be derived
// from color.value.space, which starts as 'rgb' (hex parsing) and later flips to 'hsb'
// once a brightness-touching update runs through setChannelValues. Falling back to that
// transient space would flip the area's gradient direction the moment the user interacts.
const effectiveColorSpace = computed<ColorSpace>(() => {
  if (props.colorSpace) return props.colorSpace
  if (props.yChannel === 'lightness') return 'hsl'
  if (props.yChannel === 'brightness') return 'hsb'
  if (
    props.xChannel === 'red' || props.xChannel === 'green' || props.xChannel === 'blue' ||
    props.yChannel === 'red' || props.yChannel === 'green' || props.yChannel === 'blue'
  ) return 'rgb'
  return 'hsl'
})

function onColorUpdate(next: Color) {
  if (pickerCtx) {
    // Write both active channels back via context
    pickerCtx.setChannels([
      { channel: props.xChannel!, value: getChannelValue(next, props.xChannel!) },
      { channel: props.yChannel!, value: getChannelValue(next, props.yChannel!) },
    ])
  } else {
    emit('update:modelValue', next)
    emit('update:color', next)
  }
}
</script>

<template>
  <ColorAreaRoot
    :model-value="color"
    :x-channel="xChannel"
    :y-channel="yChannel"
    :color-space="effectiveColorSpace"
    :disabled="isDisabled"
    :as="props.as"
    :as-child="props.asChild"
    :name="props.name"
    :required="isRequired"
    :x-name="props.xName"
    :y-name="props.yName"
    :class="composeClassName(styles.base(), props.class)"
    @update:color="onColorUpdate"
    @change="(v: string) => emit('change', v as unknown as Color)"
    @change-end="(v: string) => emit('change-end', v as unknown as Color)"
  >
    <template #default="{ style }">
      <ColorAreaArea :style="{ ...style, position: 'absolute', inset: 0, borderRadius: 'inherit' }">
        <ColorAreaThumb :class="composeClassName(styles.thumb(), thumbClass)" />
      </ColorAreaArea>
    </template>
  </ColorAreaRoot>
</template>
