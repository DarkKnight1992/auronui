<script setup lang="ts" generic="TData extends RowData = RowData">
import { computed } from 'vue'
import { Checkbox } from '../checkbox'
import type { Row, Table as TableInstance, RowData } from '@tanstack/vue-table'

const props = defineProps<{
  /** When row is provided, this cell is a body row checkbox. When absent, it's the header select-all. */
  row?: Row<TData>
  /** Required for the header select-all variant */
  table?: TableInstance<TData>
  ariaLabel?: string
}>()

// Header select-all is scoped to the *current page* (getIsAllPageRowsSelected/
// toggleAllPageRowsSelected), not the whole filtered dataset
// (getIsAllRowsSelected/toggleAllRowsSelected) — otherwise "select all" under
// client-side pagination silently selects rows on pages the user never saw.
// When pagination is disabled, TanStack's page row model falls back to the
// full row model, so these page-scoped APIs are safe to use unconditionally.
const isIndeterminate = computed<boolean>(() => {
  if (!props.row && props.table) {
    return props.table.getIsSomePageRowsSelected()
  }
  return false
})

const modelValue = computed<boolean>(() => {
  if (props.row) {
    return props.row.getIsSelected()
  }
  if (props.table) {
    return props.table.getIsAllPageRowsSelected()
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
    props.table.toggleAllPageRowsSelected(nextChecked)
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
