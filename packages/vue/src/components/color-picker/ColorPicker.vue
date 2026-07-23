<script setup lang="ts">
import { ref, toRef } from 'vue'
import { getChannelValue, type Color, type ColorChannel, type ColorFormat } from 'reka-ui'
import { colorPickerVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useColorState } from '../../composables/useColorState'
import { provideColorPickerContext } from './color-picker.context'
import ColorArea from '../color-area/ColorArea.vue'
import ColorSlider from '../color-slider/ColorSlider.vue'
import ColorField from '../color-field/ColorField.vue'
import ColorSwatch from '../color-swatch/ColorSwatch.vue'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

// Discretion decision: fixed composition layout.
// Default sliders: hue + alpha (per CONTEXT.md discretion note).
// Layout is NOT slot-based for v1.0; slot composition deferred to v1.1.

const props = withDefaults(defineProps<{
  modelValue?: string
  defaultValue?: string
  format?: ColorFormat
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  label?: string
  class?: string
}>(), {
  format: 'hex',
  isDisabled: undefined,
  disabled: undefined,
  defaultValue: '#000000',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const isDisabled = useDeprecatedBooleanProp(
  'ColorPicker', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

// See ColorPickerContext.rememberedHue for the full rationale. In short: hue
// is mathematically undefined for a pure black/white/gray color, so a
// ColorArea drag into a corner of the saturation/brightness plane loses hue
// at that exact point — updated directly from the actual input value
// whenever a hue channel is explicitly set (never re-derived from the
// stored color afterward), so it can't be corrupted by that loss.
function isChromatic(color: Color): boolean {
  return getChannelValue(color, 'saturation') > 0 && getChannelValue(color, 'brightness') > 0
}

const state = useColorState({
  value: () => props.modelValue,
  defaultValue: () => props.defaultValue,
  format: () => props.format,
  onChange: (value) => emit('update:modelValue', value),
  onExternalChange: (next) => {
    if (isChromatic(next)) rememberedHue.value = getChannelValue(next, 'hue')
  },
})

const rememberedHue = ref(getChannelValue(state.color.value, 'hue'))

// A write either (a) explicitly defines a whole new color — the hue slider
// itself, or ColorField's hex input writing red/green/blue directly — in
// which case rememberedHue must be RESYNCED from it afterward (it's stale
// otherwise, and the next ColorArea drag would reassert that stale hue and
// visibly corrupt the color back to it, even though the stored color was
// already correct) — or (b) only touches saturation/brightness/lightness/
// alpha (ColorArea, the alpha slider), which must never affect hue at all,
// so rememberedHue is reasserted onto it instead.
const RGB_CHANNELS: ColorChannel[] = ['red', 'green', 'blue']

function resyncRememberedHue() {
  if (isChromatic(state.color.value)) {
    rememberedHue.value = getChannelValue(state.color.value, 'hue')
  }
}

function setChannel(channel: ColorChannel, value: number) {
  if (channel === 'hue') {
    rememberedHue.value = value
    state.setChannel(channel, value)
    return
  }
  if (RGB_CHANNELS.includes(channel)) {
    state.setChannel(channel, value)
    resyncRememberedHue()
    return
  }
  state.setChannels([{ channel, value }, { channel: 'hue', value: rememberedHue.value }])
}

function setChannels(values: Array<{ channel: ColorChannel; value: number }>) {
  const channels = values.map((v) => v.channel)
  const isFullColorWrite = channels.includes('hue') || channels.some((c) => RGB_CHANNELS.includes(c))
  if (isFullColorWrite) {
    state.setChannels(values)
    const hueEntry = values.find((v) => v.channel === 'hue')
    if (hueEntry) {
      // An explicit hue entry is authoritative even if the stored/re-derived
      // result rounds slightly differently — avoids the same round-trip
      // noise ColorArea's own reassertion exists to prevent.
      rememberedHue.value = hueEntry.value
    } else {
      resyncRememberedHue()
    }
    return
  }
  state.setChannels([...values, { channel: 'hue', value: rememberedHue.value }])
}

const formatRef = toRef(props, 'format')

provideColorPickerContext({
  color: state.color,
  setChannel,
  setChannels,
  rememberedHue,
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
      :is-disabled="isDisabled"
    />
    <!-- Hue slider -->
    <ColorSlider
      channel="hue"
      :is-disabled="isDisabled"
    />
    <!-- Alpha slider -->
    <ColorSlider
      channel="alpha"
      :is-disabled="isDisabled"
    />
    <!-- Text input — label ensures axe compliance for the embedded input -->
    <ColorField
      :is-disabled="isDisabled"
      label="Hex color"
    />
    <!-- Slot for test probes and optional consumer additions -->
    <slot />
  </div>
</template>
