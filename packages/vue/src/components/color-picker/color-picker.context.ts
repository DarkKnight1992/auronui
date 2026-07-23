import type { Ref } from 'vue'
import type { Color, ColorFormat } from 'reka-ui'
import { createContext } from '../../utils/context'
import type { UseColorStateReturn } from '../../composables/useColorState'

export interface ColorPickerContext {
  /** Reactive Color ref from useColorState. */
  color: Ref<Color>
  /** Imperative channel setters. Wrapped (not proxied directly from
   *  useColorState) to also reassert `rememberedHue` on every non-hue write —
   *  see `rememberedHue` below for why. */
  setChannel: UseColorStateReturn['setChannel']
  setChannels: UseColorStateReturn['setChannels']
  /**
   * The last known hue from a genuinely chromatic color (non-zero
   * saturation/brightness). Hue is mathematically undefined for a pure
   * black/white/gray color — R=G=B has no hue information at all, by
   * definition, regardless of what hue value was used to construct it — so
   * ColorArea dragging into a corner of the saturation/brightness plane
   * necessarily loses hue at that exact point. ColorSlider's hue channel
   * reads this instead of deriving hue from `color` directly, so it keeps
   * showing the last meaningful hue rather than snapping to red (hue 0)
   * whenever the area reaches white/black.
   */
  rememberedHue: Ref<number>
  /** Current output format for serialization. */
  format: Ref<ColorFormat>
  /** Emits the composed picker's v-model update. */
  emitUpdate: (value: string) => void
}

const {
  useProvide: provideColorPickerContext,
  useInject: useColorPickerInject,
  key: ColorPickerContextKey,
} = createContext<ColorPickerContext>('ColorPicker')

export { provideColorPickerContext, useColorPickerInject, ColorPickerContextKey }
