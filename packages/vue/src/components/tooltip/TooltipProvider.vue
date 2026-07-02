<script setup lang="ts">
import { TooltipProvider } from 'reka-ui'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
  disableClosingTrigger?: boolean
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  ignoreNonKeyboardFocus?: boolean
  content?: object
}>(), {
  delayDuration: 700,
  skipDelayDuration: 300,
  disableHoverableContent: false,
  disableClosingTrigger: false,
  isDisabled: undefined,
  disabled: undefined,
  ignoreNonKeyboardFocus: false,
})

const isDisabled = useDeprecatedBooleanProp(
  'TooltipProvider', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)
</script>

<template>
  <TooltipProvider
    :delay-duration="props.delayDuration"
    :skip-delay-duration="props.skipDelayDuration"
    :disable-hoverable-content="props.disableHoverableContent"
    :disable-closing-trigger="props.disableClosingTrigger"
    :disabled="isDisabled"
    :ignore-non-keyboard-focus="props.ignoreNonKeyboardFocus"
    :content="props.content"
  >
    <slot />
  </TooltipProvider>
</template>
