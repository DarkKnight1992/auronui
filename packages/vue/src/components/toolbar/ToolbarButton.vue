<script setup lang="ts">
import { computed } from 'vue'
import { ToolbarButton as RekaToolbarButton } from 'reka-ui'
import { toggleButtonVariants, type ToggleButtonVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = defineProps<{
  variant?: ToggleButtonVariants['variant']
  size?: ToggleButtonVariants['size']
  isIconOnly?: boolean
  disabled?: boolean
  class?: string
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
  <RekaToolbarButton
    :disabled="props.disabled"
    :class="composeClassName(classes, props.class)"
  >
    <slot />
  </RekaToolbarButton>
</template>
