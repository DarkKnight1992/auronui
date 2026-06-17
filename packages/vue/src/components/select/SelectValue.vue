<script setup lang="ts">
import { SelectValue } from 'reka-ui'
import { useSelectInject, type SelectItemValue } from './Select.context'
import SelectOverflowChips from './SelectOverflowChips.vue'

const props = withDefaults(defineProps<{
  placeholder?: string
  class?: string
}>(), {
  placeholder: undefined,
  class: undefined,
})

const ctx = useSelectInject()
</script>

<template>
  <SelectValue
    :class="ctx.slots.value.value()"
    :placeholder="props.placeholder"
    data-slot="value"
  >
    <template #default="{ selectedLabel, modelValue }">
      <!-- Multiple mode: chips with overflow truncation -->
      <template v-if="ctx.multiple.value && Array.isArray(modelValue) && modelValue.length > 0">
        <SelectOverflowChips
          :values="(modelValue as SelectItemValue[])"
          :get-label="ctx.itemLabel"
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
