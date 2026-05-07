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
    <template #default="{ modelValue }">
      <template v-if="modelValue != null && (Array.isArray(modelValue) ? modelValue.length > 0 : modelValue !== '')">
        {{ ctx.itemLabel(modelValue.toString()) }}
      </template>
      <template v-else>
        {{ props.placeholder }}
      </template>
    </template>
  </SelectValue>
</template>
