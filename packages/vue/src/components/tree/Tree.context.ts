import type { ComputedRef, InjectionKey } from 'vue'
import type { TreeVariants } from '@auronui/styles'

export interface TreeContext {
  size: ComputedRef<TreeVariants['size']>
  getChildren: (item: unknown) => unknown[] | undefined
}

export const treeContextKey = Symbol('Tree') as InjectionKey<TreeContext>
