import { isValidElement, useState, type ComponentType, type ReactNode } from "react";
import { sidebarVariants, type ChipVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { Link } from "../link";
import { Icon } from "../icon";
import { Chip } from "../chip";
import { useSidebarContext, sidebarContextDefaults } from "./sidebar.context";
import type { SidebarItemData } from "./Sidebar.types";

export interface SidebarItemProps {
  label: string;
  href?: string;
  as?: React.ElementType;
  icon?: string | ComponentType | ReactNode;
  badge?: string | number;
  badgeColor?: ChipVariants["color"];
  isDisabled?: boolean;
  isExternal?: boolean;
  /** Nested sub-links. Collapsible via a toggle button; expanded by default. */
  items?: SidebarItemData[];
  classNames?: Partial<{
    item: ClassValue;
    itemIcon: ClassValue;
    itemLabel: ClassValue;
    itemBadge: ClassValue;
  }>;
}

function renderIcon(icon: SidebarItemProps["icon"]) {
  if (!icon) return null;
  if (typeof icon === "string") return <Icon icon={icon} />;
  if (isValidElement(icon)) return icon;
  const IconComponent = icon as ComponentType;
  return <IconComponent />;
}

export function SidebarItem({
  label,
  href,
  as,
  icon,
  badge,
  badgeColor,
  isDisabled,
  isExternal,
  items,
  classNames,
}: SidebarItemProps) {
  const ctx = useSidebarContext(sidebarContextDefaults);
  const styles = sidebarVariants();

  const isActive = !!href && href === ctx.activeHref;
  const hasChildren = !!items && items.length > 0;
  const isSearching = ctx.searchQuery.trim() !== "";

  // Manual toggle state — null means "no explicit user choice yet", in
  // which case children are expanded by default. Once the user explicitly
  // toggles, that choice sticks — only an active search temporarily forces
  // children open again, to surface matches.
  const [manuallyOpen, setManuallyOpen] = useState<boolean | null>(null);
  const showChildren = hasChildren && (isSearching || (manuallyOpen ?? true));

  function toggleChildren() {
    setManuallyOpen(!showChildren);
  }

  const iconNode = renderIcon(icon);

  return (
    <>
      <div className={styles.itemRow()}>
        {href ? (
          <Link
            href={href}
            as={as}
            isDisabled={isDisabled}
            isExternal={isExternal}
            aria-current={isActive ? "page" : undefined}
            className={composeClassName(styles.item(), classNames?.item)}
          >
            {iconNode && (
              <span className={composeClassName(styles.itemIcon(), classNames?.itemIcon)} aria-hidden="true">
                {iconNode}
              </span>
            )}
            <span className={composeClassName(styles.itemLabel(), classNames?.itemLabel)}>{label}</span>
            {badge !== undefined && (
              <Chip color={badgeColor} size="sm" className={composeClassName(classNames?.itemBadge)}>
                {badge}
              </Chip>
            )}
          </Link>
        ) : hasChildren ? (
          // No href but has children: the whole row is the toggle itself (a
          // plain Link with no href isn't focusable/interactive, so a real
          // <button> is used for correct keyboard/AT semantics).
          <button
            type="button"
            aria-expanded={showChildren}
            className={composeClassName(styles.item(), classNames?.item)}
            onClick={toggleChildren}
          >
            {iconNode && (
              <span className={composeClassName(styles.itemIcon(), classNames?.itemIcon)} aria-hidden="true">
                {iconNode}
              </span>
            )}
            <span className={composeClassName(styles.itemLabel(), classNames?.itemLabel)}>{label}</span>
            <span
              className={composeClassName(styles.itemToggle(), showChildren && "sidebar__item-toggle--open")}
              aria-hidden="true"
            >
              <ChevronIcon />
            </span>
          </button>
        ) : (
          <span className={composeClassName(styles.item(), classNames?.item)}>
            {iconNode && (
              <span className={composeClassName(styles.itemIcon(), classNames?.itemIcon)} aria-hidden="true">
                {iconNode}
              </span>
            )}
            <span className={composeClassName(styles.itemLabel(), classNames?.itemLabel)}>{label}</span>
          </span>
        )}
        {/* Separate toggle button, sibling to (never nested inside) the Link,
            only when the item both navigates AND has children — nesting a
            <button> inside an <a> would be an invalid/inaccessible
            interactive-in-interactive element. */}
        {href && hasChildren && (
          <button
            type="button"
            aria-expanded={showChildren}
            aria-label={`Toggle ${label}`}
            className={composeClassName(styles.itemToggle(), showChildren && "sidebar__item-toggle--open")}
            onClick={toggleChildren}
          >
            <ChevronIcon hidden />
          </button>
        )}
      </div>
      {showChildren && (
        <ul className={styles.itemChildren()}>
          {items!.map((child) => (
            <li key={child.href ?? child.label}>
              <SidebarItem {...child} classNames={classNames} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function ChevronIcon({ hidden }: { hidden?: boolean } = {}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={hidden ? "true" : undefined}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
