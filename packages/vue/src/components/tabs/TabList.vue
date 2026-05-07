<script setup lang="ts">
import { TabsList } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'
import { useTabsInject } from './tabs.context'

const props = defineProps<{
  loop?: boolean
  class?: string
}>()

const ctx = useTabsInject()
</script>

<template>
  <TabsList
    :loop="props.loop ?? true"
    :class="composeClassName(ctx.slotFns.value.tabList(), props.class)"
  >
    <slot />
  </TabsList>
</template>
