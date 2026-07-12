<script setup lang="ts">
import { MenubarGroup, MenubarLabel, MenubarSeparator } from 'reka-ui'
import { menuSectionVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  title?: string
  showDivider?: boolean
  class?: string
  /** Render as a different element or component (applied to the group wrapper). */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>(), {
  title: undefined,
  showDivider: false,
  class: undefined,
  as: undefined,
  asChild: false,
})

const sectionClass = menuSectionVariants()
</script>

<template>
  <MenubarGroup
    :as="props.as"
    :as-child="props.asChild"
    :class="[sectionClass.base(), props.class]"
  >
    <MenubarLabel
      v-if="props.title"
      :class="sectionClass.label()"
      class="px-2 py-1 text-[10px] font-semibold tracking-widest text-default-200 uppercase"
    >
      {{ props.title }}
    </MenubarLabel>
    <slot />
    <MenubarSeparator
      v-if="props.showDivider"
      :class="sectionClass.separator()"
    />
  </MenubarGroup>
</template>
