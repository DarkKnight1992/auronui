<script setup lang="ts">
import { ComboboxPortal, ComboboxContent, ComboboxViewport, injectComboboxRootContext } from 'reka-ui'
import { motion, AnimatePresence } from 'motion-v'
import { useSlots, watchEffect, type VNode } from 'vue'
import { useComboBoxInject } from './ComboBox.context'

const props = withDefaults(defineProps<{
  sideOffset?: number
  class?: string
  /** Portal target selector or element. */
  to?: string | HTMLElement
  /** Disable the portal. */
  portalDisabled?: boolean
  /** Defer portal rendering. */
  defer?: boolean
  /** Force-mount the portal even when closed. */
  portalForceMount?: boolean
  /** Force-mount the content even when closed. */
  forceMount?: boolean
  /** Positioning strategy: item-aligned or popper. */
  position?: 'item-aligned' | 'popper'
  /** Lock body scroll when open. */
  bodyLock?: boolean
  /** Hide content when there are no items. */
  hideWhenEmpty?: boolean
  /** Side of the anchor to render on. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Flip side when colliding. */
  sideFlip?: boolean
  /** Side offset in pixels. */
  sideOffsetProp?: number
  /** Alignment relative to the anchor. */
  align?: 'start' | 'center' | 'end'
  /** Alignment offset in pixels. */
  alignOffset?: number
  /** Flip alignment when colliding. */
  alignFlip?: boolean
  /** Avoid collisions with boundary. */
  avoidCollisions?: boolean
  /** Boundary element(s) for collision detection. */
  collisionBoundary?: Element | null | Array<Element | null>
  /** Padding from collision boundary. */
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>
  /** Padding from arrow. */
  arrowPadding?: number
  /** Hide arrow when shifted. */
  hideShiftedArrow?: boolean
  /** Sticky behavior on scroll. */
  sticky?: 'partial' | 'always'
  /** Hide when anchor is detached. */
  hideWhenDetached?: boolean
  /** CSS position strategy. */
  positionStrategy?: 'fixed' | 'absolute'
  /** When to update position. */
  updatePositionStrategy?: 'always' | 'optimized'
  /** Disable position updates on layout shift. */
  disableUpdateOnLayoutShift?: boolean
  /** Prioritize keeping content in view. */
  prioritizePosition?: boolean
  /** Custom reference element for positioning. */
  reference?: object | null
  /** Render content as a different element. */
  as?: string
  /** Merge content props onto child element. */
  asChild?: boolean
  /** Disable outside pointer events when open. */
  disableOutsidePointerEvents?: boolean
  /** Nonce for the viewport's inline style. */
  viewportNonce?: string
  /** Render the viewport as a different element. */
  viewportAs?: string
  /** Merge viewport props onto child element. */
  viewportAsChild?: boolean
}>(), {
  sideOffset: 8,
  class: undefined,
  to: undefined,
  portalDisabled: undefined,
  defer: undefined,
  portalForceMount: undefined,
  forceMount: undefined,
  position: undefined,
  bodyLock: undefined,
  hideWhenEmpty: undefined,
  side: undefined,
  sideFlip: undefined,
  sideOffsetProp: undefined,
  align: undefined,
  alignOffset: undefined,
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
  disableOutsidePointerEvents: undefined,
  viewportNonce: undefined,
  viewportAs: undefined,
  viewportAsChild: false,
})

const emit = defineEmits<{
  'escape-key-down': [event: KeyboardEvent]
  'pointer-down-outside': [event: Event]
  'focus-outside': [event: FocusEvent]
  'interact-outside': [event: Event]
}>()

const ctx = useComboBoxInject()
const comboboxRootContext = injectComboboxRootContext()

// Pre-walk slot VNodes to extract value→label pairs synchronously.
// This runs before the portal opens so the bridge can resolve labels on initial render.
const slots = useSlots()

function extractNodeText(nodes: VNode[]): string {
  return nodes.map(n => {
    if (typeof n.children === 'string') return n.children
    if (Array.isArray(n.children)) return extractNodeText(n.children as VNode[])
    return ''
  }).join('')
}

function walkAndRegister(nodes: VNode[]) {
  for (const node of nodes) {
    // ComboBoxItem VNodes have a `value` prop; extract their text children
    if (node.props && typeof node.props.value === 'string') {
      const value = node.props.value as string
      const children = node.children
      if (children && typeof children === 'object' && 'default' in children) {
        const slotFn = (children as Record<string, () => VNode[]>).default
        if (typeof slotFn === 'function') {
          const text = extractNodeText(slotFn()).trim()
          if (text) ctx.registerItem(value, text)
        }
      } else if (typeof children === 'string') {
        const text = children.trim()
        if (text) ctx.registerItem(value, text)
      } else if (Array.isArray(children)) {
        const text = extractNodeText(children as VNode[]).trim()
        if (text) ctx.registerItem(value, text)
      }
    }
    // Recurse into children arrays
    if (Array.isArray(node.children)) {
      walkAndRegister(node.children as VNode[])
    }
  }
}

// Run synchronously at setup time and whenever the slot content changes
watchEffect(() => {
  const vnodes = (slots.default as (() => VNode[]) | undefined)?.()
  if (vnodes) walkAndRegister(vnodes)
})
</script>

<template>
  <ComboboxPortal
    :to="props.to"
    :disabled="props.portalDisabled"
    :defer="props.defer"
    :force-mount="props.portalForceMount"
  >
    <AnimatePresence>
      <ComboboxContent
        v-if="comboboxRootContext.open.value"
        :position="props.position ?? 'popper'"
        :side-offset="props.sideOffset"
        :force-mount="props.forceMount"
        :body-lock="props.bodyLock"
        :hide-when-empty="props.hideWhenEmpty"
        :side="props.side"
        :side-flip="props.sideFlip"
        :align="props.align"
        :align-offset="props.alignOffset"
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
        :reference="props.reference"
        :as="props.as"
        :as-child="props.asChild ?? true"
        :disable-outside-pointer-events="props.disableOutsidePointerEvents"
        data-slot="popover"
        @escape-key-down="emit('escape-key-down', $event)"
        @pointer-down-outside="emit('pointer-down-outside', $event)"
        @focus-outside="emit('focus-outside', $event)"
        @interact-outside="emit('interact-outside', $event)"
      >
        <motion.div
          :class="ctx.slots.value.popover()"
          :initial="{ opacity: 0, scale: 0.95 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15 }"
        >
          <ComboboxViewport
            :nonce="props.viewportNonce"
            :as="props.viewportAs"
            :as-child="props.viewportAsChild"
            data-slot="list-box"
          >
            <slot />
            <slot name="empty" />
          </ComboboxViewport>
        </motion.div>
      </ComboboxContent>
    </AnimatePresence>
  </ComboboxPortal>
</template>
