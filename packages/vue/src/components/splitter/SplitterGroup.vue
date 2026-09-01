<script setup lang="ts">
import { computed, provide } from 'vue'
import { SplitterGroup } from 'reka-ui'
import { splitterVariants, type SplitterVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { splitterContextKey, type SplitterPanelEntry } from './Splitter.context'

const props = withDefaults(defineProps<{
  id?: string
  direction?: SplitterVariants['direction']
  autoSaveId?: string
  class?: ClassValue
  /** Per-slot class name overrides. */
  classNames?: Partial<{
    group: ClassValue
  }>
  /** Keyboard resize increment in pixels */
  keyboardResizeBy?: number
  /** Custom storage for persisting layout */
  storage?: object
  /**
   * Repair panel order when a conditionally rendered panel is mounted back in.
   *
   * reka-ui keeps its panels in registration order — it sorts by the `order` prop
   * and otherwise falls back to the order panels mounted in, never DOM order —
   * while resize handles take their pivot indices from the DOM. A panel that is
   * unmounted and later remounted re-registers last while rendering in its
   * original position, so the two disagree and dragging a handle resizes the wrong
   * panels. With this enabled, the group remounts the panels that follow the
   * restored one so they re-register behind it and the registry matches the DOM.
   *
   * Disclaimer: repairing the order remounts those panels, so anything stateful
   * inside them (scroll position, focus, uncontrolled inputs, component state) is
   * lost — and, as with any panel being added, the group recomputes its layout
   * from each panel's `defaultSize`. Prefer giving conditional panels an explicit
   * `order`, which costs nothing; reach for this when their order is not known
   * ahead of time.
   *
   * @default false
   */
  preservePanelOrder?: boolean
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>(), {
  id: undefined,
  direction: 'horizontal',
  autoSaveId: undefined,
  class: undefined,
  classNames: undefined,
  keyboardResizeBy: undefined,
  storage: undefined,
  preservePanelOrder: false,
})

const emit = defineEmits<{
  layout: [sizes: number[]]
}>()

const slotFns = computed(() => splitterVariants({ direction: props.direction }))

// reka-ui registers panels in mount order and exposes no way to inspect that
// registry, so track the same count here to let a panel detect when its
// registration position and its DOM position have diverged.
let mountedPanels = 0

// Panels register themselves so the group can remount the ones that follow a
// late arrival. Held as a Set rather than an ordered list because position is
// read from the DOM at the moment it is needed, not cached.
const panelEntries = new Set<SplitterPanelEntry>()


function reorderPanelsAfter(groupElement: Element, domIndex: number) {
  // `:scope >` so a nested SplitterGroup's panels do not skew the positions.
  const elements = [...groupElement.querySelectorAll(':scope > [data-slot="splitter-panel"]')]
  for (const entry of panelEntries) {
    const element = entry.getElement()
    if (!element) continue
    if (elements.indexOf(element) > domIndex) entry.remount()
  }
  // Each remount unregisters and re-registers one panel. Vue patches children in
  // document order, so they re-register in DOM order regardless of the order the
  // remounts were requested in.
}

provide(splitterContextKey, {
  direction: computed(() => props.direction ?? 'horizontal'),
  preservePanelOrder: computed(() => props.preservePanelOrder),
  notePanelMounted: () => mountedPanels++,
  notePanelUnmounted: () => { mountedPanels-- },
  registerPanelEntry: (entry: SplitterPanelEntry) => {
    panelEntries.add(entry)
    return () => { panelEntries.delete(entry) }
  },
  reorderPanelsAfter,
})
</script>

<template>
  <SplitterGroup
    :id="id"
    :direction="direction ?? 'horizontal'"
    :auto-save-id="autoSaveId"
    :keyboard-resize-by="props.keyboardResizeBy"
    :storage="(props.storage as any)"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.group(), props.class, props.classNames?.group)"
    data-slot="splitter-group"
    @layout="(sizes: number[]) => emit('layout', sizes)"
  >
    <slot />
  </SplitterGroup>
</template>
