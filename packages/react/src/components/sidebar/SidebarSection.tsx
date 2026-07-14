import { sidebarVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { SidebarItem } from "./SidebarItem";
import type { SidebarItemData } from "./Sidebar.types";

export interface SidebarSectionProps {
  label?: string;
  items?: SidebarItemData[];
  classNames?: Partial<{
    section: ClassValue;
    sectionHeading: ClassValue;
    sectionList: ClassValue;
    item: ClassValue;
    itemIcon: ClassValue;
    itemLabel: ClassValue;
    itemBadge: ClassValue;
  }>;
}

export function SidebarSection({ label, items, classNames }: SidebarSectionProps) {
  const styles = sidebarVariants();

  return (
    <div className={composeClassName(styles.section(), classNames?.section)}>
      {label && (
        <div className={composeClassName(styles.sectionHeading(), classNames?.sectionHeading)}>{label}</div>
      )}
      <ul className={composeClassName(styles.sectionList(), classNames?.sectionList)}>
        {items?.map((item) => (
          <li key={item.href ?? item.label}>
            <SidebarItem
              {...item}
              classNames={{
                item: classNames?.item,
                itemIcon: classNames?.itemIcon,
                itemLabel: classNames?.itemLabel,
                itemBadge: classNames?.itemBadge,
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
