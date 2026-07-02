<script setup lang="ts">
import { ContextMenuTrigger } from 'reka-ui'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  /** When true, the context menu does not open on right-click — the native browser context menu is restored. */
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
  'ContextMenuTrigger', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)
</script>

<template>
  <ContextMenuTrigger
    :disabled="isDisabled"
    :as="props.as"
    :as-child="props.asChild"
  >
    <slot />
  </ContextMenuTrigger>
</template>
