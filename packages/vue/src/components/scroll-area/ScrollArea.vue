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
  /** Text direction for the scroll area */
  dir?: 'ltr' | 'rtl'
  /** Render root as a different element */
  as?: string
  /** Merge root props onto child element */
  asChild?: boolean
  /** Nonce for the viewport's inline style */
  viewportNonce?: string
  /** Render viewport as a different element */
  viewportAs?: string
  /** Merge viewport props onto child element */
  viewportAsChild?: boolean
  /** Keep scrollbar mounted when hidden */
  scrollbarForceMount?: boolean
  /** Render scrollbar as a different element */
  scrollbarAs?: string
  /** Merge scrollbar props onto child element */
  scrollbarAsChild?: boolean
  /** Render thumb as a different element */
  thumbAs?: string
  /** Merge thumb props onto child element */
  thumbAsChild?: boolean
  /** Render corner as a different element */
  cornerAs?: string
  /** Merge corner props onto child element */
  cornerAsChild?: boolean
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
    :dir="props.dir"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName('scroll-area__root', props.class)"
  >
    <ScrollAreaViewport
      :nonce="props.viewportNonce"
      :as="props.viewportAs"
      :as-child="props.viewportAsChild"
      :class="composeClassName('scroll-area__viewport', props.viewportClass)"
    >
      <slot />
    </ScrollAreaViewport>

    <ScrollAreaScrollbar
      v-if="props.orientation === 'vertical' || props.orientation === 'both'"
      orientation="vertical"
      :force-mount="props.scrollbarForceMount"
      :as="props.scrollbarAs"
      :as-child="props.scrollbarAsChild"
      class="scroll-area__scrollbar scroll-area__scrollbar--vertical"
    >
      <ScrollAreaThumb
        :as="props.thumbAs"
        :as-child="props.thumbAsChild"
        class="scroll-area__thumb"
      />
    </ScrollAreaScrollbar>

    <ScrollAreaScrollbar
      v-if="props.orientation === 'horizontal' || props.orientation === 'both'"
      orientation="horizontal"
      :force-mount="props.scrollbarForceMount"
      :as="props.scrollbarAs"
      :as-child="props.scrollbarAsChild"
      class="scroll-area__scrollbar scroll-area__scrollbar--horizontal"
    >
      <ScrollAreaThumb
        :as="props.thumbAs"
        :as-child="props.thumbAsChild"
        class="scroll-area__thumb"
      />
    </ScrollAreaScrollbar>

    <ScrollAreaCorner
      v-if="props.orientation === 'both'"
      :as="props.cornerAs"
      :as-child="props.cornerAsChild"
      class="scroll-area__corner"
    />
  </ScrollAreaRoot>
</template>
