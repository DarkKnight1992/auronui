<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { switchGroupVariants, type SwitchGroupVariants, type SwitchVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useSwitchGroupProvide } from './switch-group.context'

const props = withDefaults(defineProps<{
  size?: SwitchVariants['size']
  disabled?: boolean
  modelValue?: string[]
  defaultValue?: string[]
  name?: string
  orientation?: SwitchGroupVariants['orientation']
  label?: string
  description?: string
  class?: string
}>(), {
  size: 'md',
  disabled: false,
  modelValue: undefined,
  defaultValue: undefined,
  name: undefined,
  orientation: 'vertical',
  label: undefined,
  description: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

// Internal state for uncontrolled mode
const internalValues = ref<string[]>(props.defaultValue ?? [])

// Current values: controlled (modelValue) or uncontrolled (internalValues)
const currentValues = computed(() => props.modelValue ?? internalValues.value)

// Toggle value in the selection list
function toggleValue(value: string) {
  const next = currentValues.value.includes(value)
    ? currentValues.value.filter(v => v !== value)
    : [...currentValues.value, value]
  internalValues.value = next
  emit('update:modelValue', next)
}

// Provide context to child Switches
useSwitchGroupProvide({
  size: toRef(props, 'size'),
  disabled: toRef(props, 'disabled'),
  selectedValues: currentValues,
  toggleValue,
  name: toRef(props, 'name'),
})

const labelId = `switch-group-label-${Math.random().toString(36).slice(2, 8)}`

const groupSlots = computed(() =>
  switchGroupVariants({ orientation: props.orientation })
)
</script>

<template>
  <div
    role="group"
    :aria-labelledby="props.label ? labelId : undefined"
    :data-orientation="props.orientation"
    :class="composeClassName(groupSlots.base(), props.class)"
  >
    <span
      v-if="props.label"
      :id="labelId"
      class="switch-group__label"
    >{{ props.label }}</span>
    <div :class="groupSlots.items()">
      <slot />
    </div>
    <span
      v-if="props.description"
      class="switch-group__description"
    >{{ props.description }}</span>
  </div>
</template>
