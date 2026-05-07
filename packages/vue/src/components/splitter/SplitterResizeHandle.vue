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
}>(), {
  id: undefined,
  disabled: false,
  class: undefined,
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
    :class="composeClassName(slotFns.handle(), props.class)"
    data-slot="splitter-handle"
    @dragging="$emit('dragging', $event)"
  >
    <slot>
      <div :class="slotFns.handleBar()" />
    </slot>
  </SplitterResizeHandle>
</template>
