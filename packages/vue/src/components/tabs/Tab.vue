<script setup lang="ts">
import { TabsTrigger } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'
import { useTabsInject } from './tabs.context'

const props = defineProps<{
  value: string
  disabled?: boolean
  class?: string
}>()

const ctx = useTabsInject()
</script>

<template>
  <TabsTrigger
    :value="props.value"
    :disabled="props.disabled"
    :class="composeClassName(ctx.slotFns.value.tab(), props.class)"
  >
    <slot />
  </TabsTrigger>
</template>
