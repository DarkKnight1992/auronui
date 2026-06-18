<script setup lang="ts">
import { computed } from 'vue'
import { tableVariants } from '@auronui/styles'
import { useTableInject } from './table.context'
import { composeClassName } from '@/utils/compose-class-name'

const ctx = useTableInject()
const slotFns = computed(() => tableVariants({ variant: ctx.variant.value }))

interface Props {
  /**
   * Override classes for specific slots.
   */
  classNames?: Partial<{
    footer: string
  }>
}

defineProps<Props>()
</script>

<template>
  <tfoot :class="composeClassName(slotFns.footer(), props.classNames?.footer)">
    <slot />
  </tfoot>
</template>
