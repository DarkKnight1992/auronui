<script setup lang="ts">
import { computed, ref } from 'vue'
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
    /** Nested sub-links. Collapsible via a toggle button; expanded by default. */
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

const hasChildren = computed(() => !!props.items && props.items.length > 0)
const isSearching = computed(() => ctx.searchQuery.value.trim() !== '')

// Manual toggle state — null means "no explicit user choice yet", in which
// case children are expanded by default. Once the user explicitly toggles,
// that choice sticks (including across the item containing the active
// link) — only an active search temporarily forces children open again, to
// surface matches, since that's a mode the user actively initiated.
const manuallyOpen = ref<boolean | null>(null)
const showChildren = computed(() => {
  if (!hasChildren.value) return false
  if (isSearching.value) return true
  return manuallyOpen.value ?? true
})

function toggleChildren(): void {
  manuallyOpen.value = !showChildren.value
}
</script>

<template>
  <div :class="slotFns.itemRow()">
    <Link
      v-if="props.href"
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
    <!--
      No href but has children: the whole row is the toggle itself (a plain Link
      with no href isn't focusable/interactive, so a real <button> is used for
      correct keyboard/AT semantics). Its own inline chevron is decorative only —
      the button itself carries aria-expanded.
    -->
    <button
      v-else-if="hasChildren"
      type="button"
      :aria-expanded="showChildren"
      :class="composeClassName(slotFns.item(), props.classNames?.item)"
      @click="toggleChildren"
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
      <span
        :class="slotFns.itemToggle()"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </span>
    </button>
    <span
      v-else
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
    </span>
    <!--
      Separate toggle button, sibling to (never nested inside) the Link, only
      when the item both navigates AND has children — nesting a <button>
      inside an <a> would be an invalid/inaccessible interactive-in-interactive
      element.
    -->
    <button
      v-if="props.href && hasChildren"
      type="button"
      :aria-expanded="showChildren"
      :aria-label="`Toggle ${props.label}`"
      :class="slotFns.itemToggle()"
      @click="toggleChildren"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
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
    </button>
  </div>
  <ul
    v-if="showChildren"
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
