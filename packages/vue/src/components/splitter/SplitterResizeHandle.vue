<script setup lang="ts">
import { computed, inject } from 'vue'
import { SplitterResizeHandle } from 'reka-ui'
import { splitterVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { splitterContextKey } from './Splitter.context'

const props = withDefaults(defineProps<{
  id?: string
  disabled?: boolean
  class?: ClassValue
  /** Per-slot class overrides */
  classNames?: Partial<{
    handle: ClassValue
    handleBar: ClassValue
  }>
  /** Hit area margins for easier grabbing */
  hitAreaMargins?: object
  /** Tab index for keyboard focus */
  tabindex?: number
  /** Nonce for inline styles */
  nonce?: string
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>(), {
  id: undefined,
  disabled: false,
  class: undefined,
  classNames: undefined,
  hitAreaMargins: undefined,
  tabindex: undefined,
  nonce: undefined,
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
    :hit-area-margins="(props.hitAreaMargins as any)"
    :tabindex="props.tabindex"
    :nonce="props.nonce"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.handle(), props.class, props.classNames?.handle)"
    data-slot="splitter-handle"
    @dragging="$emit('dragging', $event)"
  >
    <slot>
      <div :class="composeClassName(slotFns.handleBar(), props.classNames?.handleBar)" />
    </slot>
  </SplitterResizeHandle>
</template>
