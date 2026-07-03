<script setup lang="ts">
import { computed, onMounted, onUnmounted, useSlots, type Slots, type VNode } from 'vue'
import { ComboboxItem, ComboboxItemIndicator } from 'reka-ui'
import { listboxItemVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useComboBoxInject } from './ComboBox.context'
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
  'ComboBoxItem', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const slots: Slots = useSlots()
const ctx = useComboBoxInject()
const itemSlots = listboxItemVariants()

// Extract plain text from default slot VNodes at render time.
function extractText(nodes: VNode[]): string {
  return nodes.map(n => {
    if (typeof n.children === 'string') return n.children
    if (Array.isArray(n.children)) return extractText(n.children as VNode[])
    return ''
  }).join('')
}

// The display text Reka writes into the input when this item is selected.
// Reads slot text content — no extra props needed.
const displayText = computed((): string => {
  const vnodes: VNode[] | undefined = (slots.default as (() => VNode[]) | undefined)?.()
  if (!vnodes) return props.value
  return extractText(vnodes).trim() || props.value
})

// Register this item's value→label mapping with the parent ComboBox bridge
// so displayValue() and handleModelValueUpdate() can translate correctly.
onMounted(() => {
  ctx.registerItem(props.value, displayText.value)
})

onUnmounted(() => {
  ctx.unregisterItem(props.value)
})
</script>

<template>
  <ComboboxItem
    :value="displayText"
    :text-value="props.textValue ?? displayText"
    :disabled="isDisabled"
    :as="props.as"
    :as-child="props.asChild"
    :data-item-value="props.value"
    :class="composeClassName(itemSlots.item(), props.classNames?.item)"
    data-slot="list-box-item"
    @select="emit('select', $event)"
  >
    <slot name="startContent" />
    <slot />
    <ComboboxItemIndicator
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
    <slot name="endContent" />
  </ComboboxItem>
</template>
