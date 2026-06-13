<script setup lang="ts">
import { computed, onMounted, onUnmounted, useSlots, type VNode } from 'vue'
import { AutocompleteItem, ComboboxItemIndicator } from 'reka-ui'
import { useAutocompleteInject } from './Autocomplete.context'

const props = withDefaults(defineProps<{
  value: string
  isDisabled?: boolean
  class?: string
}>(), {
  isDisabled: false,
  class: undefined,
})

const slots = useSlots()
const ctx = useAutocompleteInject()

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
const displayText = computed(() => {
  const vnodes = slots.default?.()
  if (!vnodes) return props.value
  return extractText(vnodes).trim() || props.value
})

// Register this item's value→label mapping with the parent Autocomplete bridge
// so valueFor() can translate the display label back to the real value.
onMounted(() => {
  ctx.registerItem(props.value, displayText.value)
})

onUnmounted(() => {
  ctx.unregisterItem(props.value)
})
</script>

<template>
  <AutocompleteItem
    :value="displayText"
    :text-value="displayText"
    :disabled="props.isDisabled"
    :data-item-value="props.value"
    class="list-box-item list-box-item--default"
    data-slot="list-box-item"
  >
    <slot name="startContent" />
    <span
      class="autocomplete-item__text"
      data-slot="item-text"
    ><slot /></span>
    <ComboboxItemIndicator
      class="list-box-item__indicator"
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
  </AutocompleteItem>
</template>
