<script setup lang="ts">
import { computed, provide } from 'vue'
import { SplitterGroup } from 'reka-ui'
import { splitterVariants, type SplitterVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { splitterContextKey } from './Splitter.context'

const props = withDefaults(defineProps<{
  id?: string
  direction?: SplitterVariants['direction']
  autoSaveId?: string
  class?: ClassValue
  /** Per-slot class name overrides. */
  classNames?: Partial<{
    group: ClassValue
  }>
  /** Keyboard resize increment in pixels */
  keyboardResizeBy?: number
  /** Custom storage for persisting layout */
  storage?: object
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>(), {
  id: undefined,
  direction: 'horizontal',
  autoSaveId: undefined,
  class: undefined,
  classNames: undefined,
  keyboardResizeBy: undefined,
  storage: undefined,
})

const emit = defineEmits<{
  layout: [sizes: number[]]
}>()

const slotFns = computed(() => splitterVariants({ direction: props.direction }))

provide(splitterContextKey, { direction: computed(() => props.direction ?? 'horizontal') })
</script>

<template>
  <SplitterGroup
    :id="id"
    :direction="direction ?? 'horizontal'"
    :auto-save-id="autoSaveId"
    :keyboard-resize-by="props.keyboardResizeBy"
    :storage="props.storage"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.group(), props.class, props.classNames?.group)"
    data-slot="splitter-group"
    @layout="(sizes: number[]) => emit('layout', sizes)"
  >
    <slot />
  </SplitterGroup>
</template>
