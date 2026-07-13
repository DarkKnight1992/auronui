import type { Component } from 'vue'
import type { ChipVariants } from '@auronui/styles'

export interface SidebarItemData {
  label: string
  href?: string
  /** Passthrough to Link's `as` — e.g. a router-link component for SPA navigation. */
  as?: string | object
  /** Iconify icon name (rendered via Icon), or a custom component. */
  icon?: string | Component
  badge?: string | number
  badgeColor?: ChipVariants['color']
  isDisabled?: boolean
  isExternal?: boolean
  /** Nested sub-links, always rendered (no collapse/expand). */
  items?: SidebarItemData[]
}

export interface SidebarSectionData {
  /** Omit for an unlabeled/flat section. */
  label?: string
  items: SidebarItemData[]
}
