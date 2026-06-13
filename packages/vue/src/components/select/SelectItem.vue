<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { SelectItem, SelectItemText, SelectItemIndicator } from 'reka-ui'
import { useSelectInject } from './Select.context'

const props = withDefaults(defineProps<{
  value: string
  /**
   * Explicit human-readable label for this item. When provided, the registry is
   * populated immediately at setup time (before the dropdown is ever opened),
   * so SelectValue can display the correct label for a pre-set modelValue.
   * When omitted, the label is read from slot DOM text on first mount.
   */
  textValue?: string
  isDisabled?: boolean
  class?: string
}>(), {
  textValue: undefined,
  isDisabled: false,
  class: undefined,
})

const ctx = useSelectInject()
const textRef = useTemplateRef<HTMLElement>('textRef')

// Register immediately with textValue if provided — this runs at setup time,
// before mount, so SelectValue shows the correct label for a pre-set modelValue
// even before the dropdown has ever been opened.
if (props.textValue !== undefined) {
  ctx.registerItem(props.value, props.textValue)
}

onMounted(() => {
  // textRef points to the SelectItemText component instance (not a DOM element).
  // Access $el to get the underlying span element and read its text content.
  // This refines the registry entry with actual DOM text (handles slot-text items
  // that don't have an explicit textValue prop).
  const el = (textRef.value as { $el?: HTMLElement } | null)?.$el
  const label = props.textValue ?? el?.textContent?.trim() ?? props.value
  ctx.registerItem(props.value, label)
})
</script>

<template>
  <SelectItem
    :value="props.value"
    :disabled="props.isDisabled"
    :text-value="props.textValue ?? props.value"
    class="list-box-item list-box-item--default"
    data-slot="list-box-item"
  >
    <slot name="startContent" />
    <SelectItemText ref="textRef">
      <slot />
    </SelectItemText>
    <SelectItemIndicator
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
    </SelectItemIndicator>
    <slot name="endContent" />
  </SelectItem>
</template>
