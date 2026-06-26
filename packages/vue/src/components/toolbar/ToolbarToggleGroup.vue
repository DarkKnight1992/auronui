<script setup lang="ts">
import { computed } from 'vue'
import { ToolbarToggleGroup as RekaToolbarToggleGroup } from 'reka-ui'
import { toggleButtonGroupVariants, type ToggleButtonVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useToolbarInject } from './toolbar.context'
import ToolbarToggleItem from './ToolbarToggleItem.vue'

type Single = string
type Multi = string[]
type ToolbarToggleShorthandItem = { value: string; label?: string; variant?: ToggleButtonVariants['variant']; size?: ToggleButtonVariants['size']; isIconOnly?: boolean; disabled?: boolean; class?: string }

const props = defineProps<{
  type: 'single' | 'multiple'
  modelValue?: Single | Multi
  defaultValue?: Single | Multi
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  isDetached?: boolean
  class?: string
  /** Shorthand API: render toggle items from an array instead of the compound slot API */
  items?: ToolbarToggleShorthandItem[]
  /** Whether to use roving focus for keyboard navigation */
  rovingFocus?: boolean
  /** Text direction */
  dir?: 'ltr' | 'rtl'
  /** Whether keyboard navigation loops around */
  loop?: boolean
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
  /** Form field name */
  name?: string
  /** Whether a value is required */
  required?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Single | Multi]
}>()

const ctx = useToolbarInject({ orientation: computed(() => 'horizontal' as const) })
const orientation = computed(() => props.orientation ?? ctx.orientation.value)

const classes = computed(() =>
  toggleButtonGroupVariants({ orientation: orientation.value, isDetached: props.isDetached ?? false }).base()
)
</script>

<template>
  <RekaToolbarToggleGroup
    :type="props.type"
    :model-value="props.modelValue"
    :default-value="props.defaultValue"
    :disabled="props.disabled"
    :roving-focus="props.rovingFocus"
    :dir="props.dir"
    :loop="props.loop"
    :as="props.as"
    :as-child="props.asChild"
    :name="props.name"
    :required="props.required"
    :class="composeClassName(classes, props.class)"
    @update:model-value="(v) => emit('update:modelValue', v as Single | Multi)"
  >
    <template v-if="props.items">
      <ToolbarToggleItem
        v-for="item in props.items"
        :key="item.value"
        :value="item.value"
        :variant="item.variant"
        :size="item.size"
        :is-icon-only="item.isIconOnly"
        :disabled="item.disabled"
        :class="item.class"
      >{{ item.label }}</ToolbarToggleItem>
    </template>
    <slot v-else />
  </RekaToolbarToggleGroup>
</template>
