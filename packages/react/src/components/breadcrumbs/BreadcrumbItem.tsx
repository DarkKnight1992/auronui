import { cloneElement, isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { composeClassName, type ClassValue } from "../../utils";
import { useBreadcrumbsContext } from "./breadcrumbs.context";

export interface BreadcrumbItemOwnProps {
  href?: string;
  /** Injected by Breadcrumbs on the last visible item — not meant to be set directly. */
  isLast?: boolean;
  className?: ClassValue;
  classNames?: Partial<{
    item: ClassValue;
    link: ClassValue;
    separator: ClassValue;
  }>;
  children?: ReactNode;
}

export type BreadcrumbItemProps = BreadcrumbItemOwnProps &
  Omit<ComponentPropsWithoutRef<"li">, keyof BreadcrumbItemOwnProps>;

function DefaultSeparatorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

export function BreadcrumbItem({
  href,
  isLast = false,
  className,
  classNames,
  children,
  ...rest
}: BreadcrumbItemProps) {
  const ctx = useBreadcrumbsContext();

  return (
    <li
      className={composeClassName(ctx.slotFns.item(), className, classNames?.item)}
      aria-current={isLast ? "page" : undefined}
      {...rest}
    >
      {href && !isLast ? (
        <a href={href} className={composeClassName(ctx.slotFns.link(), classNames?.link)}>
          {children}
        </a>
      ) : (
        <span className={composeClassName(ctx.slotFns.link(), classNames?.link)}>{children}</span>
      )}
      {!isLast && (
        <span
          className={composeClassName(ctx.slotFns.separator(), classNames?.separator)}
          aria-hidden="true"
        >
          {ctx.separator ?? <DefaultSeparatorIcon />}
        </span>
      )}
    </li>
  );
}

/**
 * Clones an already-rendered BreadcrumbItem element with `isLast` set —
 * mirrors Breadcrumbs.vue's `cloneVNode(vnode, { isLast: true })` for the
 * default-children compound API.
 */
export function withIsLast(element: ReactNode, isLast: boolean): ReactNode {
  if (isValidElement<BreadcrumbItemProps>(element)) {
    return cloneElement(element, { isLast });
  }
  return element;
}
