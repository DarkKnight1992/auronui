<script setup lang="ts">
import { computed, inject, useId } from 'vue'
import { ColorFieldRoot, ColorFieldInput, getChannelValue, type Color } from 'reka-ui'
import { colorFieldVariants, type ColorFieldVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { ColorPickerContextKey } from '../color-picker/color-picker.context'
import { useColorState } from '../../composables/useColorState'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  modelValue?: Color | string
  defaultValue?: Color | string
  label?: string
  description?: string
  errorMessage?: string
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  isReadOnly?: boolean
  /** @deprecated Use isReadOnly instead. */
  readonly?: boolean
  placeholder?: string
  fullWidth?: ColorFieldVariants['fullWidth']
  class?: string
  ariaLabel?: string
  as?: string
  asChild?: boolean
  name?: string
  isRequired?: boolean
  /** @deprecated Use isRequired instead. */
  required?: boolean
  colorSpace?: string
  channel?: string
  disableWheelChange?: boolean
  locale?: string
  step?: number
  /** Per-slot class overrides */
  classNames?: Partial<{
    label: ClassValue
    input: ClassValue
    description: ClassValue
    errorMessage: ClassValue
  }>
}>(), {
  isDisabled: undefined,
  disabled: undefined,
  isReadOnly: undefined,
  readonly: undefined,
  fullWidth: false,
  asChild: false,
  isRequired: undefined,
  required: undefined,
  disableWheelChange: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: Color]
  'update:color': [value: Color]
}>()

const isDisabled = useDeprecatedBooleanProp(
  'ColorField', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const isReadOnly = useDeprecatedBooleanProp(
  'ColorField', 'isReadOnly', () => props.isReadOnly, 'readonly', () => props.readonly,
)

const isRequired = useDeprecatedBooleanProp(
  'ColorField', 'isRequired', () => props.isRequired, 'required', () => props.required,
)

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
    :disabled="isDisabled"
    :readonly="isReadOnly"
    :as="props.as"
    :as-child="props.asChild"
    :name="props.name"
    :required="isRequired"
    :color-space="(props.colorSpace as any)"
    :channel="(props.channel as any)"
    :disable-wheel-change="props.disableWheelChange"
    :locale="props.locale"
    :step="props.step"
    :class="composeClassName(styles.base(), props.class)"
    @update:color="onColorUpdate"
  >
    <label
      v-if="label"
      :for="id"
      :class="composeClassName(styles.label(), props.classNames?.label)"
    >{{ label }}</label>
    <ColorFieldInput
      :id="id"
      :placeholder="placeholder"
      :aria-label="label ? undefined : (props.ariaLabel ?? 'Color value')"
      :class="composeClassName(styles.input(), props.classNames?.input)"
    />
    <span
      v-if="description && !errorMessage"
      :class="composeClassName(styles.description(), props.classNames?.description)"
    >{{ description }}</span>
    <span
      v-if="errorMessage"
      :class="composeClassName(styles.errorMessage(), props.classNames?.errorMessage)"
      role="alert"
    >{{ errorMessage }}</span>
  </ColorFieldRoot>
</template>
