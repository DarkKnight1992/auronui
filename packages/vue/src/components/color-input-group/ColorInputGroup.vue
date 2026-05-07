<script setup lang="ts">
import { computed, inject, useId } from 'vue'
import {
  ColorFieldRoot,
  ColorFieldInput,
  getChannelValue,
  type Color,
} from 'reka-ui'
import { colorInputGroupVariants, type ColorInputGroupVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import ColorSwatch from '../color-swatch/ColorSwatch.vue'
import { useColorState } from '../../composables/useColorState'
import { ColorPickerContextKey } from '../color-picker/color-picker.context'

const props = withDefaults(defineProps<{
  modelValue?: Color | string
  defaultValue?: Color | string
  label?: string
  description?: string
  errorMessage?: string
  placeholder?: string
  suffixLabel?: string
  disabled?: boolean
  readonly?: boolean
  fullWidth?: ColorInputGroupVariants['fullWidth']
  variant?: ColorInputGroupVariants['variant']
  class?: string
}>(), {
  suffixLabel: 'HEX',
  fullWidth: false,
  variant: 'primary',
  disabled: false,
  readonly: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: Color] }>()

const id = useId()

const pickerCtx = inject(ColorPickerContextKey, null)

const local = pickerCtx
  ? null
  : useColorState({
      value: props.modelValue,
      defaultValue: props.defaultValue,
    })

const color = computed<Color>(() =>
  pickerCtx ? pickerCtx.color.value : local!.color.value,
)

const styles = colorInputGroupVariants({ fullWidth: props.fullWidth, variant: props.variant })

function onColorUpdate(next: Color) {
  if (pickerCtx) {
    pickerCtx.setChannels([
      { channel: 'red' as const, value: getChannelValue(next, 'red') },
      { channel: 'green' as const, value: getChannelValue(next, 'green') },
      { channel: 'blue' as const, value: getChannelValue(next, 'blue') },
      { channel: 'alpha' as const, value: getChannelValue(next, 'alpha') },
    ])
  } else {
    local!.color.value = next
    emit('update:modelValue', next)
  }
}
</script>

<template>
  <div class="color-input-group__wrapper">
    <label
      v-if="label"
      :for="id"
      class="color-input-group__label"
    >{{ label }}</label>
    <ColorFieldRoot
      :model-value="color"
      :disabled="disabled"
      :readonly="readonly"
      :class="composeClassName(styles.base(), props.class)"
      :aria-invalid="errorMessage ? true : undefined"
      @update:color="onColorUpdate"
    >
      <span
        data-slot="color-input-group-prefix"
        :class="styles.prefix()"
        aria-hidden="true"
      >
        <ColorSwatch
          :color="color"
          size="sm"
        />
      </span>
      <ColorFieldInput
        :id="id"
        data-slot="color-input-group-input"
        :placeholder="placeholder"
        :aria-label="label ? undefined : 'Color value'"
        :class="styles.input()"
      />
      <span
        v-if="suffixLabel"
        data-slot="color-input-group-suffix"
        :class="styles.suffix()"
      >{{ suffixLabel }}</span>
    </ColorFieldRoot>
    <span
      v-if="description && !errorMessage"
      class="color-input-group__description"
    >{{ description }}</span>
    <span
      v-if="errorMessage"
      class="color-input-group__error-message"
      role="alert"
    >{{ errorMessage }}</span>
  </div>
</template>
