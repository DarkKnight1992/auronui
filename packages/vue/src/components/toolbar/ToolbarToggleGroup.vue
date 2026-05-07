<script setup lang="ts">
import { computed } from 'vue'
import { ToolbarToggleGroup as RekaToolbarToggleGroup } from 'reka-ui'
import { toggleButtonGroupVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useToolbarInject } from './toolbar.context'

type Single = string
type Multi = string[]

const props = defineProps<{
  type: 'single' | 'multiple'
  modelValue?: Single | Multi
  defaultValue?: Single | Multi
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  isDetached?: boolean
  class?: string
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
    :class="composeClassName(classes, props.class)"
    @update:model-value="(v) => emit('update:modelValue', v as Single | Multi)"
  >
    <slot />
  </RekaToolbarToggleGroup>
</template>
