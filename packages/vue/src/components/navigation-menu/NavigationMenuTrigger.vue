<script setup lang="ts">
import { navigationMenuVariants } from '@auronui/styles'
import { NavigationMenuTrigger } from 'reka-ui'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  /** Render as a different element or component. @default 'button' (Reka's own default) */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. @default false */
  asChild?: boolean
  class?: ClassValue
}>(), {
  isDisabled: undefined,
  disabled: undefined,
  as: undefined,
  asChild: undefined,
  class: undefined,
})

const isDisabled = useDeprecatedBooleanProp(
  'NavigationMenuTrigger', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const slotFns = navigationMenuVariants()
</script>

<template>
  <NavigationMenuTrigger
    :disabled="isDisabled"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.trigger(), props.class)"
  >
    <slot />
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
      aria-hidden="true"
      data-slot="navigation-menu-trigger--chevron"
      :class="slotFns.chevron()"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </NavigationMenuTrigger>
</template>
