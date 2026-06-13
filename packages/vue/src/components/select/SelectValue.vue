<script setup lang="ts">
import { SelectValue } from 'reka-ui'
import { useSelectInject } from './Select.context'

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
      <!--
        Label resolution order:
        1. Reka's native selectedLabel — populated via optionsSet once items mount
           (works after first open, and in real browsers via DocumentFragment path)
        2. itemRegistry label — populated at setup time for items with explicit
           textValue prop, or at onMounted for slot-text items after first open
        3. Placeholder when no value is selected
      -->
      <template v-if="selectedLabel && selectedLabel.length > 0">
        {{ selectedLabel.join(', ') }}
      </template>
      <template v-else-if="modelValue != null && (Array.isArray(modelValue) ? modelValue.length > 0 : modelValue !== '')">
        {{ ctx.itemLabel(Array.isArray(modelValue) ? modelValue : modelValue.toString()) }}
      </template>
      <template v-else>
        {{ props.placeholder }}
      </template>
    </template>
  </SelectValue>
</template>
