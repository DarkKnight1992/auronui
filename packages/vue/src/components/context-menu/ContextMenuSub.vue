<script setup lang="ts">
import { ContextMenuSub } from 'reka-ui'

const props = withDefaults(defineProps<{
  /** The open state of the submenu when it is initially rendered. */
  defaultOpen?: boolean
  /** Controlled open state of the submenu. */
  open?: boolean
}>(), {
  defaultOpen: undefined,
  open: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <ContextMenuSub
    :default-open="props.defaultOpen"
    :open="props.open"
    @update:open="emit('update:open', $event)"
  >
    <slot />
  </ContextMenuSub>
</template>
