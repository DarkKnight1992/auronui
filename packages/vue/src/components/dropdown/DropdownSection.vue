<script setup lang="ts">
import { DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator } from 'reka-ui'
import { menuSectionVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  title?: string
  showDivider?: boolean
  class?: string
}>(), {
  title: undefined,
  showDivider: false,
  class: undefined,
})

const sectionClass = menuSectionVariants()
</script>

<template>
  <DropdownMenuGroup :class="[sectionClass.base(), props.class]">
    <DropdownMenuLabel
      v-if="props.title"
      :class="sectionClass.label()"
      class="px-2 py-1 text-[10px] font-semibold tracking-widest text-default-200 uppercase"
    >
      {{ props.title }}
    </DropdownMenuLabel>
    <slot />
    <DropdownMenuSeparator
      v-if="props.showDivider"
      :class="sectionClass.separator()"
    />
  </DropdownMenuGroup>
</template>
