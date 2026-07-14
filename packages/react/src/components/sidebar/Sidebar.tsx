import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { sidebarVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useLocationPath } from "../../hooks/useLocationPath";
import { EmptyState } from "../empty-state";
import { SidebarProvider } from "./sidebar.context";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSection } from "./SidebarSection";
import type { SidebarItemData, SidebarSectionData } from "./Sidebar.types";

export interface SidebarOwnProps {
  sections?: SidebarSectionData[];
  /** Controlled active link; overrides auto-detection when set. */
  activeHref?: string;
  /** Opt-in sticky search box at the top of the sidebar. */
  search?: boolean;
  searchPlaceholder?: string;
  ariaLabel?: string;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    search: ClassValue;
    content: ClassValue;
    section: ClassValue;
    sectionHeading: ClassValue;
    sectionList: ClassValue;
    item: ClassValue;
    itemIcon: ClassValue;
    itemLabel: ClassValue;
    itemBadge: ClassValue;
    empty: ClassValue;
  }>;
  children?: ReactNode;
}

export type SidebarProps = SidebarOwnProps & Omit<ComponentPropsWithoutRef<"nav">, keyof SidebarOwnProps>;

// A parent matches if its own label matches, or any descendant does — the
// whole branch (parent + all children) stays visible on a descendant match,
// since Sidebar doesn't do partial-subtree filtering.
function itemMatches(item: SidebarItemData, query: string): boolean {
  if (item.label.toLowerCase().includes(query)) return true;
  return item.items?.some((child) => itemMatches(child, query)) ?? false;
}

export function Sidebar({
  sections,
  activeHref: activeHrefProp,
  search = false,
  searchPlaceholder = "Search",
  ariaLabel = "Sidebar",
  className,
  classNames,
  children,
  ...rest
}: SidebarProps) {
  const styles = sidebarVariants();

  const locationPath = useLocationPath();
  const activeHref = activeHrefProp ?? locationPath;

  const [searchQuery, setSearchQuery] = useState("");

  const query = searchQuery.trim().toLowerCase();
  const filteredSections = !sections
    ? []
    : query === ""
      ? sections
      : sections
          .map((section) => ({
            ...section,
            items: section.items.filter((item) => itemMatches(item, query)),
          }))
          .filter((section) => section.items.length > 0);

  const hasNoResults = sections !== undefined && query !== "" && filteredSections.length === 0;

  return (
    <nav aria-label={ariaLabel} className={composeClassName(styles.base(), className, classNames?.base)} {...rest}>
      <SidebarProvider value={{ activeHref, searchQuery, setSearchQuery }}>
        {search && <SidebarSearch placeholder={searchPlaceholder} classNames={{ search: classNames?.search }} />}
        <div className={composeClassName(styles.content(), classNames?.content)}>
          {sections ? (
            <>
              {hasNoResults && (
                <EmptyState className={composeClassName(styles.empty(), classNames?.empty)}>
                  No results found
                </EmptyState>
              )}
              {filteredSections.map((section, sectionIndex) => (
                <SidebarSection
                  key={section.label ?? sectionIndex}
                  label={section.label}
                  items={section.items}
                  classNames={{
                    section: classNames?.section,
                    sectionHeading: classNames?.sectionHeading,
                    sectionList: classNames?.sectionList,
                    item: classNames?.item,
                    itemIcon: classNames?.itemIcon,
                    itemLabel: classNames?.itemLabel,
                    itemBadge: classNames?.itemBadge,
                  }}
                />
              ))}
            </>
          ) : (
            children
          )}
        </div>
      </SidebarProvider>
    </nav>
  );
}
