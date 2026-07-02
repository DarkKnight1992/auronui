<script setup lang="ts">
import { ContextMenuRadioItem, ContextMenuItemIndicator } from 'reka-ui'
import { menuItemVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  value: string
  textValue?: string
  isDisabled?: boolean
  variant?: 'default' | 'danger'
  class?: string
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
  disabled: undefined,
  as: undefined,
  asChild: false,
})

const emit = defineEmits<{
  select: [event: Event]
}>()

const slots = menuItemVariants({ variant: props.variant })
</script>

<template>
  <ContextMenuRadioItem
    :value="props.value"
    :text-value="props.textValue"
    :disabled="props.disabled ?? props.isDisabled"
    :as="props.as"
    :as-child="props.asChild"
    :class="[slots.item(), props.class]"
    @select="emit('select', $event)"
  >
    <ContextMenuItemIndicator
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
    </ContextMenuItemIndicator>

    <slot />
  </ContextMenuRadioItem>
</template>
