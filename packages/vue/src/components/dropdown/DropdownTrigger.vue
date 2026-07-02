<script setup lang="ts">
import { DropdownMenuTrigger } from 'reka-ui'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  /** Whether the trigger is disabled. */
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>(), {
  isDisabled: undefined,
  disabled: undefined,
  as: undefined,
  asChild: true,
})

const isDisabled = useDeprecatedBooleanProp(
  'DropdownTrigger', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)
</script>

<template>
  <DropdownMenuTrigger
    :disabled="isDisabled"
    :as="props.as"
    :as-child="props.asChild"
  >
    <slot />
  </DropdownMenuTrigger>
</template>
