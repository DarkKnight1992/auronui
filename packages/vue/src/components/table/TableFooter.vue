<script setup lang="ts">
import { computed } from 'vue'
import { tableVariants } from '@auronui/styles'
import { useTableInject } from './table.context'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

interface Props {
  /**
   * Override classes for specific slots.
   */
  classNames?: Partial<{
    footer: ClassValue
  }>
}

const props = defineProps<Props>()
const ctx = useTableInject()
const slotFns = computed(() => tableVariants({ variant: ctx.variant.value }))

</script>

<template>
  <tfoot :class="composeClassName(slotFns.footer(), props.classNames?.footer)">
    <slot />
  </tfoot>
</template>
