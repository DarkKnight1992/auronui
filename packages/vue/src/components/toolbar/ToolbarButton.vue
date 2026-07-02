<script setup lang="ts">
import { computed } from 'vue'
import { ToolbarButton as RekaToolbarButton } from 'reka-ui'
import { toggleButtonVariants, type ToggleButtonVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  variant?: ToggleButtonVariants['variant']
  size?: ToggleButtonVariants['size']
  isIconOnly?: boolean
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  class?: string
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>(), {
  isDisabled: undefined,
  disabled: undefined,
})

const isDisabled = useDeprecatedBooleanProp(
  'ToolbarButton', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const classes = computed(() =>
  toggleButtonVariants({
    variant: props.variant ?? 'ghost',
    size: props.size ?? 'md',
    isIconOnly: props.isIconOnly ?? false,
  })
)
</script>

<template>
  <RekaToolbarButton
    :disabled="isDisabled"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(classes, props.class)"
  >
    <slot />
  </RekaToolbarButton>
</template>
