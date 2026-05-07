<script setup lang="ts">
import {
  DropdownMenuPortal,
  DropdownMenuContent,
} from 'reka-ui'
import { dropdownVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  ariaLabel?: string
  sideOffset?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  class?: string
}>(), {
  ariaLabel: undefined,
  sideOffset: 8,
  side: 'bottom',
  align: 'start',
  alignOffset: 0,
  class: undefined,
})

const slots = dropdownVariants()
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      :side="props.side"
      :align="props.align"
      :side-offset="props.sideOffset"
      :align-offset="props.alignOffset"
      :aria-label="props.ariaLabel"
      :class="[dropdownVariants, props.class]"
    >
      <div :class="slots.menu()">
        <slot />
      </div>
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
