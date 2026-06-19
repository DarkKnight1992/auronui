<script setup lang="ts">
import { TabsIndicator } from 'reka-ui'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useTabsInject } from './tabs.context'

const props = defineProps<{
  class?: ClassValue
  /** Override classes for individual slots */
  classNames?: Partial<{ tabIndicator: ClassValue }>
}>()
const ctx = useTabsInject()
</script>

<template>
  <TabsIndicator :class="composeClassName(ctx.slotFns.value.tabIndicator(), props.class, props.classNames?.tabIndicator)" />
</template>
