<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { TabsRoot } from 'reka-ui'
import { tabsVariants, type TabsVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useTabsProvide } from './tabs.context'
import TabList from './TabList.vue'
import Tab from './Tab.vue'
import TabPanel from './TabPanel.vue'

type TabShorthandItem = { value: string; label: string; content?: string; disabled?: boolean }

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
  /** Shorthand API: render tabs from an array instead of the compound slot API */
  items?: TabShorthandItem[]
  /** Reading direction of the tabs. */
  dir?: 'ltr' | 'rtl'
  /** Whether to unmount tab panels when they are hidden. */
  unmountOnHide?: boolean
  /** Render as a different element type. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
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

watch(
  () => props.items,
  (items) => {
    if (items && items.length > 0 && !props.modelValue && !props.defaultValue && internalValue.value === undefined) {
      internalValue.value = items[0].value
    }
  },
  { immediate: true },
)

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
    :dir="props.dir"
    :unmount-on-hide="props.unmountOnHide"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    :data-orientation="props.orientation"
    @update:model-value="changeTab"
  >
    <template v-if="props.items">
      <TabList>
        <Tab
          v-for="item in props.items"
          :key="item.value"
          :value="item.value"
          :disabled="item.disabled"
        >{{ item.label }}</Tab>
      </TabList>
      <TabPanel
        v-for="item in props.items"
        :key="item.value"
        :value="item.value"
      >{{ item.content }}</TabPanel>
    </template>
    <slot v-else />
  </TabsRoot>
</template>
