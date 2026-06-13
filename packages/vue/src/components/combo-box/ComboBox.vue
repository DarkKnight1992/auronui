<script setup lang="ts">
import { computed, ref, toRef, useId, watch } from 'vue'
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

// Registry for slot-rendered items: value → label (populated by ComboBoxItem at mount).
// Replaced with a new Map instance on each mutation so Vue's ref() reactivity tracks changes.
const slotItemRegistry = ref(new Map<string, string>())

function registerItem(value: string, label: string) {
  const next = new Map(slotItemRegistry.value)
  next.set(value, label)
  slotItemRegistry.value = next
}

function unregisterItem(value: string) {
  const next = new Map(slotItemRegistry.value)
  next.delete(value)
  slotItemRegistry.value = next
}

// Resolve a user-facing value ("us") to the label text used internally by Reka.
// Priority: items prop entry > slot registry > identity fallback
function labelFor(value: string | undefined): string {
  if (!value) return ''
  const item = props.items.find(i => i.value === value)
  if (item) return item.label ?? item.textValue ?? value
  return slotItemRegistry.value.get(value) ?? value
}

// Resolve a Reka-internal label text back to the user-facing value.
function valueFor(label: string): string {
  if (!label) return ''
  // Check items prop first
  const item = props.items.find(i => (i.label ?? i.textValue ?? i.value) === label)
  if (item) return item.value
  // Check slot registry
  for (const [value, lbl] of slotItemRegistry.value) {
    if (lbl === label) return value
  }
  return label
}

// internalValue holds the label text that Reka sees as its modelValue.
// This lets Reka write the label directly into the input without a displayValue function.
const internalValue = ref(labelFor(props.modelValue))

// Map a stored value back to its human-readable label for the input display.
// Used as a no-op pass-through since internalValue already holds the label.
const displayValue = computed(() => (val: string): string => val)

// Parent → internal: when the user's v-model changes, resolve to label text
watch(() => props.modelValue, (val) => {
  const next = labelFor(val)
  if (internalValue.value !== next) internalValue.value = next
})

// Internal → parent: when Reka emits a label text (after selection), translate to real value
function handleModelValueUpdate(emitted: string) {
  internalValue.value = emitted
  emit('update:modelValue', valueFor(emitted))
}

// When slot items register (children mount after parent), re-resolve internalValue.
// This covers the case where modelValue is set before children have mounted.
watch(slotItemRegistry, () => {
  const next = labelFor(props.modelValue)
  if (next !== internalValue.value && valueFor(internalValue.value) === (props.modelValue ?? '')) {
    internalValue.value = next
  }
})

useComboBoxProvide({
  isDisabled: toRef(props, 'isDisabled'),
  isInvalid: toRef(props, 'isInvalid'),
  fullWidth: toRef(props, 'fullWidth'),
  slots: slotFns,
  displayValue,
  registerItem,
  unregisterItem,
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
      v-model="internalValue"
      :default-value="props.defaultValue ? labelFor(props.defaultValue) : undefined"
      :open="props.open"
      :default-open="props.defaultOpen"
      :disabled="props.isDisabled"
      :required="props.isRequired"
      :filter-function="effectiveFilter"
      @update:model-value="handleModelValueUpdate($event)"
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
