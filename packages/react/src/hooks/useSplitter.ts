import { useCallback, useState } from "react";

export interface UseSplitterOptions {
  /** Initial panel sizes as percentages (0–100). Should sum to 100. */
  defaultSizes?: number[];
}

export interface UseSplitterReturn {
  /** Current array of panel sizes as percentages. */
  sizes: number[];
  /** Set panel sizes directly. */
  setSizes: (sizes: number[]) => void;
  /** Reset panel sizes to the values provided in `defaultSizes`. */
  resetSizes: () => void;
  /**
   * Pass as the `onLayout` handler on the SplitterGroup component.
   * Keeps `sizes` in sync when the user drags the resize handle.
   */
  onLayout: (sizes: number[]) => void;
}

/**
 * Tracks panel layout state for the SplitterGroup component.
 *
 * @example
 * ```tsx
 * const splitter = useSplitter({ defaultSizes: [30, 70] })
 * ```
 * ```tsx
 * <SplitterGroup onLayout={splitter.onLayout}>
 *   <SplitterPanel defaultSize={splitter.sizes[0] ?? 30} />
 *   <SplitterResizeHandle />
 *   <SplitterPanel defaultSize={splitter.sizes[1] ?? 70} />
 * </SplitterGroup>
 * ```
 */
export function useSplitter(options: UseSplitterOptions = {}): UseSplitterReturn {
  const [sizes, setSizesState] = useState<number[]>(
    options.defaultSizes ? [...options.defaultSizes] : [],
  );

  const setSizes = useCallback((next: number[]): void => setSizesState([...next]), []);

  const resetSizes = useCallback((): void => {
    setSizesState(options.defaultSizes ? [...options.defaultSizes] : []);
  }, [options.defaultSizes]);

  const onLayout = useCallback((next: number[]): void => setSizesState(next), []);

  return { sizes, setSizes, resetSizes, onLayout };
}
