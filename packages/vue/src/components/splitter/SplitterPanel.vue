<script setup lang="ts">
import { computed } from 'vue'
import { SplitterPanel } from 'reka-ui'
import { splitterVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  id?: string
  defaultSize?: number
  minSize?: number
  maxSize?: number
  collapsible?: boolean
  collapsedSize?: number
  order?: number
  class?: string
}>(), {
  id: undefined,
  defaultSize: undefined,
  minSize: undefined,
  maxSize: undefined,
  collapsible: false,
  collapsedSize: undefined,
  order: undefined,
  class: undefined,
})

defineEmits<{
  collapse: []
  expand: []
}>()

const slotFns = computed(() => splitterVariants())
</script>

<template>
  <SplitterPanel
    :id="id"
    :default-size="defaultSize"
    :min-size="minSize"
    :max-size="maxSize"
    :collapsible="collapsible"
    :collapsed-size="collapsedSize"
    :order="order"
    :class="composeClassName(slotFns.panel(), props.class)"
    data-slot="splitter-panel"
    @collapse="$emit('collapse')"
    @expand="$emit('expand')"
  >
    <slot />
  </SplitterPanel>
</template>
