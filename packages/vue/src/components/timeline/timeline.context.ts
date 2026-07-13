import type { ComputedRef } from 'vue'
import type { TimelineVariants } from '@auronui/styles'
import { createContext } from '../../utils/context'

export interface TimelineContext {
  orientation: ComputedRef<TimelineVariants['orientation']>
}

export const {
  useProvide: useTimelineProvide,
  useInject: useTimelineInject,
  key: timelineContextKey,
} = createContext<TimelineContext>('Timeline')
