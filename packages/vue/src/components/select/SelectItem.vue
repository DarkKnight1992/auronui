<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { SelectItem, SelectItemText, SelectItemIndicator } from 'reka-ui'
import { useSelectInject } from './Select.context'

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

const ctx = useSelectInject()
const textRef = useTemplateRef<HTMLElement>('textRef')

onMounted(() => {
  const label = props.textValue ?? textRef.value?.textContent?.trim() ?? props.value
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
