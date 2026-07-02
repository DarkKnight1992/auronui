<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue'
import {
  ColorSwatchPickerRoot,
  ColorSwatchPickerItem,
  ColorSwatchPickerItemIndicator,
  ColorSwatchPickerItemSwatch,
  parseColor,
  colorToHex,
  getChannelValue,
  type Color,
} from 'reka-ui'
import { colorSwatchPickerVariants, type ColorSwatchPickerVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { ColorPickerContextKey } from '../color-picker/color-picker.context'
import { useColorState } from '../../composables/useColorState'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

// Disable Vue default attr inheritance so we can manually pass attrs to the root
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string
  defaultValue?: string
  colors: (Color | string)[]
  layout?: ColorSwatchPickerVariants['layout']
  size?: ColorSwatchPickerVariants['size']
  variant?: ColorSwatchPickerVariants['variant']
  class?: string
  as?: string
  asChild?: boolean
  name?: string
  isRequired?: boolean
  /** @deprecated Use isRequired instead. */
  required?: boolean
  multiple?: boolean
  orientation?: 'horizontal' | 'vertical'
  dir?: 'ltr' | 'rtl'
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  selectionBehavior?: 'replace' | 'toggle'
  highlightOnHover?: boolean
}>(), {
  layout: 'grid',
  size: 'md',
  variant: 'circle',
  asChild: false,
  isRequired: undefined,
  required: undefined,
  multiple: false,
  isDisabled: undefined,
  disabled: undefined,
  highlightOnHover: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'highlight': [value: unknown]
  'entry-focus': [event: Event]
  'leave': [event: Event]
}>()

// Access all attributes (including aria-label) to forward manually
const attrs = useAttrs()

const isDisabled = useDeprecatedBooleanProp(
  'ColorSwatchPicker', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const isRequired = useDeprecatedBooleanProp(
  'ColorSwatchPicker', 'isRequired', () => props.isRequired, 'required', () => props.required,
)

// Try to inject ColorPickerContext — null fallback so we don't throw when standalone
const pickerCtx = inject(ColorPickerContextKey, null)

// Only use local state when no picker context is present
const local = pickerCtx
  ? null
  : useColorState({
      value: props.modelValue,
      defaultValue: props.defaultValue,
    })

// ColorSwatchPickerRoot works with hex strings
const colorHex = computed<string>(() => {
  if (pickerCtx) return colorToHex(pickerCtx.color.value)
  return local!.toHex()
})

const styles = computed(() =>
  colorSwatchPickerVariants({
    layout: props.layout,
    size: props.size,
    variant: props.variant,
  }),
)

// Normalize each color entry to a hex string (the value ColorSwatchPickerItem expects)
function toHexString(c: Color | string): string {
  return typeof c === 'string' ? c : colorToHex(c)
}

// ColorSwatchPickerRoot emits string | string[] | null — guard to string before use
function onUpdate(next: unknown) {
  if (typeof next !== 'string') return
  if (pickerCtx) {
    const parsed = parseColor(next)
    pickerCtx.setChannels([
      { channel: 'red' as const, value: getChannelValue(parsed, 'red') },
      { channel: 'green' as const, value: getChannelValue(parsed, 'green') },
      { channel: 'blue' as const, value: getChannelValue(parsed, 'blue') },
      { channel: 'alpha' as const, value: getChannelValue(parsed, 'alpha') },
    ])
  } else {
    local!.color.value = parseColor(next)
    emit('update:modelValue', next)
  }
}
</script>

<template>
  <ColorSwatchPickerRoot
    v-bind="attrs"
    :model-value="colorHex"
    :as="props.as"
    :as-child="props.asChild"
    :name="props.name"
    :required="isRequired"
    :multiple="props.multiple"
    :orientation="props.orientation"
    :dir="props.dir"
    :disabled="isDisabled"
    :selection-behavior="props.selectionBehavior"
    :highlight-on-hover="props.highlightOnHover"
    :class="composeClassName(styles.base(), props.class)"
    @update:model-value="onUpdate"
    @highlight="(v: unknown) => emit('highlight', v)"
    @entry-focus="(e: Event) => emit('entry-focus', e)"
    @leave="(e: Event) => emit('leave', e)"
  >
    <ColorSwatchPickerItem
      v-for="(c, i) in colors"
      :key="i"
      :value="toHexString(c)"
      :class="styles.item()"
    >
      <ColorSwatchPickerItemSwatch :class="styles.swatch()" />
      <ColorSwatchPickerItemIndicator :class="styles.indicator()" />
    </ColorSwatchPickerItem>
  </ColorSwatchPickerRoot>
</template>
