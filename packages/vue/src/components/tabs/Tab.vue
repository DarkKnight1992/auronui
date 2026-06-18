<script setup lang="ts">
import { TabsTrigger } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'
import { useTabsInject } from './tabs.context'

const props = defineProps<{
  value: string
  disabled?: boolean
  class?: string
  /** Override classes for individual slots. */
  classNames?: Partial<{
    tab: string
  }>
}>()

const ctx = useTabsInject()
</script>

<template>
  <TabsTrigger
    :value="props.value"
    :disabled="props.disabled"
    :data-tab-value="props.value"
    :class="composeClassName(ctx.slotFns.value.tab(), props.class, props.classNames?.tab)"
  >
    <slot />
  </TabsTrigger>
</template>
