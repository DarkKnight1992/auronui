import type { Ref } from 'vue'
import type { Color, ColorFormat } from 'reka-ui'
import { createContext } from '../../utils/context'
import type { UseColorStateReturn } from '../../composables/useColorState'

export interface ColorPickerContext {
  /** Reactive Color ref from useColorState. */
  color: Ref<Color>
  /** Imperative channel setters (proxied from useColorState). */
  setChannel: UseColorStateReturn['setChannel']
  setChannels: UseColorStateReturn['setChannels']
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
