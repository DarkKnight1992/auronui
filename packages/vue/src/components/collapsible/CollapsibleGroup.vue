<script setup lang="ts">
import { computed, toRef } from 'vue'
import { collapsibleGroupVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import {
  provideCollapsibleGroup,
  type CollapsibleGroupRegistryEntry,
} from './collapsible-group.context'
import Collapsible from './Collapsible.vue'
import CollapsibleTrigger from './CollapsibleTrigger.vue'
import CollapsibleContent from './CollapsibleContent.vue'

type CollapsibleShorthandItem = { title: string; content?: string; defaultOpen?: boolean; disabled?: boolean }

const props = withDefaults(defineProps<{
  // single-open = true means only one child open at a time
  singleOpen?: boolean
  class?: ClassValue
  /** Override classes for individual slots */
  classNames?: Partial<{
    base: ClassValue
  }>
  /** Shorthand API: render collapsibles from an array instead of the compound slot API */
  items?: CollapsibleShorthandItem[]
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
    <template v-if="props.items">
      <Collapsible
        v-for="(item, idx) in props.items"
        :key="idx"
        :default-open="item.defaultOpen"
        :disabled="item.disabled"
      >
        <CollapsibleTrigger>{{ item.title }}</CollapsibleTrigger>
        <CollapsibleContent>{{ item.content }}</CollapsibleContent>
      </Collapsible>
    </template>
    <slot v-else />
  </div>
</template>
