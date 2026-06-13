<script setup lang="ts">
import {
  SelectContent,
  SelectViewport,
  SelectPortal,
  injectSelectRootContext,
} from 'reka-ui'
import { motion, AnimatePresence } from 'motion-v'
import { useSelectInject } from './Select.context'

const props = withDefaults(defineProps<{
  position?: 'item-aligned' | 'popper'
  sideOffset?: number
  class?: string
}>(), {
  position: 'popper',
  sideOffset: 8,
  class: undefined,
})

const ctx = useSelectInject()
const rootContext = injectSelectRootContext()
</script>

<template>
  <SelectPortal>
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
      <SelectContent :position="props.position" :side-offset="props.sideOffset" data-slot="popover">
        <motion.div v-show="rootContext.open.value" :class="ctx.slots.value.popover()"
          :animate="rootContext.open.value ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15 }">
          <SelectViewport data-slot="list-box">
            <slot />
          </SelectViewport>
        </motion.div>
      </SelectContent>
    </AnimatePresence>
  </SelectPortal>
</template>
