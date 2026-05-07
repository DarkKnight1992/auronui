import { inject, provide, type InjectionKey, type Ref } from 'vue'

export interface CollapsibleGroupRegistryEntry {
  id: string
  open: Ref<boolean>
}

export interface CollapsibleGroupContext {
  allowMultiple: Ref<boolean>
  register: (entry: CollapsibleGroupRegistryEntry) => void
  unregister: (id: string) => void
  // Called by a Collapsible when it opens; in single-open mode this closes siblings.
  notifyOpen: (openingId: string) => void
}

export const collapsibleGroupKey: InjectionKey<CollapsibleGroupContext> = Symbol('CollapsibleGroup')

export function provideCollapsibleGroup(ctx: CollapsibleGroupContext): void {
  provide(collapsibleGroupKey, ctx)
}

export function injectCollapsibleGroup(): CollapsibleGroupContext | null {
  return inject(collapsibleGroupKey, null)
}
