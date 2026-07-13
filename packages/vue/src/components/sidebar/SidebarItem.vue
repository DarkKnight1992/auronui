<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { sidebarVariants, type ChipVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useSidebarInject } from './sidebar.context'
import Link from '../link/Link.vue'
import { Icon } from '../icon'
import Chip from '../chip/Chip.vue'
// Explicit self-import — Vue resolves this circular reference lazily at
// render time, which is the standard way to make a <script setup> SFC
// recursive without relying on filename-based name inference.
import SidebarItem from './SidebarItem.vue'
import type { SidebarItemData } from './Sidebar.types'

const props = withDefaults(
  defineProps<{
    label: string
    href?: string
    as?: string | object
    icon?: string | Component
    badge?: string | number
    badgeColor?: ChipVariants['color']
    isDisabled?: boolean
    isExternal?: boolean
    /** Nested sub-links, always rendered (no collapse/expand). */
    items?: SidebarItemData[]
    classNames?: Partial<{
      item: ClassValue
      itemIcon: ClassValue
      itemLabel: ClassValue
      itemBadge: ClassValue
    }>
  }>(),
  {
    href: undefined,
    as: undefined,
    icon: undefined,
    badge: undefined,
    badgeColor: undefined,
    isDisabled: undefined,
    isExternal: undefined,
    items: undefined,
    classNames: undefined,
  },
)

const ctx = useSidebarInject()
const slotFns = computed(() => sidebarVariants())

const isActive = computed(() => !!props.href && props.href === ctx.activeHref.value)
const iconName = computed(() => (typeof props.icon === 'string' ? props.icon : undefined))
const iconComponent = computed(() =>
  props.icon && typeof props.icon !== 'string' ? props.icon : undefined,
)
</script>

<template>
  <Link
    :href="props.href"
    :as="props.as"
    :is-disabled="props.isDisabled"
    :is-external="props.isExternal"
    :aria-current="isActive ? 'page' : undefined"
    :class="composeClassName(slotFns.item(), props.classNames?.item)"
  >
    <span
      v-if="props.icon"
      :class="composeClassName(slotFns.itemIcon(), props.classNames?.itemIcon)"
      aria-hidden="true"
    >
      <Icon
        v-if="iconName"
        :icon="iconName"
      />
      <component
        :is="iconComponent"
        v-else
      />
    </span>
    <span :class="composeClassName(slotFns.itemLabel(), props.classNames?.itemLabel)">
      {{ props.label }}
    </span>
    <Chip
      v-if="props.badge !== undefined"
      :color="props.badgeColor"
      size="sm"
      :class="composeClassName(slotFns.itemBadge(), props.classNames?.itemBadge)"
    >
      {{ props.badge }}
    </Chip>
  </Link>
  <ul
    v-if="props.items"
    :class="slotFns.itemChildren()"
  >
    <li
      v-for="child in props.items"
      :key="child.href ?? child.label"
    >
      <SidebarItem
        v-bind="child"
        :class-names="props.classNames"
      />
    </li>
  </ul>
</template>
