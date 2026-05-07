<script setup lang="ts">
import { AutocompletePortal, AutocompleteContent, AutocompleteViewport, AutocompleteEmpty, injectComboboxRootContext } from 'reka-ui'
import { motion, AnimatePresence } from 'motion-v'
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
</script>

<template>
  <AutocompletePortal>
    <AnimatePresence>
      <AutocompleteContent
        v-if="rootContext.open.value"
        position="popper"
        :side-offset="props.sideOffset"
        as-child
        data-slot="popover"
      >
        <motion.div
          :class="['autocomplete__popover', 'relative']"
          :data-loading="ctx.isLoading.value ? '' : undefined"
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
              <!-- Empty state when no items match -->
              <AutocompleteEmpty
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
