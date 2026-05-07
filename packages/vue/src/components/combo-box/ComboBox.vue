<script setup lang="ts">
import { computed, toRef, useId } from 'vue'
import { ComboboxRoot } from 'reka-ui'
import { comboBoxVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useComboBoxProvide } from './ComboBox.context'

export interface ComboBoxItem {
  value: string
  label?: string
  textValue?: string
  isDisabled?: boolean
}

const props = withDefaults(defineProps<{
  modelValue?: string
  defaultValue?: string
  open?: boolean
  defaultOpen?: boolean
  items?: ComboBoxItem[]
  label?: string
  placeholder?: string
  description?: string
  errorMessage?: string
  isInvalid?: boolean
  isDisabled?: boolean
  isRequired?: boolean
  allowsCustomValue?: boolean
  fullWidth?: boolean
  /** Custom filter function: return true to include item */
  filterFunction?: (item: string, searchTerm: string) => boolean
  class?: string
}>(), {
  modelValue: undefined,
  defaultValue: undefined,
  open: undefined,
  defaultOpen: undefined,
  items: () => [],
  label: undefined,
  placeholder: undefined,
  description: undefined,
  errorMessage: undefined,
  isInvalid: false,
  isDisabled: false,
  isRequired: false,
  allowsCustomValue: false,
  fullWidth: false,
  filterFunction: undefined,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:open': [value: boolean]
}>()

const labelId = useId()

const slotFns = computed(() =>
  comboBoxVariants({
    fullWidth: props.fullWidth,
  })
)

// Default filter: case-insensitive substring match
const effectiveFilter = computed(() => {
  if (props.filterFunction) return props.filterFunction
  return (itemText: string, searchTerm: string): boolean =>
    itemText.toLowerCase().includes(searchTerm.toLowerCase())
})

// Map a stored value back to its human-readable label for the input display
const displayValue = computed(() => (val: string): string => {
  if (!val) return ''
  const item = props.items.find(i => i.value === val)
  return item?.label ?? item?.textValue ?? val
})

useComboBoxProvide({
  isDisabled: toRef(props, 'isDisabled'),
  isInvalid: toRef(props, 'isInvalid'),
  fullWidth: toRef(props, 'fullWidth'),
  slots: slotFns,
  displayValue,
})
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class)"
    :aria-invalid="props.isInvalid || undefined"
    data-slot="combo-box"
  >
    <label
      v-if="props.label"
      :id="labelId"
      data-slot="label"
    >
      {{ props.label }}
      <span
        v-if="props.isRequired"
        aria-hidden="true"
      > *</span>
    </label>

    <ComboboxRoot
      :model-value="props.modelValue"
      :default-value="props.defaultValue"
      :open="props.open"
      :default-open="props.defaultOpen"
      :disabled="props.isDisabled"
      :required="props.isRequired"
      :filter-function="effectiveFilter"
      @update:model-value="emit('update:modelValue', $event)"
      @update:open="emit('update:open', $event)"
    >
      <slot />
    </ComboboxRoot>

    <div
      v-if="props.description || (props.isInvalid && props.errorMessage)"
      data-slot="helper-wrapper"
    >
      <p
        v-if="props.isInvalid && props.errorMessage"
        data-slot="error-message"
        aria-live="polite"
      >
        {{ props.errorMessage }}
      </p>
      <p
        v-else-if="props.description"
        data-slot="description"
      >
        {{ props.description }}
      </p>
    </div>
  </div>
</template>
