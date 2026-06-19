<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { TabsRoot } from 'reka-ui'
import { tabsVariants, type TabsVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useTabsProvide } from './tabs.context'

const props = withDefaults(defineProps<{
  modelValue?: string
  defaultValue?: string
  orientation?: 'horizontal' | 'vertical'
  variant?: TabsVariants['variant']
  activationMode?: 'automatic' | 'manual'
  class?: ClassValue
  /** Override classes for individual slots */
  classNames?: Partial<{
    base: ClassValue
  }>
}>(), {
  orientation: 'horizontal',
  variant: 'primary',
  activationMode: 'automatic',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const internalValue = ref<string | undefined>(props.modelValue ?? props.defaultValue)

watch(() => props.modelValue, (v) => {
  if (v !== undefined) internalValue.value = v
})

function changeTab(value: string) {
  internalValue.value = value
  emit('update:modelValue', value)
}

const slotFns = computed(() => tabsVariants({ variant: props.variant }))

useTabsProvide({
  slotFns,
  orientation: toRef(props, 'orientation'),
  currentValue: internalValue,
  changeTab,
})
</script>

<template>
  <TabsRoot
    :model-value="internalValue"
    :orientation="props.orientation"
    :activation-mode="props.activationMode"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    :data-orientation="props.orientation"
    @update:model-value="changeTab"
  >
    <slot />
  </TabsRoot>
</template>
