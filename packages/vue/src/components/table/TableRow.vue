<!-- Thin public re-export for consumers who want to compose their own body.
     Renders a single tr with role="row" and the row slot style. -->
<script setup lang="ts">
import { computed } from 'vue'
import { tableVariants } from '@auronui/styles'
import { useTableInject } from './table.context'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

interface Props {
  /** Additional classes to apply to the root element */
  class?: ClassValue
  /** Per-slot class overrides */
  classNames?: Partial<{
    row: ClassValue
  }>
}

const props = defineProps<Props>()

const ctx = useTableInject()
const slotFns = computed(() => tableVariants({ variant: ctx.variant.value }))
</script>

<template>
  <tr
    role="row"
    :class="composeClassName(slotFns.row(), props.class, props.classNames?.row)"
  >
    <slot />
  </tr>
</template>
