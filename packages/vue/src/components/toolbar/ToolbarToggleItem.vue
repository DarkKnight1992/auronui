<script setup lang="ts">
import { computed } from 'vue'
import { ToolbarToggleItem as RekaToolbarToggleItem } from 'reka-ui'
import { toggleButtonVariants, type ToggleButtonVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = defineProps<{
  value: string
  variant?: ToggleButtonVariants['variant']
  size?: ToggleButtonVariants['size']
  isIconOnly?: boolean
  disabled?: boolean
  class?: string
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>()

const classes = computed(() =>
  toggleButtonVariants({
    variant: props.variant ?? 'ghost',
    size: props.size ?? 'md',
    isIconOnly: props.isIconOnly ?? false,
  })
)
</script>

<template>
  <RekaToolbarToggleItem
    :value="props.value"
    :disabled="props.disabled"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(classes, props.class)"
  >
    <slot />
  </RekaToolbarToggleItem>
</template>
