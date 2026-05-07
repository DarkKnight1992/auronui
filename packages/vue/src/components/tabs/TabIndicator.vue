<script setup lang="ts">
import { TabsIndicator } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'
import { useTabsInject } from './tabs.context'

const props = defineProps<{ class?: string }>()
const ctx = useTabsInject()
</script>

<template>
  <TabsIndicator :class="composeClassName(ctx.slotFns.value.tabIndicator(), props.class)" />
</template>
