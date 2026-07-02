<script setup lang="ts">
import { MenubarRadioItem, MenubarItemIndicator } from 'reka-ui'
import { menuItemVariants } from '@auronui/styles'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  value: string
  textValue?: string
  isDisabled?: boolean
  variant?: 'default' | 'danger'
  class?: string
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
  disabled: undefined,
  as: undefined,
  asChild: false,
})

const emit = defineEmits<{
  select: [event: Event]
}>()

const slots = menuItemVariants({ variant: props.variant })

const isDisabled = useDeprecatedBooleanProp(
  'MenubarRadioItem', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)
</script>

<template>
  <MenubarRadioItem
    :value="props.value"
    :text-value="props.textValue"
    :disabled="isDisabled"
    :as="props.as"
    :as-child="props.asChild"
    :class="[slots.item(), props.class]"
    @select="emit('select', $event)"
  >
    <MenubarItemIndicator
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
    </MenubarItemIndicator>

    <slot />
  </MenubarRadioItem>
</template>
