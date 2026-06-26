<script setup lang="ts">
import { TabsIndicator } from 'reka-ui'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useTabsInject } from './tabs.context'

const props = defineProps<{
  class?: ClassValue
  /** Override classes for individual slots */
  classNames?: Partial<{ tabIndicator: ClassValue }>
  /** Render as a different element type. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>()
const ctx = useTabsInject()
</script>

<template>
  <TabsIndicator :as="props.as" :as-child="props.asChild" :class="composeClassName(ctx.slotFns.value.tabIndicator(), props.class, props.classNames?.tabIndicator)" />
</template>
