<script setup lang="ts">
import { computed, toRef } from 'vue'
import { TabsRoot } from 'reka-ui'
import { tabsVariants, type TabsVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useTabsProvide } from './tabs.context'

const props = withDefaults(defineProps<{
  modelValue?: string
  defaultValue?: string
  orientation?: 'horizontal' | 'vertical'
  variant?: TabsVariants['variant']
  activationMode?: 'automatic' | 'manual'
  class?: string
}>(), {
  orientation: 'horizontal',
  variant: 'primary',
  activationMode: 'automatic',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const slotFns = computed(() => tabsVariants({ variant: props.variant }))

useTabsProvide({
  slotFns,
  orientation: toRef(props, 'orientation'),
})
</script>

<template>
  <TabsRoot
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :orientation="props.orientation"
    :activation-mode="props.activationMode"
    :class="composeClassName(slotFns.base(), props.class)"
    :data-orientation="props.orientation"
    @update:model-value="(v: string) => emit('update:modelValue', v)"
  >
    <slot />
  </TabsRoot>
</template>
