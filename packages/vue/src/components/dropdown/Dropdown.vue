<script setup lang="ts">
import { toRef } from 'vue'
import { DropdownMenuRoot } from 'reka-ui'
import { useDropdownProvide } from './Dropdown.context'

const props = withDefaults(defineProps<{
  isOpen?: boolean
  defaultOpen?: boolean
  modal?: boolean
  variant?: 'flat' | 'solid' | 'bordered' | 'light' | 'faded' | 'shadow'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  closeOnSelect?: boolean
  disableAnimation?: boolean
  class?: string
}>(), {
  isOpen: undefined,
  defaultOpen: undefined,
  modal: true,
  variant: undefined,
  color: undefined,
  size: undefined,
  closeOnSelect: true,
  disableAnimation: false,
  class: undefined,
})

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

useDropdownProvide({
  variant: toRef(props, 'variant'),
  color: toRef(props, 'color'),
  size: toRef(props, 'size'),
  closeOnSelect: toRef(props, 'closeOnSelect'),
  disableAnimation: toRef(props, 'disableAnimation'),
})
</script>

<template>
  <DropdownMenuRoot
    :open="props.isOpen"
    :default-open="props.defaultOpen"
    :modal="props.modal"
    @update:open="emit('update:isOpen', $event)"
  >
    <slot />
  </DropdownMenuRoot>
</template>
