import { describe, it, expect } from 'vitest'
import { ref, nextTick } from 'vue'
import { useOverlayLayer } from '../useOverlayLayer'

describe('useOverlayLayer', () => {
  it('assigns the base tier to the first overlay opened', async () => {
    const rootContext = {}
    const isOpen = ref(false)
    const { backdropZIndex, panelZIndex } = useOverlayLayer(rootContext, isOpen)

    isOpen.value = true
    await nextTick()

    expect(backdropZIndex.value).toBe(50)
    expect(panelZIndex.value).toBe(100)
  })

  it('assigns a strictly higher tier to a second, distinct overlay opened afterward', async () => {
    const rootA = {}
    const rootB = {}
    const openA = ref(false)
    const openB = ref(false)

    const layerA = useOverlayLayer(rootA, openA)
    openA.value = true
    await nextTick()

    const layerB = useOverlayLayer(rootB, openB)
    openB.value = true
    await nextTick()

    expect(layerB.backdropZIndex.value).toBeGreaterThan(layerA.panelZIndex.value)
    expect(layerB.panelZIndex.value).toBeGreaterThan(layerA.panelZIndex.value)
  })

  it('overlay + content sharing the same root context resolve to the same tier', async () => {
    const rootContext = {}
    const isOpenA = ref(false)
    const isOpenB = ref(false)

    // Simulates an Overlay component and a Content component of the same
    // Modal/AlertDialog instance, each independently injecting the same
    // reka-ui dialog root context and calling the composable.
    const backdropLayer = useOverlayLayer(rootContext, isOpenA)
    const panelLayer = useOverlayLayer(rootContext, isOpenB)

    isOpenA.value = true
    isOpenB.value = true
    await nextTick()

    expect(backdropLayer.backdropZIndex.value).toBe(panelLayer.backdropZIndex.value)
    expect(backdropLayer.panelZIndex.value).toBe(panelLayer.panelZIndex.value)
  })
})
