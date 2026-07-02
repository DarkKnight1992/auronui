<script setup lang="ts">
import { computed } from 'vue'
import { MenubarTrigger } from 'reka-ui'
import { menubarVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  disabled?: boolean
  /** Render as a different element or component. @default 'button' (Reka's own default) */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. @default false */
  asChild?: boolean
  class?: ClassValue
}>(), {
  disabled: undefined,
  as: undefined,
  asChild: undefined,
  class: undefined,
})

const slots = computed(() => menubarVariants())
</script>

<template>
  <MenubarTrigger
    :disabled="props.disabled"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slots.trigger(), props.class)"
  >
    <slot />
  </MenubarTrigger>
</template>
