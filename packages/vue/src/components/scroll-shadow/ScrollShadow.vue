<!--
  ScrollShadow — An overflow container that shows/hides top/bottom (or left/right)
  shadows based on scroll position.

  Implementation: Uses @vueuse/core useScroll to detect arrivedState (top/bottom/left/right).
  Data-attributes drive shadow visibility via CSS mask-image in @auronui/styles.

  Data-attribute semantics (matches scroll-shadow.css):
    data-top-scroll="true"    → content exists ABOVE current viewport (scrolled down) → top shadow shown
    data-bottom-scroll="true" → content exists BELOW current viewport → bottom shadow shown
    data-left-scroll="true"   → content exists to the LEFT (scrolled right) → left shadow shown
    data-right-scroll="true"  → content exists to the RIGHT → right shadow shown

  Note: CLAUDE.md Reka UI CSS selector pairing rule (pseudo + data-attr) does not apply
  here because ScrollShadow is a custom component with no Reka UI backing.
-->
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useScroll } from '@vueuse/core'
import { scrollShadowVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  orientation?: 'vertical' | 'horizontal' | 'both'
  hideScrollBar?: boolean
  size?: number
  offset?: number
  visibility?: 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'both' | 'none'
  class?: string
}>(), {
  orientation: 'vertical',
  hideScrollBar: false,
  size: 40,
  offset: 0,
  visibility: 'auto',
})

const container = useTemplateRef<HTMLElement>('container')
const { arrivedState } = useScroll(container)

// data-top-scroll="true" when there IS content above (i.e., NOT at top edge)
const topScroll = computed(() => !arrivedState.top || undefined)
// data-bottom-scroll="true" when there IS content below (i.e., NOT at bottom edge)
const bottomScroll = computed(() => !arrivedState.bottom || undefined)
// data-left-scroll="true" when there IS content to the left (i.e., NOT at left edge)
const leftScroll = computed(() => !arrivedState.left || undefined)
// data-right-scroll="true" when there IS content to the right (i.e., NOT at right edge)
const rightScroll = computed(() => !arrivedState.right || undefined)

const slotFns = computed(() =>
  scrollShadowVariants({
    orientation: props.orientation === 'both' ? 'vertical' : props.orientation,
    hideScrollBar: props.hideScrollBar,
  })
)
</script>

<template>
  <div
    ref="container"
    :class="composeClassName(slotFns.base(), props.class)"
    :data-orientation="orientation"
    :data-top-scroll="topScroll ? 'true' : undefined"
    :data-bottom-scroll="bottomScroll ? 'true' : undefined"
    :data-left-scroll="leftScroll ? 'true' : undefined"
    :data-right-scroll="rightScroll ? 'true' : undefined"
    :style="{ '--scroll-shadow-size': size + 'px' }"
  >
    <slot />
  </div>
</template>
