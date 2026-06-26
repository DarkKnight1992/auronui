<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  ColorAreaRoot,
  ColorAreaArea,
  ColorAreaThumb,
  getAreaBackgroundStyle,
  getChannelValue,
  type Color,
  type ColorChannel,
  type ColorSpace,
} from 'reka-ui'
import { colorAreaVariants, type ColorAreaVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { ColorPickerContextKey } from '../color-picker/color-picker.context'
import { useColorState } from '../../composables/useColorState'

const props = withDefaults(defineProps<{
  modelValue?: Color | string
  defaultValue?: Color | string
  xChannel?: ColorChannel
  yChannel?: ColorChannel
  colorSpace?: ColorSpace
  disabled?: boolean
  showDots?: ColorAreaVariants['showDots']
  class?: string
  thumbClass?: string
  as?: string
  asChild?: boolean
  name?: string
  required?: boolean
  xName?: string
  yName?: string
}>(), {
  xChannel: 'saturation',
  yChannel: 'brightness',
  showDots: false,
  disabled: false,
  asChild: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: Color]
  'update:color': [value: Color]
  'change': [value: Color]
  'change-end': [value: Color]
}>()

// Optional picker context — when absent, fall back to local useColorState
const pickerCtx = inject(ColorPickerContextKey, null)
const local = pickerCtx
  ? null
  : useColorState({ value: props.modelValue, defaultValue: props.defaultValue })

const color = computed<Color>(() =>
  pickerCtx ? pickerCtx.color.value : local!.color.value
)

const styles = computed(() =>
  colorAreaVariants({ showDots: props.showDots })
)

const areaBgStyle = computed(() => ({
  ...getAreaBackgroundStyle(color.value, props.xChannel!, props.yChannel!),
  position: 'absolute' as const,
  inset: 0,
  borderRadius: 'inherit',
}))

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
    :color-space="colorSpace"
    :disabled="disabled"
    :as="props.as"
    :as-child="props.asChild"
    :name="props.name"
    :required="props.required"
    :x-name="props.xName"
    :y-name="props.yName"
    :class="composeClassName(styles.base(), props.class)"
    @update:color="onColorUpdate"
    @change="(v: Color) => emit('change', v)"
    @change-end="(v: Color) => emit('change-end', v)"
  >
    <ColorAreaArea :style="areaBgStyle">
      <ColorAreaThumb :class="composeClassName(styles.thumb(), thumbClass)" />
    </ColorAreaArea>
  </ColorAreaRoot>
</template>
