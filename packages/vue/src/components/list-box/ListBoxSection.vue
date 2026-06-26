<script setup lang="ts">
import { computed } from 'vue'
import { ListboxGroup, ListboxGroupLabel } from 'reka-ui'
import { listboxSectionVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  title?: string
  showDivider?: boolean
  class?: string
  /** Render the ListboxGroup as a different element. */
  as?: string
  /** Merge group props onto child element. */
  asChild?: boolean
  /** The id of the element the label describes (for ListboxGroupLabel). */
  for?: string
  /** Render the ListboxGroupLabel as a different element. */
  labelAs?: string
  /** Merge label props onto child element. */
  labelAsChild?: boolean
}>(), {
  title: undefined,
  showDivider: false,
  class: undefined,
  as: undefined,
  asChild: false,
  for: undefined,
  labelAs: undefined,
  labelAsChild: false,
})

const sectionClass = computed(() =>
  listboxSectionVariants()
)
</script>

<template>
  <ListboxGroup
    :as="props.as"
    :as-child="props.asChild"
    :class="sectionClass.base()"
  >
    <ListboxGroupLabel
      v-if="props.title"
      :for="props.for"
      :as="props.labelAs"
      :as-child="props.labelAsChild"
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
