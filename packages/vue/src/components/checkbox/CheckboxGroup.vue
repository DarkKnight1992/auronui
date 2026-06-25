<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { checkboxGroupVariants, type CheckboxGroupVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useCheckboxGroupProvide } from './checkbox-group.context'
import Checkbox from './Checkbox.vue'

type CheckboxShorthandItem = { value: string; label?: string; disabled?: boolean }

const props = withDefaults(defineProps<{
  variant?: CheckboxGroupVariants['variant']
  disabled?: boolean
  modelValue?: string[]
  defaultValue?: string[]
  name?: string
  orientation?: 'horizontal' | 'vertical'
  label?: string
  description?: string
  class?: string
  /** Shorthand API: render checkboxes from an array instead of the compound slot API */
  items?: CheckboxShorthandItem[]
}>(), {
  variant: 'primary',
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

// Provide context to child Checkboxes
useCheckboxGroupProvide({
  variant: toRef(props, 'variant'),
  disabled: toRef(props, 'disabled'),
  selectedValues: currentValues,
  toggleValue,
  name: toRef(props, 'name'),
})

const labelId = `checkbox-group-label-${Math.random().toString(36).slice(2, 8)}`

const groupClasses = computed(() =>
  checkboxGroupVariants({ variant: props.variant })
)
</script>

<template>
  <div
    role="group"
    :aria-labelledby="props.label ? labelId : undefined"
    :data-orientation="props.orientation"
    :class="composeClassName(groupClasses, props.class)"
  >
    <span
      v-if="props.label"
      :id="labelId"
      class="checkbox-group__label"
    >{{ props.label }}</span>
    <div class="checkbox-group__wrapper">
      <template v-if="props.items">
        <Checkbox
          v-for="item in props.items"
          :key="item.value"
          :value="item.value"
          :disabled="item.disabled"
        >{{ item.label ?? item.value }}</Checkbox>
      </template>
      <slot v-else />
    </div>
    <span
      v-if="props.description"
      class="checkbox-group__description"
    >{{ props.description }}</span>
  </div>
</template>
