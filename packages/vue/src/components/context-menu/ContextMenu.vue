<script setup lang="ts">
import { ContextMenuRoot } from 'reka-ui'

const props = withDefaults(defineProps<{
  /** The modality of the context menu. When true, interaction with outside elements is disabled. @default true */
  modal?: boolean
  /** Text direction. */
  dir?: 'ltr' | 'rtl'
  /** Duration from when the trigger is pressed until the menu opens (touch/long-press). @default 700 */
  pressOpenDelay?: number
}>(), {
  modal: true,
  pressOpenDelay: 700,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <ContextMenuRoot
    :modal="props.modal"
    :dir="props.dir"
    :press-open-delay="props.pressOpenDelay"
    @update:open="emit('update:open', $event)"
  >
    <slot />
  </ContextMenuRoot>
</template>
