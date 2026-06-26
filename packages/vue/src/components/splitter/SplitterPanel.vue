<script setup lang="ts">
import { computed } from 'vue'
import { SplitterPanel } from 'reka-ui'
import { splitterVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  id?: string
  defaultSize?: number
  minSize?: number
  maxSize?: number
  collapsible?: boolean
  collapsedSize?: number
  order?: number
  class?: ClassValue
  /** Override classes for individual slots. */
  classNames?: Partial<{
    panel: ClassValue
  }>
  /** Unit for size values: 'percentage' or 'pixels' */
  sizeUnit?: 'percentage' | 'pixels'
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>(), {
  id: undefined,
  defaultSize: undefined,
  minSize: undefined,
  maxSize: undefined,
  collapsible: false,
  collapsedSize: undefined,
  order: undefined,
  class: undefined,
  classNames: undefined,
  sizeUnit: undefined,
})

const emit = defineEmits<{
  collapse: []
  expand: []
  resize: [size: number]
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
    :size-unit="props.sizeUnit"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.panel(), props.class, props.classNames?.panel)"
    data-slot="splitter-panel"
    @collapse="emit('collapse')"
    @expand="emit('expand')"
    @resize="(size: number) => emit('resize', size)"
  >
    <slot />
  </SplitterPanel>
</template>
