<script setup lang="ts">
import { AutocompleteItem, ComboboxItemIndicator } from 'reka-ui'

const props = withDefaults(defineProps<{
  value: string
  textValue?: string
  isDisabled?: boolean
  class?: string
}>(), {
  textValue: undefined,
  isDisabled: false,
  class: undefined,
})
</script>

<template>
  <AutocompleteItem
    :value="props.textValue ?? props.value"
    :text-value="props.textValue ?? props.value"
    :disabled="props.isDisabled"
    :data-item-value="props.value"
    class="list-box-item list-box-item--default"
    data-slot="list-box-item"
  >
    <slot name="startContent" />
    <slot />
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
