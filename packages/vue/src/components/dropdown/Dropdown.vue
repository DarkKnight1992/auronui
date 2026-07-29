<script setup lang="ts">
import { toRef } from 'vue'
import { DropdownMenuRoot } from 'reka-ui'
import { useDropdownProvide } from './Dropdown.context'

const props = withDefaults(defineProps<{
  isOpen?: boolean
  defaultOpen?: boolean
  modal?: boolean
  /**
   * Published to descendants through the Dropdown context for custom items to
   * read. `dropdownVariants` defines no variants, so this applies no styling of
   * its own — style DropdownItem with its own `variant` prop instead.
   */
  variant?: 'flat' | 'solid' | 'bordered' | 'light' | 'faded' | 'shadow'
  /** Context-only, like `variant` — applies no styling on its own. */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  /** Context-only, like `variant` — applies no styling on its own. */
  size?: 'sm' | 'md' | 'lg'
  closeOnSelect?: boolean
  disableAnimation?: boolean
  class?: string
  /** Controlled open state of the dropdown. */
  open?: boolean
  /** Text direction for the dropdown. */
  dir?: 'ltr' | 'rtl'
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
  open: undefined,
  dir: undefined,
})

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'update:open': [value: boolean]
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
    :open="props.open ?? props.isOpen"
    :default-open="props.defaultOpen"
    :modal="props.modal"
    :dir="props.dir"
    @update:open="emit('update:isOpen', $event); emit('update:open', $event)"
  >
    <slot />
  </DropdownMenuRoot>
</template>
