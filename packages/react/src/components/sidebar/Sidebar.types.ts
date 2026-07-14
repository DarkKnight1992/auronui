import type { ComponentType, ReactNode } from "react";
import type { ChipVariants } from "@auronui/styles";

export interface SidebarItemData {
  label: string;
  href?: string;
  /** Passthrough to Link's `as` — e.g. a router link component for SPA navigation. */
  as?: React.ElementType;
  /** Iconify icon name (rendered via Icon), a custom component, or arbitrary node. */
  icon?: string | ComponentType | ReactNode;
  badge?: string | number;
  badgeColor?: ChipVariants["color"];
  isDisabled?: boolean;
  isExternal?: boolean;
  /** Nested sub-links, always rendered (no collapse/expand — only visibility toggles). */
  items?: SidebarItemData[];
}

export interface SidebarSectionData {
  /** Omit for an unlabeled/flat section. */
  label?: string;
  items: SidebarItemData[];
}
