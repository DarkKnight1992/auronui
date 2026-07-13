<script setup lang="ts">
import { computed } from 'vue'
import { sidebarVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useSidebarInject } from './sidebar.context'
import Input from '../input/Input.vue'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    classNames?: Partial<{ search: ClassValue }>
  }>(),
  {
    placeholder: 'Search',
    classNames: undefined,
  },
)

const ctx = useSidebarInject()
const slotFns = computed(() => sidebarVariants())
</script>

<template>
  <div :class="composeClassName(slotFns.search(), props.classNames?.search)">
    <Input
      v-model="ctx.searchQuery.value"
      type="search"
      :placeholder="props.placeholder"
      aria-label="Search sidebar links"
    />
  </div>
</template>
