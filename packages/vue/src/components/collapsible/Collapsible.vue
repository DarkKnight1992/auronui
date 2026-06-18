<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, useId, watch } from 'vue'
import { CollapsibleRoot } from 'reka-ui'
import { collapsibleVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useCollapsibleProvide } from './collapsible.context'
import { injectCollapsibleGroup } from './collapsible-group.context'

// NOTE: `open` is typed as `boolean | null` (not boolean) to avoid Vue's boolean
// prop casting: absent boolean props are cast to `false`, making it impossible to
// distinguish "not provided" from "explicitly false". Using null as the
// "not controlled" sentinel preserves that distinction at runtime.
const props = withDefaults(defineProps<{
  open?: boolean | null
  defaultOpen?: boolean
  disabled?: boolean
  class?: string
  /** Per-slot class overrides */
  classNames?: Partial<{
    base: string
  }>
}>(), {
  open: null,
  defaultOpen: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

// Check if we're inside a CollapsibleGroup — if so, we need controlled mode so
// the group can externally close this Collapsible by setting internalOpen.value.
const group = injectCollapsibleGroup()
const id = useId()

// Controlled mode when: (a) parent provides v-model:open, OR (b) inside a group.
// In both cases, internalOpen drives Reka's open prop.
const isControlled = computed(() => props.open !== null || group !== null)

// Mirror of the open state — updated when Reka fires @update:open.
// Initialized from: controlled `open` prop if set, else `defaultOpen`.
const internalOpen = ref<boolean>(
  props.open !== null ? (props.open as boolean) : props.defaultOpen
)

// Sync external open -> internal (v-model controlled mode)
watch(() => props.open, (v) => {
  if (v !== null && typeof v === 'boolean' && v !== internalOpen.value) {
    internalOpen.value = v
  }
})

function onUpdateOpen(v: boolean) {
  if (internalOpen.value === v) return
  internalOpen.value = v
  emit('update:open', v)
  // Notify group for single-open enforcement
  if (v && group) group.notifyOpen(id)
}

const slotFns = computed(() => collapsibleVariants({}))

useCollapsibleProvide({ slotFns, isOpen: internalOpen })

onMounted(() => {
  if (group) group.register({ id, open: internalOpen })
})

onBeforeUnmount(() => {
  if (group) group.unregister(id)
})
</script>

<template>
  <CollapsibleRoot
    :open="isControlled ? internalOpen : undefined"
    :default-open="!isControlled ? props.defaultOpen : undefined"
    :disabled="props.disabled"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    @update:open="onUpdateOpen"
  >
    <slot />
  </CollapsibleRoot>
</template>
