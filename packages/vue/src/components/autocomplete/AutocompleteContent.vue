<script setup lang="ts">
import { AutocompletePortal, AutocompleteContent, AutocompleteViewport, AutocompleteEmpty, injectComboboxRootContext } from 'reka-ui'
import { motion, AnimatePresence } from 'motion-v'
import { useSlots, watchEffect, type VNode } from 'vue'
import { useAutocompleteInject } from './Autocomplete.context'

const props = withDefaults(defineProps<{
  sideOffset?: number
  class?: string
  // AutocompletePortal props
  to?: string | HTMLElement
  disabled?: boolean
  defer?: boolean
  forceMount?: boolean
  // AutocompleteContent props
  position?: 'inline' | 'popper'
  bodyLock?: boolean
  hideWhenEmpty?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideFlip?: boolean
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  alignFlip?: boolean
  avoidCollisions?: boolean
  collisionBoundary?: Element | null | Array<Element | null>
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>
  arrowPadding?: number
  hideShiftedArrow?: boolean
  sticky?: 'partial' | 'always'
  hideWhenDetached?: boolean
  positionStrategy?: 'fixed' | 'absolute'
  updatePositionStrategy?: 'always' | 'optimized'
  disableUpdateOnLayoutShift?: boolean
  prioritizePosition?: boolean
  reference?: object | null
  as?: string
  asChild?: boolean
  disableOutsidePointerEvents?: boolean
  // AutocompleteViewport props
  nonce?: string
  viewportAs?: string
  viewportAsChild?: boolean
}>(), {
  sideOffset: 8,
  class: undefined,
  to: undefined,
  disabled: undefined,
  defer: undefined,
  forceMount: undefined,
  position: undefined,
  bodyLock: undefined,
  hideWhenEmpty: undefined,
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
  asChild: undefined,
  disableOutsidePointerEvents: undefined,
  nonce: undefined,
  viewportAs: undefined,
  viewportAsChild: undefined,
})

const emit = defineEmits<{
  'escape-key-down': [event: KeyboardEvent]
  'pointer-down-outside': [event: Event]
  'focus-outside': [event: Event]
  'interact-outside': [event: Event]
}>()

const ctx = useAutocompleteInject()
// AutocompleteRoot internally provides the ComboboxRoot context
const rootContext = injectComboboxRootContext()

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
    // AutocompleteItem VNodes have a `value` prop; extract their text children
    if (node.props && typeof node.props.value === 'string') {
      const value = node.props.value as string
      const label = node.props.label as string | undefined
      if (label) {
        ctx.registerItem(value, label)
      } else {
        // Extract text from the default slot children of this VNode
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
    }
    // Recurse into children
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
  <AutocompletePortal
    :to="props.to"
    :disabled="props.disabled"
    :defer="props.defer"
    :force-mount="props.forceMount"
  >
    <AnimatePresence>
      <AutocompleteContent
        v-if="rootContext.open.value && (ctx.hasItems.value || (ctx.isFilled.value && !ctx.isLoading.value))"
        :position="props.position ?? 'popper'"
        :side-offset="props.sideOffset"
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
        :reference="(props.reference as any)"
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
          :class="['autocomplete__popover', 'relative']"
          :data-loading="ctx.isLoading.value ? '' : undefined"
          :data-truncate-items="ctx.truncateItems.value ? undefined : 'false'"
          :aria-busy="ctx.isLoading.value || undefined"
          :initial="{ opacity: 0, scale: 0.95 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15 }"
        >
          <div
            :class="[
              'transition-opacity duration-150',
              ctx.isLoading.value
                ? 'pointer-events-none opacity-50 grayscale cursor-not-allowed select-none'
                : '',
            ]"
            :inert="ctx.isLoading.value || undefined"
            :aria-disabled="ctx.isLoading.value || undefined"
            :data-disabled="ctx.isLoading.value ? '' : undefined"
            data-slot="list-wrapper"
          >
            <AutocompleteViewport
              data-slot="list-box"
            >
              <slot />
              <!-- Empty state: only show when the user has typed a query -->
              <AutocompleteEmpty
                v-if="ctx.isFilled.value && !ctx.isLoading.value"
                class="py-3 text-center text-sm text-default-400"
                data-slot="empty-content"
              >
                <slot name="empty">
                  No results found
                </slot>
              </AutocompleteEmpty>
            </AutocompleteViewport>
          </div>
        </motion.div>
      </AutocompleteContent>
    </AnimatePresence>
  </AutocompletePortal>
</template>
