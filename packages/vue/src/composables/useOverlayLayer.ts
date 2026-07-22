import { ref, watch, type Ref } from 'vue'

/**
 * Modal, AlertDialog, and Drawer all render on the same two static z-index
 * tiers (--z-modal-backdrop / --z-modal, see base.css). That only produces
 * correct stacking when a same-type panel happens to fully occlude the
 * panel beneath it (equal z-index, later DOM order wins). A smaller overlay
 * (e.g. an AlertDialog confirming an action inside a larger Modal) opened on
 * top otherwise leaves the larger one's edges undimmed and visible, since
 * its own backdrop sits *below* the layer already holding --z-modal.
 *
 * Each open overlay claims the next depth in a shared, ever-increasing
 * counter so its backdrop AND panel always outrank every overlay already
 * open, regardless of type. Depths are keyed by the dialog root's own
 * context object (stable per mounted Modal/AlertDialog/Drawer instance,
 * shared automatically by every descendant that injects it), so the same
 * instance's overlay + content always resolve to the same pair, and nested
 * instances each get their own entry.
 */

const BASE_BACKDROP_Z = 50
const BASE_PANEL_Z = 100
const LAYER_STEP = 100

let nextDepth = 0
const layerRegistry = new WeakMap<object, { backdropZIndex: number; panelZIndex: number }>()

export interface OverlayLayer {
  backdropZIndex: Ref<number>
  panelZIndex: Ref<number>
}

export function useOverlayLayer(rootContext: object, isOpen: Ref<boolean>): OverlayLayer {
  const backdropZIndex = ref(BASE_BACKDROP_Z)
  const panelZIndex = ref(BASE_PANEL_Z)

  function claim() {
    let entry = layerRegistry.get(rootContext)
    if (!entry) {
      const depth = nextDepth++
      entry = {
        backdropZIndex: BASE_BACKDROP_Z + depth * LAYER_STEP,
        panelZIndex: BASE_PANEL_Z + depth * LAYER_STEP,
      }
      layerRegistry.set(rootContext, entry)
    }
    backdropZIndex.value = entry.backdropZIndex
    panelZIndex.value = entry.panelZIndex
  }

  watch(isOpen, (open) => { if (open) claim() }, { immediate: true })

  return { backdropZIndex, panelZIndex }
}
