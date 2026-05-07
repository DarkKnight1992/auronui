import { createContext } from '../../utils/context'

export interface EmptyStateContext {
  // EmptyState has no visual variants — context exists for compound component structural pattern
  _brand: 'EmptyState'
}

export const {
  useProvide: useEmptyStateProvide,
  useInject: useEmptyStateInject,
} = createContext<EmptyStateContext>('EmptyState')
