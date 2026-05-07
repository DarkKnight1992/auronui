<script setup lang="ts">
import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  class?: string
  viewportClass?: string
  type?: 'auto' | 'always' | 'scroll' | 'hover'
  scrollHideDelay?: number
  orientation?: 'vertical' | 'horizontal' | 'both'
}>(), {
  type: 'hover',
  scrollHideDelay: 600,
  orientation: 'vertical',
})
</script>

<template>
  <ScrollAreaRoot
    :type="props.type"
    :scroll-hide-delay="props.scrollHideDelay"
    :class="composeClassName('scroll-area__root', props.class)"
  >
    <ScrollAreaViewport :class="composeClassName('scroll-area__viewport', props.viewportClass)">
      <slot />
    </ScrollAreaViewport>

    <ScrollAreaScrollbar
      v-if="props.orientation === 'vertical' || props.orientation === 'both'"
      orientation="vertical"
      class="scroll-area__scrollbar scroll-area__scrollbar--vertical"
    >
      <ScrollAreaThumb class="scroll-area__thumb" />
    </ScrollAreaScrollbar>

    <ScrollAreaScrollbar
      v-if="props.orientation === 'horizontal' || props.orientation === 'both'"
      orientation="horizontal"
      class="scroll-area__scrollbar scroll-area__scrollbar--horizontal"
    >
      <ScrollAreaThumb class="scroll-area__thumb" />
    </ScrollAreaScrollbar>

    <ScrollAreaCorner
      v-if="props.orientation === 'both'"
      class="scroll-area__corner"
    />
  </ScrollAreaRoot>
</template>
