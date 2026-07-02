<script setup lang="ts">
import { MenubarCheckboxItem, MenubarItemIndicator } from 'reka-ui'
import { menuItemVariants } from '@auronui/styles'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  textValue?: string
  isDisabled?: boolean
  variant?: 'default' | 'danger'
  class?: string
  /** Controlled checked state. */
  modelValue?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>(), {
  textValue: undefined,
  isDisabled: undefined,
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

const isDisabled = useDeprecatedBooleanProp(
  'MenubarCheckboxItem', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)
</script>

<template>
  <MenubarCheckboxItem
    :model-value="props.modelValue ?? isSelected"
    :text-value="props.textValue"
    :disabled="isDisabled"
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
