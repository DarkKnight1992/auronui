<script setup lang="ts">
import { DropdownMenuRadioItem, DropdownMenuItemIndicator } from 'reka-ui'
import { menuItemVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  value: string
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

const slots = menuItemVariants({ variant: props.variant })
</script>

<template>
  <DropdownMenuRadioItem
    :value="props.value"
    :text-value="props.textValue"
    :disabled="props.isDisabled"
    :class="[slots.item(), props.class]"
  >
    <DropdownMenuItemIndicator
      :class="slots.indicator()"
      force-mount
    >
      <!-- Radio dot indicator -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="8"
        viewBox="0 0 8 8"
        aria-hidden="true"
        data-slot="menu-item-indicator--dot"
      >
        <circle
          cx="4"
          cy="4"
          r="4"
          fill="currentColor"
        />
      </svg>
    </DropdownMenuItemIndicator>

    <slot />
  </DropdownMenuRadioItem>
</template>
