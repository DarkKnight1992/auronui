<script setup lang="ts">
import { TabsContent } from 'reka-ui'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useTabsInject } from './tabs.context'

const props = defineProps<{
  value: string
  forceMount?: boolean
  class?: ClassValue
  /** Custom classes to apply to specific slots */
  classNames?: Partial<{
    tabPanel: ClassValue
  }>
}>()

const ctx = useTabsInject()
</script>

<template>
  <TabsContent
    :value="props.value"
    :force-mount="props.forceMount"
    :class="composeClassName(ctx.slotFns.value.tabPanel(), props.class, props.classNames?.tabPanel)"
  >
    <slot />
  </TabsContent>
</template>
