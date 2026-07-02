<script setup lang="ts">
import { ContextMenuSubTrigger } from 'reka-ui'
import { menuItemVariants } from '@auronui/styles'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  textValue?: string
  class?: string
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>(), {
  isDisabled: undefined,
  textValue: undefined,
  class: undefined,
  disabled: undefined,
  as: undefined,
  asChild: false,
})

const slots = menuItemVariants({ variant: 'default' })

const isDisabled = useDeprecatedBooleanProp(
  'ContextMenuSubTrigger', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)
</script>

<template>
  <ContextMenuSubTrigger
    :disabled="isDisabled"
    :text-value="props.textValue"
    :as="props.as"
    :as-child="props.asChild"
    :class="[slots.item(), props.class]"
  >
    <slot />
    <span
      :class="slots.submenuIndicator()"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        data-slot="submenu-indicator"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </span>
  </ContextMenuSubTrigger>
</template>
