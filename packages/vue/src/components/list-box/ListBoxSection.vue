<script setup lang="ts">
import { computed } from 'vue'
import { ListboxGroup, ListboxGroupLabel } from 'reka-ui'
import { listboxSectionVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  title?: string
  showDivider?: boolean
  class?: string
}>(), {
  title: undefined,
  showDivider: false,
  class: undefined,
})

const sectionClass = computed(() =>
  listboxSectionVariants()
)
</script>

<template>
  <ListboxGroup :class="sectionClass.base()">
    <ListboxGroupLabel
      v-if="props.title"
      :class="sectionClass.label()"
    >
      {{ props.title }}
    </ListboxGroupLabel>
    <slot />
    <div
      v-if="props.showDivider"
      role="separator"
      aria-orientation="horizontal"
      data-slot="separator"
      data-orientation="horizontal"
      :class="sectionClass.separator()"
    />
  </ListboxGroup>
</template>
