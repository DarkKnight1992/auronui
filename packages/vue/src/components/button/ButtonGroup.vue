<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { buttonGroupVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useButtonGroupProvide } from './button-group.context'
import type { ButtonGroupSelectionMode, ButtonGroupValue } from './button-group.context'
import type { ButtonVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  variant?: ButtonVariants['variant']
  color?: ButtonVariants['color']
  size?: ButtonVariants['size']
  disabled?: boolean
  fullWidth?: boolean
  orientation?: 'horizontal' | 'vertical'
  class?: ClassValue
  /** Per-slot class overrides */
  classNames?: Partial<{
    base: ClassValue
  }>
  selectionMode?: ButtonGroupSelectionMode
  modelValue?: ButtonGroupValue
}>(), {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  disabled: false,
  fullWidth: false,
  orientation: 'horizontal',
  selectionMode: 'single',
  modelValue: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: ButtonGroupValue]
}>()

// Selected value: controlled if modelValue prop is provided, otherwise uncontrolled.
// Single mode: scalar (string|number|null). Multiple mode: array of scalars.
const internalSelected = ref<ButtonGroupValue>(props.selectionMode === 'multiple' ? [] : null)
const selectedValue = computed<ButtonGroupValue>({
  get: () => (props.modelValue !== undefined ? props.modelValue : internalSelected.value),
  set: (v) => {
    if (props.modelValue === undefined) internalSelected.value = v
    emit('update:modelValue', v)
  },
})

function isValueSelected(value: string | number | undefined): boolean {
  if (value === undefined) return false
  const current = selectedValue.value
  if (Array.isArray(current)) return current.includes(value)
  return current === value
}

function selectValue(value: string | number) {
  if (props.selectionMode === 'multiple') {
    const current = Array.isArray(selectedValue.value) ? selectedValue.value : []
    selectedValue.value = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
  } else {
    // Single mode: clicking the already-selected button deselects it
    selectedValue.value = selectedValue.value === value ? null : value
  }
}

// Provide context using toRef() for reactivity (D-11)
useButtonGroupProvide({
  variant: toRef(props, 'variant'),
  color: toRef(props, 'color'),
  size: toRef(props, 'size'),
  disabled: toRef(props, 'disabled'),
  fullWidth: toRef(props, 'fullWidth'),
  orientation: toRef(props, 'orientation'),
  selectionMode: toRef(props, 'selectionMode'),
  selectedValue,
  isValueSelected,
  selectValue,
})

const slotFns = computed(() =>
  buttonGroupVariants({
    fullWidth: props.fullWidth,
    orientation: props.orientation,
  })
)
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    :data-orientation="props.orientation"
    role="group"
  >
    <slot />
  </div>
</template>
