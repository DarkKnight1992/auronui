<script setup lang="ts">
import { AutocompletePortal, AutocompleteContent, AutocompleteViewport, AutocompleteEmpty, injectComboboxRootContext } from 'reka-ui'
import { motion, AnimatePresence } from 'motion-v'
import { useSlots, watchEffect, type VNode } from 'vue'
import { useAutocompleteInject } from './Autocomplete.context'

const props = withDefaults(defineProps<{
  sideOffset?: number
  class?: string
}>(), {
  sideOffset: 8,
  class: undefined,
})

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
  <AutocompletePortal>
    <AnimatePresence>
      <AutocompleteContent
        v-if="rootContext.open.value && (ctx.hasItems.value || (ctx.isFilled.value && !ctx.isLoading.value))"
        position="popper"
        :side-offset="props.sideOffset"
        as-child
        data-slot="popover"
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
