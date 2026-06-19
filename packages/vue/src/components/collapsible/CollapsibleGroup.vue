<script setup lang="ts">
import { computed, toRef } from 'vue'
import { collapsibleGroupVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import {
  provideCollapsibleGroup,
  type CollapsibleGroupRegistryEntry,
} from './collapsible-group.context'

const props = withDefaults(defineProps<{
  // single-open = true means only one child open at a time
  singleOpen?: boolean
  class?: ClassValue
  /** Override classes for individual slots */
  classNames?: Partial<{
    base: ClassValue
  }>
}>(), {
  singleOpen: false,
})

const registry = new Map<string, CollapsibleGroupRegistryEntry>()

provideCollapsibleGroup({
  allowMultiple: toRef(() => !props.singleOpen),
  register(entry) {
    registry.set(entry.id, entry)
  },
  unregister(id) {
    registry.delete(id)
  },
  notifyOpen(openingId: string) {
    if (props.singleOpen) {
      for (const [id, entry] of registry) {
        if (id !== openingId && entry.open.value) {
          entry.open.value = false
        }
      }
    }
  },
})

const slotFns = computed(() => collapsibleGroupVariants({}))
</script>

<template>
  <div :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)">
    <slot />
  </div>
</template>
