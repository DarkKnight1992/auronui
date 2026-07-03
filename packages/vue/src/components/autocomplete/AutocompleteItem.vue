<script setup lang="ts">
import { computed, onMounted, onUnmounted, useSlots, type Slots, type VNode } from 'vue'
import { AutocompleteItem, ComboboxItemIndicator } from 'reka-ui'
import { listboxItemVariants, autocompleteVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useAutocompleteInject } from './Autocomplete.context'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  value: string
  isDisabled?: boolean
  class?: string
  /** A string value for typeahead matching. Defaults to display text. */
  textValue?: string
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
  /** Render the ComboboxItemIndicator as a different element. */
  indicatorAs?: string
  /** Merge indicator props onto child element. */
  indicatorAsChild?: boolean
  /** Per-slot class overrides */
  classNames?: Partial<{
    item: ClassValue
    text: ClassValue
    indicator: ClassValue
  }>
}>(), {
  isDisabled: undefined,
  class: undefined,
  textValue: undefined,
  disabled: undefined,
  as: undefined,
  asChild: false,
  indicatorAs: undefined,
  indicatorAsChild: false,
})

const emit = defineEmits<{
  'select': [event: Event]
}>()

const isDisabled = useDeprecatedBooleanProp(
  'AutocompleteItem', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const slots: Slots = useSlots()
const ctx = useAutocompleteInject()
const itemSlots = listboxItemVariants()
const itemTextClass = computed(() => autocompleteVariants().itemText())

function extractText(nodes: VNode[]): string {
  return nodes.map(n => {
    if (typeof n.children === 'string') return n.children
    if (Array.isArray(n.children)) return extractText(n.children as VNode[])
    return ''
  }).join('')
}

const displayText = computed((): string => {
  const vnodes: VNode[] | undefined = (slots.default as (() => VNode[]) | undefined)?.()
  if (!vnodes) return props.value
  return extractText(vnodes).trim() || props.value
})

// In multiple mode, track whether this item is in the selected array
const isChecked = computed(() => ctx.multiple.value && ctx.isSelected(props.value))

onMounted(() => {
  ctx.registerItem(props.value, displayText.value)
})

onUnmounted(() => {
  ctx.unregisterItem(props.value)
})

function handleSelect(event: Event) {
  emit('select', event)
  if (ctx.multiple.value) {
    // Prevent Reka from overwriting the combobox value with the selected item's text.
    // Without this, Reka's internal handler fires after ours and sets searchTerm = displayText.
    event.preventDefault()
    ctx.onMultipleSelect(props.value)
  }
}
</script>

<template>
  <AutocompleteItem
    :value="displayText"
    :text-value="props.textValue ?? displayText"
    :disabled="isDisabled"
    :as="props.as"
    :as-child="props.asChild"
    :data-item-value="props.value"
    :data-selected="isChecked || undefined"
    :class="composeClassName(itemSlots.item(), props.classNames?.item)"
    data-slot="list-box-item"
    @select="handleSelect"
  >
    <slot name="startContent" />
    <span
      :class="composeClassName(itemTextClass, props.classNames?.text)"
      data-slot="item-text"
    ><slot /></span>
    <!-- Single mode: Reka's ComboboxItemIndicator handles the checkmark natively -->
    <ComboboxItemIndicator
      v-if="!ctx.multiple.value"
      :as="props.indicatorAs"
      :as-child="props.indicatorAsChild"
      :class="composeClassName(itemSlots.indicator(), props.classNames?.indicator)"
      data-slot="list-box-item-indicator"
    >
      <slot name="selectedIcon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-slot="list-box-item-indicator--checkmark"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </slot>
    </ComboboxItemIndicator>
    <!-- Multiple mode: check against our selectedValues array instead -->
    <span
      v-else-if="isChecked"
      :class="composeClassName(itemSlots.indicator(), props.classNames?.indicator)"
      data-slot="list-box-item-indicator"
    >
      <slot name="selectedIcon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-slot="list-box-item-indicator--checkmark"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </slot>
    </span>
    <slot name="endContent" />
  </AutocompleteItem>
</template>
