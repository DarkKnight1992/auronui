<script setup lang="ts">
import { DropdownMenuCheckboxItem, DropdownMenuItemIndicator } from 'reka-ui'
import { menuItemVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  textValue?: string
  isDisabled?: boolean
  variant?: 'default' | 'danger'
  class?: string
}>(), {
  textValue: undefined,
  isDisabled: false,
  variant: 'default',
  class: undefined,
})

const isSelected = defineModel<boolean>('isSelected', { default: false })

const slots = menuItemVariants({ variant: props.variant })
</script>

<template>
  <DropdownMenuCheckboxItem
    :model-value="isSelected"
    :text-value="props.textValue"
    :disabled="props.isDisabled"
    :class="[slots.item(), props.class]"
    @update:model-value="isSelected = $event"
  >
    <DropdownMenuItemIndicator
      :class="slots.indicator()"
      force-mount
    >
      <!-- Checkmark indicator -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        data-slot="menu-item-indicator--checkmark"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </DropdownMenuItemIndicator>

    <slot />
  </DropdownMenuCheckboxItem>
</template>
