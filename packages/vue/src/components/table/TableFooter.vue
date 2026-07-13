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
  /**
   * Number of columns the footer content should span.
   * Required for valid <tfoot> markup — content is wrapped in a single <tr><td>.
   */
  colspan?: number
}

const props = defineProps<Props>()
const ctx = useTableInject()
const slotFns = computed(() => tableVariants({ variant: ctx.variant.value }))

</script>

<template>
  <tfoot :class="composeClassName(slotFns.footer(), props.classNames?.footer)">
    <tr>
      <td
        :colspan="props.colspan"
        :class="slotFns.footerCell()"
      >
        <div :class="slotFns.footerContent()">
          <slot />
        </div>
      </td>
    </tr>
  </tfoot>
</template>
