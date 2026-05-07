<script setup lang="ts">
import { DropdownMenuSubContent, DropdownMenuPortal } from 'reka-ui'
import { dropdownVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  sideOffset?: number
  alignOffset?: number
  class?: string
}>(), {
  sideOffset: 4,
  alignOffset: -5,
  class: undefined,
})

const slots = dropdownVariants()
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuSubContent
      :side-offset="props.sideOffset"
      :align-offset="props.alignOffset"
      :class="[slots.popover(), props.class]"
    >
      <div :class="slots.menu()">
        <slot />
      </div>
    </DropdownMenuSubContent>
  </DropdownMenuPortal>
</template>
