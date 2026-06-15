<script setup lang="ts">
import { ComboboxPortal, ComboboxContent, ComboboxViewport, injectComboboxRootContext } from 'reka-ui'
import { motion, AnimatePresence } from 'motion-v'
import { useSlots, watchEffect, type VNode } from 'vue'
import { useComboBoxInject } from './ComboBox.context'

const props = withDefaults(defineProps<{
  sideOffset?: number
  class?: string
}>(), {
  sideOffset: 8,
  class: undefined,
})

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
  <ComboboxPortal>
    <AnimatePresence>
      <ComboboxContent
        v-if="comboboxRootContext.open.value"
        position="popper"
        :side-offset="props.sideOffset"
        as-child
        data-slot="popover"
      >
        <motion.div
          :class="ctx.slots.value.popover()"
          :initial="{ opacity: 0, scale: 0.95 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15 }"
        >
          <ComboboxViewport data-slot="list-box">
            <slot />
            <slot name="empty" />
          </ComboboxViewport>
        </motion.div>
      </ComboboxContent>
    </AnimatePresence>
  </ComboboxPortal>
</template>
