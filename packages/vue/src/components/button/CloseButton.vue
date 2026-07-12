<script setup lang="ts">
import Button from './Button.vue'
import type { ButtonVariants } from '@auronui/styles'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  size?: ButtonVariants['size']
  variant?: ButtonVariants['variant']
  color?: ButtonVariants['color']
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  isLoading?: boolean
  ariaLabel?: string
  class?: string
}>(), {
  size: 'md',
  variant: 'ghost',
  color: undefined,
  isDisabled: undefined,
  disabled: undefined,
  isLoading: false,
  ariaLabel: 'Close',
})

const isDisabled = useDeprecatedBooleanProp(
  'CloseButton', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)
</script>

<template>
  <Button
    :variant="props.variant"
    :color="props.color"
    :is-icon-only="true"
    :size="props.size"
    :is-disabled="isDisabled"
    :is-loading="props.isLoading"
    :aria-label="props.ariaLabel"
    :class="props.class"
  >
    <!-- D-16: Inline SVG X glyph — 16×16 viewBox, 2px stroke, currentColor -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <line
        x1="18"
        y1="6"
        x2="6"
        y2="18"
      />
      <line
        x1="6"
        y1="6"
        x2="18"
        y2="18"
      />
    </svg>
  </Button>
</template>
