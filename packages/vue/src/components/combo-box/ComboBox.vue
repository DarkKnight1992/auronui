<script setup lang="ts">
import { computed, ref, toRef, useId, useSlots, watch } from 'vue'
import { ComboboxRoot } from 'reka-ui'
import { comboBoxVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useComboBoxProvide } from './ComboBox.context'
import { hasSlotComponent } from '../../utils/hasSlotComponent'
import ComboBoxInput from './ComboBoxInput.vue'
import ComboBoxContent from './ComboBoxContent.vue'
import ComboBoxItem from './ComboBoxItem.vue'

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
  class?: ClassValue
  /** Override classes for individual slots */
  classNames?: Partial<{
    base: ClassValue
    item: ClassValue
    indicator: ClassValue
  }>
  /** Reset search term when user blurs the input. */
  resetSearchTermOnBlur?: boolean
  /** Reset search term after an item is selected. */
  resetSearchTermOnSelect?: boolean
  /** Open dropdown when the input gains focus. */
  openOnFocus?: boolean
  /** Open dropdown when the input is clicked. */
  openOnClick?: boolean
  /** Disable Reka's built-in filter; handle filtering externally. */
  ignoreFilter?: boolean
  /** Reset modelValue when the input is cleared. */
  resetModelValueOnClear?: boolean
  /** Allow selecting multiple values. */
  multiple?: boolean
  /** Reading direction for the component. */
  dir?: 'ltr' | 'rtl'
  /** Highlight the matching item on hover. */
  highlightOnHover?: boolean
  /** Key to compare items by for selection equality. */
  by?: string
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
  /** Form field name for native form submission. */
  name?: string
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
  classNames: undefined,
  resetSearchTermOnBlur: undefined,
  resetSearchTermOnSelect: undefined,
  openOnFocus: undefined,
  openOnClick: undefined,
  ignoreFilter: undefined,
  resetModelValueOnClear: undefined,
  multiple: false,
  dir: undefined,
  highlightOnHover: undefined,
  by: undefined,
  as: undefined,
  asChild: false,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:open': [value: boolean]
  'highlight': [context: { ref: Element; value: string } | undefined]
}>()

const labelId = useId()

const slots = useSlots()
// Compound chrome present → pass slot through (advanced). Otherwise render the
// input/content/items internally (short-form).
const usesCustomChrome = computed(() =>
  hasSlotComponent(slots.default?.({}), [ComboBoxInput, ComboBoxContent]),
)

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
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
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
      :multiple="props.multiple"
      :name="props.name"
      :dir="props.dir"
      :as="props.as"
      :as-child="props.asChild"
      :reset-search-term-on-blur="props.resetSearchTermOnBlur"
      :reset-search-term-on-select="props.resetSearchTermOnSelect"
      :open-on-focus="props.openOnFocus"
      :open-on-click="props.openOnClick"
      :ignore-filter="props.ignoreFilter"
      :reset-model-value-on-clear="props.resetModelValueOnClear"
      :highlight-on-hover="props.highlightOnHover"
      :by="props.by"
      :filter-function="effectiveFilter"
      @update:model-value="handleModelValueUpdate($event)"
      @update:open="emit('update:open', $event)"
      @highlight="emit('highlight', $event)"
    >
      <slot v-if="usesCustomChrome" />
      <template v-else>
        <ComboBoxInput :placeholder="props.placeholder" />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in props.items"
            :key="item.value"
            :value="item.value"
            :is-disabled="item.isDisabled"
            :class-names="{ item: props.classNames?.item, indicator: props.classNames?.indicator }"
          >
            <slot
              name="item"
              :item="item"
            >{{ item.label ?? item.textValue ?? item.value }}</slot>
          </ComboBoxItem>
        </ComboBoxContent>
      </template>
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
