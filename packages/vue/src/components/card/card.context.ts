import { createContext } from '../../utils/context'
import type { Ref } from 'vue'
import type { CardVariants } from '@auronui/styles'

export interface CardContext {
  variant: Ref<CardVariants['variant']>
  shadow: Ref<CardVariants['shadow']>
  radius: Ref<CardVariants['radius']>
  isHoverable: Ref<CardVariants['isHoverable']>
  isPressable: Ref<CardVariants['isPressable']>
  isDisabled: Ref<CardVariants['isDisabled']>
  fullWidth: Ref<CardVariants['fullWidth']>
}

export const {
  useProvide: useCardProvide,
  useInject: useCardInject,
  key: cardContextKey,
} = createContext<CardContext>('Card')
