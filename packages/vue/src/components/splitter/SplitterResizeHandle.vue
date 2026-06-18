<script setup lang="ts">
import { computed, inject } from 'vue'
import { SplitterResizeHandle } from 'reka-ui'
import { splitterVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { splitterContextKey } from './Splitter.context'

const props = withDefaults(defineProps<{
  id?: string
  disabled?: boolean
  class?: string
  /** Per-slot class overrides */
  classNames?: Partial<{
    handle: string
    handleBar: string
  }>
}>(), {
  id: undefined,
  disabled: false,
  class: undefined,
  classNames: undefined,
})

defineEmits<{
  dragging: [isDragging: boolean]
}>()

const groupCtx = inject(splitterContextKey, null)
const slotFns = computed(() =>
  splitterVariants({ direction: groupCtx?.direction.value ?? 'horizontal' }),
)
</script>

<template>
  <SplitterResizeHandle
    :id="id"
    :disabled="disabled"
    :class="composeClassName(slotFns.handle(), props.class, props.classNames?.handle)"
    data-slot="splitter-handle"
    @dragging="$emit('dragging', $event)"
  >
    <slot>
      <div :class="composeClassName(slotFns.handleBar(), props.classNames?.handleBar)" />
    </slot>
  </SplitterResizeHandle>
</template>
