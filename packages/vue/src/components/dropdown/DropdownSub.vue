<script setup lang="ts">
import { ref, toRef } from 'vue'
import { DropdownMenuSub } from 'reka-ui'
import { useDropdownSubProvide } from './DropdownSub.context'

const props = withDefaults(defineProps<{
  open?: boolean
  defaultOpen?: boolean
  openOnHover?: boolean
}>(), {
  open: undefined,
  defaultOpen: undefined,
  openOnHover: true,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const internalOpen = ref(props.open ?? props.defaultOpen ?? false)

function setOpen(value: boolean) {
  internalOpen.value = value
  emit('update:open', value)
}

useDropdownSubProvide({
  openOnHover: toRef(props, 'openOnHover'),
  open: internalOpen,
  setOpen,
})
</script>

<template>
  <DropdownMenuSub
    :open="internalOpen"
    @update:open="setOpen"
  >
    <slot />
  </DropdownMenuSub>
</template>
