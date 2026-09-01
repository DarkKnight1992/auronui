<script setup lang="ts">
import { computed, getCurrentInstance, inject, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { SplitterPanel } from 'reka-ui'
import { splitterVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { warnPanelOrderMismatch } from '../../utils/warnDeprecated'
import { splitterContextKey } from './Splitter.context'

const props = withDefaults(defineProps<{
  id?: string
  defaultSize?: number
  minSize?: number
  maxSize?: number
  collapsible?: boolean
  collapsedSize?: number
  order?: number
  class?: ClassValue
  /** Override classes for individual slots. */
  classNames?: Partial<{
    panel: ClassValue
  }>
  /** Unit for size values: 'percentage' or 'pixels' */
  sizeUnit?: '%' | 'px'
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>(), {
  id: undefined,
  defaultSize: undefined,
  minSize: undefined,
  maxSize: undefined,
  collapsible: false,
  collapsedSize: undefined,
  order: undefined,
  class: undefined,
  classNames: undefined,
  sizeUnit: undefined,
})

const emit = defineEmits<{
  collapse: []
  expand: []
  resize: [size: number]
}>()

const slotFns = computed(() => splitterVariants())

// Reka's SplitterPanel is the only Splitter primitive with an imperative API
// (collapse/expand/resize/getSize + collapsed state). It is not reachable
// through this wrapper unless we re-expose it: a template ref on an SFC
// resolves to the SFC's own instance, not the child primitive's.
interface RekaPanelExpose {
  collapse: () => void
  expand: () => void
  resize: (size: number) => void
  getSize: () => number
  isCollapsed: boolean
  isExpanded: boolean
}

const panelRef = useTemplateRef<RekaPanelExpose>('panel')

// reka-ui keeps its panels in registration order: registerPanel() pushes, then sorts
// by the `order` prop only — and with no `order` that comparator returns 0 for every
// pair, so a stable sort leaves the array in *mount* order. DOM order is never read.
// Resize handles, meanwhile, take their pivot indices straight from the DOM. As long
// as the two agree nothing is wrong, but a panel that unmounts and remounts (a
// conditionally rendered half being toggled back on) re-registers at the end of the
// array while rendering back in its original spot. Sizes still look right — the layout
// array and each panel's own lookup share the same skewed order — so the damage only
// shows up on drag, where a handle moves panels other than the two it sits between.
//
// Nothing here can reorder reka's registry, so detect the divergence and say so.
const groupCtx = inject(splitterContextKey, null)
const instance = getCurrentInstance()

// Tearing the reka-ui panel below out and putting it back makes it unregister and
// register again — the only lever this wrapper has for moving a panel within reka's
// registry. The group drives it via `reorderPanelsAfter`. It has to be a real
// unmount (v-if across two ticks): a `:key` on a component's template root does not
// re-key that component from the inside, so bumping one re-renders without
// remounting and reka never re-registers.
const isPanelMounted = ref(true)

async function remountPanel() {
  // Step out of the flush this was called from first. `reorderPanelsAfter` runs
  // inside another panel's onMounted, and toggling false then true while that flush
  // is still draining collapses into a single no-op render — the unmount never
  // happens and reka never re-registers.
  await nextTick()
  isPanelMounted.value = false
  await nextTick()
  isPanelMounted.value = true
}

let releaseEntry: (() => void) | undefined

onMounted(() => {
  if (!groupCtx) return
  const registrationIndex = groupCtx.notePanelMounted()

  releaseEntry = groupCtx.registerPanelEntry({
    getElement: () => (instance?.vnode.el as HTMLElement | null) ?? null,
    remount: remountPanel,
  })

  // An explicit `order` is authoritative — reka sorts by it, so nothing to repair.
  if (props.order != null) return

  // reka-ui's panel registers in its own onMounted, which runs before this one, so by
  // now the element is in place and its position is comparable with that index.
  const el = instance?.vnode.el as HTMLElement | null
  const groupEl = el?.closest('[data-slot="splitter-group"]')
  if (!el || !groupEl) return
  // `:scope >` keeps a nested SplitterGroup's panels out of the count.
  const domIndex = [...groupEl.querySelectorAll(':scope > [data-slot="splitter-panel"]')].indexOf(el)
  if (domIndex === -1 || domIndex === registrationIndex) return

  if (groupCtx.preservePanelOrder.value) {
    // Push every panel rendered after this one behind it in reka's registry.
    groupCtx.reorderPanelsAfter(groupEl, domIndex)
  } else {
    warnPanelOrderMismatch(domIndex, registrationIndex)
  }
})

onUnmounted(() => {
  releaseEntry?.()
  groupCtx?.notePanelUnmounted()
})

defineExpose({
  collapse: () => panelRef.value?.collapse(),
  expand: () => panelRef.value?.expand(),
  resize: (size: number) => panelRef.value?.resize(size),
  getSize: () => panelRef.value?.getSize() ?? 0,
  // Reka exposes these as computeds; reading them through the exposed proxy
  // unwraps to a boolean, so wrap them again to keep them reactive here.
  isCollapsed: computed(() => panelRef.value?.isCollapsed ?? false),
  isExpanded: computed(() => panelRef.value?.isExpanded ?? true),
})
</script>

<template>
  <SplitterPanel
    v-if="isPanelMounted"
    :id="id"
    ref="panel"
    :default-size="defaultSize"
    :min-size="minSize"
    :max-size="maxSize"
    :collapsible="collapsible"
    :collapsed-size="collapsedSize"
    :order="order"
    :size-unit="props.sizeUnit"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.panel(), props.class, props.classNames?.panel)"
    data-slot="splitter-panel"
    @collapse="emit('collapse')"
    @expand="emit('expand')"
    @resize="(size: number) => emit('resize', size)"
  >
    <template #default="slotProps">
      <!-- Forward Reka's slot props (isCollapsed/isExpanded/collapse/expand/resize) -->
      <slot v-bind="slotProps" />
    </template>
  </SplitterPanel>
</template>
