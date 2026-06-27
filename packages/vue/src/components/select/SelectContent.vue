<script setup lang="ts">
import {
  SelectContent,
  SelectViewport,
  SelectPortal,
  injectSelectRootContext,
} from 'reka-ui'
import { motion, AnimatePresence } from 'motion-v'
import { ref, watch } from 'vue'
import { useSelectInject } from './Select.context'

const props = withDefaults(defineProps<{
  position?: 'item-aligned' | 'popper'
  sideOffset?: number
  class?: string
  /** Keep content mounted even when closed. */
  forceMount?: boolean
  /** Lock body scroll when content is open. */
  bodyLock?: boolean
  /** Side of the trigger to render the content. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Flip to opposite side when not enough space. */
  sideFlip?: boolean
  /** Alignment relative to the trigger. */
  align?: 'start' | 'center' | 'end'
  /** Offset from the alignment edge. */
  alignOffset?: number
  /** Flip alignment when not enough space. */
  alignFlip?: boolean
  /** Avoid collisions with viewport edges. */
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
  /** Prioritize keeping content in view over alignment. */
  prioritizePosition?: boolean
  /** Virtual or DOM reference element to position against. */
  reference?: object | null
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
  /** Disable pointer events outside the content while open. */
  disableOutsidePointerEvents?: boolean
  /** Nonce for the viewport element. */
  nonce?: string
  /** Portal target element or selector. */
  to?: string | HTMLElement
  /** Disable the portal. */
  portalDisabled?: boolean
  /** Defer portal rendering. */
  defer?: boolean
}>(), {
  position: 'popper',
  sideOffset: 8,
  class: undefined,
  forceMount: undefined,
  bodyLock: undefined,
  side: undefined,
  sideFlip: undefined,
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
  nonce: undefined,
  to: undefined,
  portalDisabled: undefined,
  defer: undefined,
})

const emit = defineEmits<{
  'close-auto-focus': [event: Event]
  'escape-key-down': [event: KeyboardEvent]
  'pointer-down-outside': [event: Event]
}>()

const ctx = useSelectInject()
const rootContext = injectSelectRootContext()

// Suppress scroll-behavior:smooth for the first frame after open so Reka's
// programmatic scrollTop jump to the selected item is instant.
const justOpened = ref(false)
watch(() => rootContext.open.value, (open) => {
  if (open) {
    justOpened.value = true
    setTimeout(() => { justOpened.value = false }, 100)
  }
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    rootContext.onOpenChange(false)
  }
}
</script>

<template>
  <SelectPortal
    :to="props.to"
    :disabled="props.portalDisabled"
    :defer="props.defer"
    :force-mount="props.forceMount"
  >
    <AnimatePresence>
      <!--
      No force-mount on SelectContent. With force-mount=true, Reka's
      SelectContentImpl (which contains DismissableLayer with
      disableOutsidePointerEvents=true) would mount immediately on page load and
      block all pointer events — including clicks on the trigger button.

      Without force-mount, when open=false, Reka teleports slot content into a
      DocumentFragment (after SelectContent's own onMounted). Components inside
      the slot (SelectItem) still get created and their setup() runs, so
      textValue-based registrations fire at setup time.

      v-show (not v-if) on the visual wrapper ensures SelectItem components are
      always instantiated when inside the DocumentFragment — their setup() fires
      and populates itemRegistry. The animated chrome is visually hidden via
      v-show when closed; enter/exit animation runs via motion.div bindings.
    -->
      <SelectContent
        :position="props.position"
        :side-offset="props.sideOffset"
        :body-lock="props.bodyLock"
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
        :reference="(props.reference as any)"
        :as="props.as"
        :as-child="props.asChild"
        :disable-outside-pointer-events="props.disableOutsidePointerEvents"
        data-slot="popover"
        @close-auto-focus="emit('close-auto-focus', $event)"
        @escape-key-down="emit('escape-key-down', $event)"
        @pointer-down-outside="emit('pointer-down-outside', $event)"
      >
        <motion.div
          v-show="rootContext.open.value"
          :class="[ctx.slots.value.popover(), { 'select__popover--opening': justOpened }]"
          :animate="rootContext.open.value ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15 }"
          @keydown="handleKeydown"
        >
          <SelectViewport
            :nonce="props.nonce"
            data-slot="list-box"
          >
            <slot />
          </SelectViewport>
        </motion.div>
      </SelectContent>
    </AnimatePresence>
  </SelectPortal>
</template>
