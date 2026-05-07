<script setup lang="ts">
import { computed } from 'vue'
import { Checkbox } from '../checkbox'
import type { Row, Table as TableInstance, RowData } from '@tanstack/vue-table'

const props = defineProps<{
  /** When row is provided, this cell is a body row checkbox. When absent, it's the header select-all. */
  row?: Row<RowData>
  /** Required for the header select-all variant */
  table?: TableInstance<RowData>
  ariaLabel?: string
}>()

const isIndeterminate = computed<boolean>(() => {
  if (!props.row && props.table) {
    return props.table.getIsSomeRowsSelected() && !props.table.getIsAllRowsSelected()
  }
  return false
})

const modelValue = computed<boolean>(() => {
  if (props.row) {
    return props.row.getIsSelected()
  }
  if (props.table) {
    return props.table.getIsAllRowsSelected()
  }
  return false
})

const disabled = computed(() => {
  if (props.row) return !props.row.getCanSelect()
  return false
})

function onToggle(nextChecked: boolean) {
  if (props.row) {
    props.row.toggleSelected(nextChecked)
  } else if (props.table) {
    props.table.toggleAllRowsSelected(nextChecked)
  }
}
</script>

<template>
  <Checkbox
    :model-value="modelValue"
    :is-indeterminate="isIndeterminate"
    :disabled="disabled"
    :aria-label="ariaLabel ?? (row ? 'Select row' : 'Select all rows')"
    @update:model-value="onToggle"
    @click.stop
  />
</template>
