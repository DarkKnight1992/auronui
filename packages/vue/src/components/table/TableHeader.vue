<script setup lang="ts">
import { computed } from 'vue'
import { FlexRender, type Header } from '@tanstack/vue-table'
import { tableVariants } from '@auronui/styles'
import { useTableInject } from './table.context'

const ctx = useTableInject()
const slotFns = computed(() => tableVariants({ variant: ctx.variant.value }))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAriaSort(header: Header<any, unknown>): 'ascending' | 'descending' | 'none' | undefined {
  if (!header.column.getCanSort()) return undefined
  const dir = header.column.getIsSorted()
  if (dir === 'asc') return 'ascending'
  if (dir === 'desc') return 'descending'
  return 'none'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onHeaderActivate(header: Header<any, unknown>, event: MouseEvent | KeyboardEvent) {
  if (!header.column.getCanSort()) return
  const handler = header.column.getToggleSortingHandler()
  if (handler) handler(event)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onHeaderKeydown(header: Header<any, unknown>, event: KeyboardEvent) {
  if (event.key !== ' ' && event.key !== 'Enter') return
  if (!header.column.getCanSort()) return
  event.preventDefault()
  onHeaderActivate(header, event)
}
</script>

<template>
  <thead :class="slotFns.header()">
    <tr
      v-for="headerGroup in ctx.table.getHeaderGroups()"
      :key="headerGroup.id"
      role="row"
      :class="slotFns.row()"
    >
      <th
        v-for="(header, colIndex) in headerGroup.headers"
        :key="header.id"
        role="columnheader"
        :class="slotFns.column()"
        :data-col-index="colIndex"
        :data-row-index="-1"
        :aria-sort="getAriaSort(header)"
        :data-allows-sorting="header.column.getCanSort() ? 'true' : undefined"
        :tabindex="header.column.getCanSort() ? 0 : undefined"
        @click="onHeaderActivate(header, $event)"
        @keydown="onHeaderKeydown(header, $event)"
      >
        <FlexRender
          v-if="!header.isPlaceholder"
          :render="header.column.columnDef.header"
          :props="header.getContext()"
        />
      </th>
    </tr>
  </thead>
</template>
