import { useState } from "react";

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
 * open, regardless of type. Unlike the Vue version, ModalContent/
 * AlertDialogContent/DrawerContent here render their Overlay as a nested
 * ancestor rather than a sibling component (react-aria-components requires
 * ModalOverlay to wrap Modal/Dialog to share state), so a single hook call
 * per instance covers both backdrop and panel — no cross-component registry
 * needed. react-aria-components unmounts overlay content when closed, so a
 * fresh depth is claimed each time an instance re-opens; that's harmless
 * since only relative order among *currently* open overlays matters.
 */

const BASE_BACKDROP_Z = 50;
const BASE_PANEL_Z = 100;
const LAYER_STEP = 100;

let nextDepth = 0;

export interface OverlayLayer {
  backdropZIndex: number;
  panelZIndex: number;
}

export function useOverlayLayer(): OverlayLayer {
  const [layer] = useState<OverlayLayer>(() => {
    const depth = nextDepth++;
    return {
      backdropZIndex: BASE_BACKDROP_Z + depth * LAYER_STEP,
      panelZIndex: BASE_PANEL_Z + depth * LAYER_STEP,
    };
  });
  return layer;
}
