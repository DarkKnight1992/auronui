import type { ComputedRef, InjectionKey } from 'vue'
import type { SplitterVariants } from '@auronui/styles'

export interface SplitterGroupContext {
  direction: ComputedRef<SplitterVariants['direction']>
}

export const splitterContextKey = Symbol('SplitterGroup') as InjectionKey<SplitterGroupContext>
