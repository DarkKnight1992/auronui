<script setup lang="ts">
import { TabsIndicator } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'
import { useTabsInject } from './tabs.context'

const props = defineProps<{
  class?: string
  /** Override classes for individual slots */
  classNames?: Partial<{ tabIndicator: string }>
}>()
const ctx = useTabsInject()
</script>

<template>
  <TabsIndicator :class="composeClassName(ctx.slotFns.value.tabIndicator(), props.class, props.classNames?.tabIndicator)" />
</template>
