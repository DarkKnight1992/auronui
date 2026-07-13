<script setup lang="ts">
import { computed } from 'vue'
import { sidebarVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import SidebarItem from './SidebarItem.vue'
import type { SidebarItemData } from './Sidebar.types'

const props = withDefaults(
  defineProps<{
    label?: string
    items?: SidebarItemData[]
    classNames?: Partial<{
      section: ClassValue
      sectionHeading: ClassValue
      sectionList: ClassValue
      item: ClassValue
      itemIcon: ClassValue
      itemLabel: ClassValue
      itemBadge: ClassValue
    }>
  }>(),
  {
    label: undefined,
    items: undefined,
    classNames: undefined,
  },
)

const slotFns = computed(() => sidebarVariants())
</script>

<template>
  <div :class="composeClassName(slotFns.section(), props.classNames?.section)">
    <div
      v-if="props.label"
      :class="composeClassName(slotFns.sectionHeading(), props.classNames?.sectionHeading)"
    >
      {{ props.label }}
    </div>
    <ul :class="composeClassName(slotFns.sectionList(), props.classNames?.sectionList)">
      <template v-if="props.items">
        <li
          v-for="item in props.items"
          :key="item.href ?? item.label"
        >
          <SidebarItem
            v-bind="item"
            :class-names="{
              item: props.classNames?.item,
              itemIcon: props.classNames?.itemIcon,
              itemLabel: props.classNames?.itemLabel,
              itemBadge: props.classNames?.itemBadge,
            }"
          />
        </li>
      </template>
      <slot v-else />
    </ul>
  </div>
</template>
