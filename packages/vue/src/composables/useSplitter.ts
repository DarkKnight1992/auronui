import { ref, type Ref } from 'vue'

export interface UseSplitterOptions {
  /** Initial panel sizes as percentages (0–100). Should sum to 100. */
  defaultSizes?: number[]
}

export interface UseSplitterReturn {
  /** Reactive array of panel sizes as percentages. */
  sizes: Ref<number[]>
  /** Set panel sizes directly. */
  setSizes: (sizes: number[]) => void
  /** Reset panel sizes to the values provided in `defaultSizes`. */
  resetSizes: () => void
  /**
   * Pass as `@layout` handler on the SplitterGroup component.
   * Keeps `sizes` in sync when the user drags the resize handle.
   */
  onLayout: (sizes: number[]) => void
}

/**
 * Tracks panel layout state for the SplitterGroup component.
 *
 * @example
 * ```ts
 * const splitter = useSplitter({ defaultSizes: [30, 70] })
 * ```
 * ```html
 * <SplitterGroup @layout="splitter.onLayout">
 *   <SplitterPanel :default-size="splitter.sizes[0] ?? 30" />
 *   <SplitterResizeHandle />
 *   <SplitterPanel :default-size="splitter.sizes[1] ?? 70" />
 * </SplitterGroup>
 * ```
 */
export function useSplitter(options: UseSplitterOptions = {}): UseSplitterReturn {
  const sizes = ref<number[]>(options.defaultSizes ? [...options.defaultSizes] : [])

  function setSizes(next: number[]): void {
    sizes.value = [...next]
  }

  function resetSizes(): void {
    sizes.value = options.defaultSizes ? [...options.defaultSizes] : []
  }

  function onLayout(next: number[]): void {
    sizes.value = next
  }

  return {
    sizes,
    setSizes,
    resetSizes,
    onLayout,
  }
}
