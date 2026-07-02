<script setup lang="ts">
import { MenubarSubContent, MenubarPortal } from 'reka-ui'
import { menubarVariants, menuVariants } from '@auronui/styles'

const props = withDefaults(defineProps<{
  sideOffset?: number
  alignOffset?: number
  class?: string
  /** Keep sub-content mounted even when closed. */
  forceMount?: boolean
  /** Keep keyboard focus loop within the content. */
  loop?: boolean
  /** Flip to opposite side when there is not enough space. */
  sideFlip?: boolean
  /** Flip alignment when there is not enough space. */
  alignFlip?: boolean
  /** Avoid collisions with the viewport edges. */
  avoidCollisions?: boolean
  /** Boundary element(s) for collision detection. */
  collisionBoundary?: Element | null | Array<Element | null>
  /** Padding around collision boundary. */
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>
  /** Padding between content and arrow. */
  arrowPadding?: number
  /** Hide the arrow when the content is shifted. */
  hideShiftedArrow?: boolean
  /** Sticky behavior when scrolling. */
  sticky?: 'partial' | 'always'
  /** Hide content when fully detached from trigger. */
  hideWhenDetached?: boolean
  /** CSS position strategy for the floating element. */
  positionStrategy?: 'fixed' | 'absolute'
  /** When to recalculate position. */
  updatePositionStrategy?: 'always' | 'optimized'
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
  /** Portal target element or selector. */
  to?: string | HTMLElement
  /** Disable the portal. */
  portalDisabled?: boolean
  /** Defer portal rendering. */
  defer?: boolean
}>(), {
  sideOffset: 4,
  alignOffset: -5,
  class: undefined,
  forceMount: undefined,
  loop: undefined,
  sideFlip: undefined,
  alignFlip: undefined,
  avoidCollisions: undefined,
  collisionBoundary: undefined,
  collisionPadding: undefined,
  arrowPadding: undefined,
  hideShiftedArrow: undefined,
  sticky: undefined,
  hideWhenDetached: undefined,
  positionStrategy: undefined,
  updatePositionStrategy: undefined,
  disableUpdateOnLayoutShift: undefined,
  prioritizePosition: undefined,
  reference: undefined,
  as: undefined,
  asChild: false,
  to: undefined,
  portalDisabled: undefined,
  defer: undefined,
})

const emit = defineEmits<{
  'escape-key-down': [event: KeyboardEvent]
  'pointer-down-outside': [event: Event]
  'focus-outside': [event: Event]
  'interact-outside': [event: Event]
  'open-auto-focus': [event: Event]
  'close-auto-focus': [event: Event]
}>()

const slots = menubarVariants()
</script>

<template>
  <MenubarPortal
    :to="props.to"
    :disabled="props.portalDisabled"
    :defer="props.defer"
    :force-mount="props.forceMount"
  >
    <MenubarSubContent
      :side-offset="props.sideOffset"
      :align-offset="props.alignOffset"
      :force-mount="props.forceMount"
      :loop="props.loop"
      :side-flip="props.sideFlip"
      :align-flip="props.alignFlip"
      :avoid-collisions="props.avoidCollisions"
      :collision-boundary="props.collisionBoundary"
      :collision-padding="props.collisionPadding"
      :arrow-padding="props.arrowPadding"
      :hide-shifted-arrow="props.hideShiftedArrow"
      :sticky="props.sticky"
      :hide-when-detached="props.hideWhenDetached"
      :position-strategy="props.positionStrategy"
      :update-position-strategy="props.updatePositionStrategy"
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
      @open-auto-focus="emit('open-auto-focus', $event)"
      @close-auto-focus="emit('close-auto-focus', $event)"
    >
      <div :class="menuVariants()">
        <slot />
      </div>
    </MenubarSubContent>
  </MenubarPortal>
</template>
