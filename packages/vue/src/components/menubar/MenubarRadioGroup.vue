<script setup lang="ts">
import { MenubarRadioGroup } from 'reka-ui'
import type { AcceptableValue } from 'reka-ui'

const props = withDefaults(defineProps<{
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>(), {
  as: undefined,
  asChild: false,
})

const modelValue = defineModel<AcceptableValue>({ default: '' })
</script>

<template>
  <MenubarRadioGroup
    :model-value="modelValue"
    :as="props.as"
    :as-child="props.asChild"
    @update:model-value="modelValue = $event"
  >
    <slot />
  </MenubarRadioGroup>
</template>
