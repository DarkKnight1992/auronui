<script setup lang="ts">
import { computed, ref } from 'vue'
import { sidebarVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useLocationPath } from '../../composables/useLocationPath'
import { useSidebarProvide } from './sidebar.context'
import SidebarSearch from './SidebarSearch.vue'
import SidebarSection from './SidebarSection.vue'
import EmptyState from '../empty-state/EmptyState.vue'
import type { SidebarItemData, SidebarSectionData } from './Sidebar.types'

const props = withDefaults(
  defineProps<{
    sections?: SidebarSectionData[]
    /** Controlled active link; overrides auto-detection when set. */
    activeHref?: string
    /** Opt-in sticky search box at the top of the sidebar. */
    search?: boolean
    searchPlaceholder?: string
    ariaLabel?: string
    class?: ClassValue
    classNames?: Partial<{
      base: ClassValue
      search: ClassValue
      content: ClassValue
      section: ClassValue
      sectionHeading: ClassValue
      sectionList: ClassValue
      item: ClassValue
      itemIcon: ClassValue
      itemLabel: ClassValue
      itemBadge: ClassValue
      empty: ClassValue
    }>
  }>(),
  {
    sections: undefined,
    activeHref: undefined,
    search: false,
    searchPlaceholder: 'Search',
    ariaLabel: 'Sidebar',
    class: undefined,
    classNames: undefined,
  },
)

const slotFns = computed(() => sidebarVariants())

const locationPath = useLocationPath()
const activeHref = computed(() => props.activeHref ?? locationPath.value)

const searchQuery = ref('')

useSidebarProvide({
  activeHref,
  searchQuery,
})

function itemMatches(item: SidebarItemData, query: string): boolean {
  return item.label.toLowerCase().includes(query.toLowerCase())
}

const filteredSections = computed(() => {
  if (!props.sections) return []
  const query = searchQuery.value.trim()
  if (!query) return props.sections
  return props.sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => itemMatches(item, query)),
    }))
    .filter((section) => section.items.length > 0)
})

const hasNoResults = computed(
  () =>
    props.sections !== undefined &&
    searchQuery.value.trim() !== '' &&
    filteredSections.value.length === 0,
)
</script>

<template>
  <nav
    :aria-label="ariaLabel"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
  >
    <SidebarSearch
      v-if="search"
      :placeholder="searchPlaceholder"
      :class-names="{ search: props.classNames?.search }"
    />
    <div :class="composeClassName(slotFns.content(), props.classNames?.content)">
      <template v-if="props.sections">
        <EmptyState
          v-if="hasNoResults"
          :class="composeClassName(slotFns.empty(), props.classNames?.empty)"
        >
          No results found
        </EmptyState>
        <SidebarSection
          v-for="(section, sectionIndex) in filteredSections"
          :key="section.label ?? sectionIndex"
          :label="section.label"
          :items="section.items"
          :class-names="{
            section: props.classNames?.section,
            sectionHeading: props.classNames?.sectionHeading,
            sectionList: props.classNames?.sectionList,
            item: props.classNames?.item,
            itemIcon: props.classNames?.itemIcon,
            itemLabel: props.classNames?.itemLabel,
            itemBadge: props.classNames?.itemBadge,
          }"
        />
      </template>
      <slot v-else />
    </div>
  </nav>
</template>
