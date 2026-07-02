<script setup lang="ts">
import { MenubarCheckboxItem, MenubarItemIndicator } from 'reka-ui'
import { menuItemVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  textValue?: string
  isDisabled?: boolean
  variant?: 'default' | 'danger'
  class?: string
  /** Controlled checked state. */
  modelValue?: boolean
  /** Whether this item is disabled. */
  disabled?: boolean
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>(), {
  textValue: undefined,
  isDisabled: false,
  variant: 'default',
  class: undefined,
  modelValue: undefined,
  disabled: undefined,
  as: undefined,
  asChild: false,
})

const emit = defineEmits<{
  select: [event: Event]
  'update:modelValue': [value: boolean]
}>()

const isSelected = defineModel<boolean>('isSelected', { default: false })

const slots = menuItemVariants({ variant: props.variant })
</script>

<template>
  <MenubarCheckboxItem
    :model-value="props.modelValue ?? isSelected"
    :text-value="props.textValue"
    :disabled="props.disabled ?? props.isDisabled"
    :as="props.as"
    :as-child="props.asChild"
    :class="[slots.item(), props.class]"
    @update:model-value="isSelected = $event; emit('update:modelValue', $event)"
    @select="emit('select', $event)"
  >
    <MenubarItemIndicator
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
    </MenubarItemIndicator>

    <slot />
  </MenubarCheckboxItem>
</template>
