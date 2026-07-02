<script setup lang="ts">
import { PopoverClose } from 'reka-ui'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  as?: string | object
  asChild?: boolean
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  class?: string
}>(), {
  isDisabled: undefined,
  disabled: undefined,
})

const isDisabled = useDeprecatedBooleanProp(
  'PopoverClose', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)
</script>

<template>
  <PopoverClose
    :as="props.as"
    :as-child="props.asChild"
    :disabled="isDisabled"
    :class="props.class"
    v-bind="$attrs"
  >
    <slot />
  </PopoverClose>
</template>
