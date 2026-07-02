<script setup lang="ts">
import { ContextMenuPortal, ContextMenuContent } from 'reka-ui'
import { contextMenuVariants, menuVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  ariaLabel?: string
  alignOffset?: number
  class?: string
  /** Portal target element or selector. */
  to?: string | HTMLElement
  /** Disable the portal. */
  portalDisabled?: boolean
  /** Defer portal rendering. */
  defer?: boolean
  /** Force content to stay mounted even when closed. */
  forceMount?: boolean
  /** Keep keyboard focus loop within the content. */
  loop?: boolean
  /** Avoid collisions with the viewport edges. */
  avoidCollisions?: boolean
  /** Boundary element(s) for collision detection. */
  collisionBoundary?: Element | null | Array<Element | null>
  /** Padding around collision boundary. */
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>
  /** Hide the arrow when the content is shifted. */
  hideShiftedArrow?: boolean
  /** Sticky behavior when scrolling. */
  sticky?: 'partial' | 'always'
  /** Hide content when fully detached from the pointer position. */
  hideWhenDetached?: boolean
  /** CSS position strategy for the floating element. */
  positionStrategy?: 'fixed' | 'absolute'
  /** Disable position update on layout shift. */
  disableUpdateOnLayoutShift?: boolean
  /** Prioritize keeping the content in view over alignment. */
  prioritizePosition?: boolean
  /** Virtual or DOM reference element to position against. */
  reference?: object | null
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>(), {
  ariaLabel: undefined,
  alignOffset: 0,
  class: undefined,
  to: undefined,
  portalDisabled: undefined,
  defer: undefined,
  forceMount: undefined,
  loop: undefined,
  avoidCollisions: undefined,
  collisionBoundary: undefined,
  collisionPadding: undefined,
  hideShiftedArrow: undefined,
  sticky: undefined,
  hideWhenDetached: undefined,
  positionStrategy: undefined,
  disableUpdateOnLayoutShift: undefined,
  prioritizePosition: undefined,
  reference: undefined,
  as: undefined,
  asChild: false,
})

const emit = defineEmits<{
  'escape-key-down': [event: KeyboardEvent]
  'pointer-down-outside': [event: Event]
  'focus-outside': [event: Event]
  'interact-outside': [event: Event]
  'close-auto-focus': [event: Event]
}>()

const slots = contextMenuVariants()
</script>

<template>
  <ContextMenuPortal
    :to="props.to"
    :disabled="props.portalDisabled"
    :defer="props.defer"
    :force-mount="props.forceMount"
  >
    <ContextMenuContent
      :align-offset="props.alignOffset"
      :aria-label="props.ariaLabel"
      :force-mount="props.forceMount"
      :loop="props.loop"
      :avoid-collisions="props.avoidCollisions"
      :collision-boundary="props.collisionBoundary"
      :collision-padding="props.collisionPadding"
      :hide-shifted-arrow="props.hideShiftedArrow"
      :sticky="props.sticky"
      :hide-when-detached="props.hideWhenDetached"
      :position-strategy="props.positionStrategy"
      :disable-update-on-layout-shift="props.disableUpdateOnLayoutShift"
      :prioritize-position="props.prioritizePosition"
      :reference="(props.reference as any)"
      :as="props.as"
      :as-child="props.asChild"
      :class="[slots.popover(), props.class]"
      @escape-key-down="emit('escape-key-down', $event)"
      @pointer-down-outside="emit('pointer-down-outside', $event)"
      @focus-outside="emit('focus-outside', $event)"
      @interact-outside="emit('interact-outside', $event)"
      @close-auto-focus="emit('close-auto-focus', $event)"
    >
      <div :class="menuVariants()">
        <slot />
      </div>
    </ContextMenuContent>
  </ContextMenuPortal>
</template>
