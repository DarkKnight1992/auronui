<!-- Thin public re-export for consumers who want to compose their own body.
     Renders a single tr with role="row" and the row slot style. -->
<script setup lang="ts">
import { computed } from 'vue'
import { tableVariants } from '@auronui/styles'
import { useTableInject } from './table.context'

const ctx = useTableInject()
const slotFns = computed(() => tableVariants({ variant: ctx.variant.value }))
</script>

<template>
  <tr
    role="row"
    :class="slotFns.row()"
  >
    <slot />
  </tr>
</template>
