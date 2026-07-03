<script setup lang="ts">
import { SelectValue } from 'reka-ui'
import { useSelectInject, type SelectItemValue } from './Select.context'
import SelectOverflowChips from './SelectOverflowChips.vue'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  placeholder?: string
  class?: string
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
  /** Per-slot class overrides */
  classNames?: Partial<{
    value: ClassValue
    chip: Partial<{
      base: ClassValue
      dot: ClassValue
      startContent: ClassValue
      label: ClassValue
      endContent: ClassValue
      closeButton: ClassValue
    }>
  }>
}>(), {
  placeholder: undefined,
  class: undefined,
  as: undefined,
  asChild: false,
})

const ctx = useSelectInject()
</script>

<template>
  <SelectValue
    :class="composeClassName(ctx.slots.value.value(), props.classNames?.value)"
    :placeholder="props.placeholder"
    :as="props.as"
    :as-child="props.asChild"
    data-slot="value"
  >
    <template #default="{ selectedLabel, modelValue }">
      <!-- Multiple mode: chips with overflow truncation -->
      <template v-if="ctx.multiple.value && Array.isArray(modelValue) && modelValue.length > 0">
        <SelectOverflowChips
          :values="(modelValue as SelectItemValue[])"
          :get-label="ctx.itemLabel"
          :class-names="{ chip: props.classNames?.chip }"
        />
      </template>
      <!-- Multiple mode: nothing selected yet -->
      <template v-else-if="ctx.multiple.value">
        {{ props.placeholder }}
      </template>
      <!--
        Single mode label resolution:
        1. Reka's native selectedLabel — populated via optionsSet once items mount
        2. itemRegistry label — populated at setup time for items with explicit textValue
        3. Placeholder when no value is selected
      -->
      <template v-else-if="selectedLabel && selectedLabel.length > 0">
        {{ selectedLabel.join(', ') }}
      </template>
      <template v-else-if="modelValue != null && (Array.isArray(modelValue) ? modelValue.length > 0 : modelValue !== '')">
        {{ ctx.itemLabel(modelValue as SelectItemValue | SelectItemValue[]) }}
      </template>
      <template v-else>
        {{ props.placeholder }}
      </template>
    </template>
  </SelectValue>
</template>
