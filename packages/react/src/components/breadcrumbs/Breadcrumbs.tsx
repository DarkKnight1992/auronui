import { Children, Fragment, isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { breadcrumbsVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { BreadcrumbsProvider } from "./breadcrumbs.context";
import { BreadcrumbItem, withIsLast } from "./BreadcrumbItem";

export interface BreadcrumbShorthandItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsOwnProps {
  maxItems?: number;
  className?: ClassValue;
  /** Override classes on any named slot. */
  classNames?: Partial<{
    base: ClassValue;
    item: ClassValue;
    link: ClassValue;
    separator: ClassValue;
  }>;
  /** Shorthand API: render breadcrumb items from an array instead of the compound children API */
  items?: BreadcrumbShorthandItem[];
  /** Custom separator content, replacing the default chevron icon */
  separator?: ReactNode;
  children?: ReactNode;
}

export type BreadcrumbsProps = BreadcrumbsOwnProps &
  Omit<ComponentPropsWithoutRef<"nav">, keyof BreadcrumbsOwnProps>;

// Flatten Fragment children into a single array, mirroring
// Breadcrumbs.vue's flattenChildren() for the default-slot API.
function flattenChildren(nodes: ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  Children.forEach(nodes, (node) => {
    if (isValidElement(node) && node.type === Fragment) {
      out.push(...flattenChildren((node.props as { children?: ReactNode }).children));
    } else if (node !== null && node !== undefined && node !== false) {
      out.push(node);
    }
  });
  return out;
}

export function Breadcrumbs({
  maxItems,
  className,
  classNames,
  items,
  separator,
  children,
  ...rest
}: BreadcrumbsProps) {
  const slotFns = breadcrumbsVariants({});

  let renderedItems: ReactNode[];

  if (items) {
    type Entry = { item: BreadcrumbShorthandItem; isEllipsis: boolean };
    let entries: Entry[] = items.map((item) => ({ item, isEllipsis: false }));
    if (maxItems && items.length > maxItems && maxItems >= 2) {
      const first = entries[0];
      const tail = entries.slice(entries.length - (maxItems - 2));
      entries = [first, { item: { label: "…" }, isEllipsis: true }, ...tail];
    }
    renderedItems = entries.map((entry, idx) => {
      const isLast = idx === entries.length - 1;
      if (entry.isEllipsis) {
        return (
          <li
            key={`ellipsis-${idx}`}
            className={composeClassName(slotFns.item(), classNames?.item)}
            aria-hidden="true"
          >
            …
          </li>
        );
      }
      return (
        <BreadcrumbItem
          key={entry.item.href ?? entry.item.label ?? idx}
          href={entry.item.href}
          isLast={isLast}
          classNames={{ item: classNames?.item, link: classNames?.link, separator: classNames?.separator }}
        >
          {entry.item.label}
        </BreadcrumbItem>
      );
    });
  } else {
    const flat = flattenChildren(children);
    renderedItems = flat.map((child, idx) => withIsLast(child, idx === flat.length - 1));
  }

  return (
    <nav aria-label="Breadcrumb" className={className as string | undefined} {...rest}>
      <BreadcrumbsProvider value={{ slotFns, separator }}>
        <ol className={composeClassName(slotFns.base(), className, classNames?.base)}>{renderedItems}</ol>
      </BreadcrumbsProvider>
    </nav>
  );
}
