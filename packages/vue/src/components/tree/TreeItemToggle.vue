<script setup lang="ts">
import { treeVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  isExpanded?: boolean
  hasChildren?: boolean
  class?: string
  /** Override classes for specific slots */
  classNames?: Partial<{
    itemToggle: string
  }>
}>(), {
  isExpanded: false,
  hasChildren: true,
  class: undefined,
})

const slotFns = treeVariants()
</script>

<template>
  <button
    type="button"
    :class="composeClassName(slotFns.itemToggle(), props.class, props.classNames?.itemToggle)"
    :data-expanded="isExpanded ? '' : undefined"
    :data-no-children="!hasChildren ? '' : undefined"
    tabindex="-1"
    aria-hidden="true"
  >
    <slot>
      <!-- Default chevron icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </slot>
  </button>
</template>
